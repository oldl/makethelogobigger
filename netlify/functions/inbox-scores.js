const SCORE_TABLE = "inbox_scores";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  return { url, key };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders()
    },
    body: JSON.stringify(body)
  };
}

function validateEntry(entry) {
  const playerName = String(entry.player_name || "").trim().slice(0, 18).toUpperCase();
  const playerId = String(entry.player_id || "").trim().slice(0, 80);
  const score = Number(entry.score);
  const level = Number(entry.level);
  if (!playerName || !playerId) return null;
  if (!Number.isFinite(score) || !Number.isFinite(level)) return null;
  return {
    player_id: playerId,
    player_name: playerName,
    score: Math.max(0, Math.round(score)),
    level: Math.max(0, Math.round(level))
  };
}

async function fetchSupabase(path, options = {}) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) throw new Error("Missing Supabase server configuration");
  return fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...options.headers
    }
  });
}

exports.handler = async event => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  try {
    if (event.httpMethod === "GET") {
      const response = await fetchSupabase(
        `${SCORE_TABLE}?select=player_id,player_name,score,level,created_at&order=score.desc&limit=10`
      );
      const body = await response.text();
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          ...corsHeaders()
        },
        body
      };
    }

    if (event.httpMethod === "POST") {
      const payload = validateEntry(JSON.parse(event.body || "{}"));
      if (!payload) return json(400, { error: "Invalid score payload" });
      const response = await fetchSupabase(SCORE_TABLE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const text = await response.text();
        return json(response.status, { error: "Supabase rejected score", detail: text });
      }
      return json(201, { ok: true });
    }

    return json(405, { error: "Method not allowed" });
  } catch (error) {
    return json(500, { error: "Score proxy failed", detail: String(error && error.message ? error.message : error) });
  }
};
