"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const levelEl = document.getElementById("level");
const livesEl = document.getElementById("lives");
const livesReadoutEl = document.getElementById("livesReadout");
const focusFill = document.querySelector("#focusBar em");
const healthFill = document.querySelector("#healthBar em");
const focusPercentEl = document.getElementById("focusPercent");
const heatFill = document.querySelector("#heatBar em");
const heatPercentEl = document.getElementById("heatPercent");
const soundButton = document.querySelector("[data-action='mute']");
const playerNameInput = document.getElementById("playerNameInput");
const playerReadout = document.getElementById("playerReadout");
const playerAvatarPreview = document.getElementById("playerAvatarPreview");
const setupAvatarPreview = document.getElementById("setupAvatarPreview");
const setupPilotName = document.getElementById("setupPilotName");
const setupPilotClass = document.getElementById("setupPilotClass");
const avatarGrid = document.getElementById("avatarGrid");
const leaderboardList = document.getElementById("leaderboardList");
const leaderboardMode = document.getElementById("leaderboardMode");
const commandDock = document.getElementById("commandDock");
const commandDockPrimary = document.getElementById("commandDockPrimary");
const commandDockTabs = Array.from(document.querySelectorAll("[data-screen-tab]"));

const screens = {
  start: document.getElementById("startScreen"),
  playerSetup: document.getElementById("playerSetupScreen"),
  how: document.getElementById("howScreen"),
  pause: document.getElementById("pauseScreen"),
  gameOver: document.getElementById("gameOverScreen"),
  victory: document.getElementById("victoryScreen"),
  leaderboard: document.getElementById("leaderboardScreen")
};

let W = canvas.width;
let H = canvas.height;
const colors = ["#34d957", "#19e3e3", "#ff3d9a", "#ffd23d", "#ff3b3b"];
const enemyTypes = ["email", "meeting", "call", "ppt", "word", "excel", "chat", "jira", "urgent", "popup", "rock", "windouf", "blue_screen", "blue_screen", "blue_screen", "dgc", "dgc", "dgc", "as400", "praat_barak", "po_japon", "ezf", "magnolia", "consultant", "handover", "last_update", "mfa_loop", "vpn_down", "security_patch", "lazy_loading", "infinite_versions"];
const fallbackEnemyTypes = ["email", "meeting", "call", "ppt", "word", "excel", "chat", "jira", "urgent", "popup", "rock", "windouf", "blue_screen", "blue_screen", "blue_screen", "dgc", "dgc", "dgc", "as400", "praat_barak", "po_japon", "ezf", "magnolia", "consultant", "handover", "last_update", "mfa_loop", "vpn_down", "security_patch", "lazy_loading", "infinite_versions"];
const enemyLabels = {
  email: "EMAIL",
  meeting: "DOUBLE MEETING",
  call: "CALL",
  ppt: "PPT",
  word: "DOCX",
  excel: "CPU",
  chat: "LOST FILES",
  jira: "TICKET JIRA",
  urgent: "12H!!!!",
  popup: "ERROR 404",
  rock: "ROCK",
  windouf: "WINDOUF UPDATE",
  blue_screen: "REF IS DOWN!",
  dgc: "DGC",
  as400: "AS400",
  praat_barak: "PRAAT BARAK",
  po_japon: "PO AU JAPON",
  ezf: "EZF",
  magnolia: "MAGNOLIA",
  consultant: "CONSULTANT",
  handover: "HANDOVER",
  last_update: "PASSKEY",
  mfa_loop: "EASY FORM",
  vpn_down: "SUNDAY RELEASE",
  security_patch: "HANDOVER",
  lazy_loading: "LAZY LOADING",
  infinite_versions: "INFINITE VERSIONS",
  question: "ERROR 404"
};
const enemyLabelColors = {
  email: "#ff6f8f",
  meeting: "#ff9f1a",
  call: "#ff4b4b",
  ppt: "#b56cff",
  word: "#2fc7ff",
  excel: "#2ee85d",
  chat: "#58d6ff",
  jira: "#ff3d9a",
  urgent: "#ff3b3b",
  popup: "#7cff4f",
  rock: "#9b92c8",
  windouf: "#36a3ff",
  blue_screen: "#2f7dff",
  dgc: "#ffd23d",
  as400: "#34d957",
  praat_barak: "#ff3d9a",
  po_japon: "#ff8a1a",
  ezf: "#b56cff",
  magnolia: "#ff9ad5",
  consultant: "#2f7dff",
  handover: "#b56cff",
  last_update: "#ff8a1a",
  mfa_loop: "#b56cff",
  vpn_down: "#19e3e3",
  security_patch: "#ffd23d",
  lazy_loading: "#9bffff",
  infinite_versions: "#b56cff",
  question: "#7cff4f"
};
const imageSpriteSources = {
  email: "assets/email.png",
  meeting: "assets/double meeting.png",
  call: "assets/call.png",
  ppt: "assets/ppt.png",
  word: "assets/docx.png",
  excel: "assets/cpu.png",
  chat: "assets/no access file.png",
  jira: "assets/ticket jira.png",
  urgent: "assets/12h!!!!.png",
  popup: "assets/error 404.png",
  rock: "assets/rock.png",
  windouf: "assets/windouf update.png",
  blue_screen: "assets/ref_is_down.png",
  dgc: "assets/dgc.png",
  as400: "assets/as400.png",
  praat_barak: "assets/praatbarak.png",
  po_japon: "assets/7b47e6e9-510a-4887-9207-0725d9d68171_removalai_preview.png",
  ezf: "assets/80a6a32c-565c-4d2a-8f3b-95b40b6f248a_removalai_preview.png",
  magnolia: "assets/fd7ce6b2-aa9d-40ac-8007-6750eda266a8_removalai_preview.png",
  consultant: "assets/ffcc5fdc-9d63-4ee3-b640-9428ae65c095_removalai_preview.png",
  handover: "assets/f4206ee6-d974-46e2-9924-645abaea0b58_removalai_preview.png",
  last_update: "assets/7311083a-2ebb-4465-ae2c-28606e0e98e7_removalai_preview.png",
  mfa_loop: "assets/ca6b6877-e752-4e89-9191-3670797ed381_removalai_preview.png",
  vpn_down: "assets/12599df6-1e90-4584-9417-eee2061a4efa_removalai_preview.png",
  boss_special_shot: "assets/e4a37a65-ab33-4795-914c-9910bc2f18b8_removalai_preview.png",
  security_patch: "assets/992d3e03-5cb6-4455-8b45-6aff71827215_removalai_preview.png",
  lazy_loading: "assets/lazy loading.png",
  infinite_versions: "assets/infinite versions.png",
  boss_cc: "assets/boss_cc emails.png",
  boss_contradictory: "assets/boss_contradictory information.png",
  boss_printer: "assets/boss_printer.png",
  boss_monday: "assets/boss_monday.png",
  boss_passkey: "assets/7b47e6e9-510a-4887-9207-0725d9d68171_removalai_preview.png",
  boss_sunday_release: "assets/B1DD-A689-470E-B0A8-D6C5D34ECE0E_1-removebg-preview.png",
  cover_printer: "assets/boss_printer.png",
  cover_clock: "assets/12h!!!!.png",
  cover_spot: "assets/defender_spot.png",
  cover_n1: "assets/defender_n+1.png",
  cover_home: "assets/defender_home.png",
  cover_team_po: "assets/defender_team_PO.png",
  cover_spot_rainbow: "assets/defender_spot_rainbow.png",
  cover_n1_rainbow: "assets/defender_n+1_rainbow.png",
  cover_home_rainbow: "assets/defender_home_rainbow.png",
  cover_team_po_rainbow: "assets/defender_team_po_rainbow.png",
  enemy_shot: "assets/invaders shoot.png",
  player_shot: "assets/spaceship_bullet.png",
  coffee: "assets/bonnus_coffee.png",
  honey: "assets/bonus_honey.png",
  clip: "assets/bonus_clip.png",
  star: "assets/qap.png",
  dolphin: "assets/bonus_dolphin.png",
  vendredi: "assets/bonus_vendredi_15h.png",
  cannabis: "assets/cannabis.png",
  vendredi_rainbow: "assets/rainbow.png",
  player_ship: "assets/spaceship.png",
  player_ship_rainbow: "assets/spaceship_rainbow.png",
  avatar_0: "assets/avatar1d4fa6c4-a2f5-4228-941d-ccc5fab93c41_removalai_preview.png",
  avatar_1: "assets/avatar6d51f672-3832-4524-b953-e1b9f20a1642_removalai_preview.png",
  avatar_2: "assets/avatar21ddbd42-9b20-4aa0-b900-0da759d747cb_removalai_preview.png",
  avatar_3: "assets/avatar29ffffad-1019-4a30-8973-380905002b8a_removalai_preview.png",
  avatar_4: "assets/avatar9624cb0b-820c-41c5-ae4b-262158621c4a_removalai_preview.png",
  avatar_5: "assets/avatar1566432b-e1b7-4289-89a6-aa3822a551ea_removalai_preview.png",
  avatar_6: "assets/avatar65507942-bade-44e7-8567-38c683b67d10_removalai_preview.png",
  avatar_7: "assets/avatarb965ccaa-7986-4818-8b21-1635f5f115bf_removalai_preview.png",
  avatar_8: "assets/avatarc3129d3c-e39a-4459-9712-51516cc0d095_removalai_preview.png"
};
const AVATAR_OPTIONS = [
  { key: "avatar_0", label: "MR BALD" },
  { key: "avatar_1", label: "MISS KAWAI" },
  { key: "avatar_2", label: "CLOUDYBOY" },
  { key: "avatar_3", label: "DUCK ZE CONSULTANT" },
  { key: "avatar_4", label: "STICKY RICE" },
  { key: "avatar_5", label: "TRIPLE K" },
  { key: "avatar_6", label: "AUX ARMES CITOYENS" },
  { key: "avatar_7", label: "HIGH VOLTAGE" },
  { key: "avatar_8", label: "KAKTUZ KITSER" }
];
const bossNames = [
  "CC EMAILS",
  "CONTRADICTORY INFORMATION",
  "PRINTER",
  "MONDAY MORNING"
];
const bossSpriteKeys = ["boss_cc", "boss_contradictory", "boss_printer", "boss_monday"];
const MAX_LIVES = 5;
const MAX_LEVEL = 16;
const LAST_CHANCE_FOCUS_COST = 60;
const REPLY_ALL_COOLDOWN = 6.5;
const MAX_HEAT = 100;
const SUPABASE_URL = "https://ebhpkgjlzvbfwpucofho.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LGHW2HETXjgHS1slv1DQGQ_ty2n4LzU";
const SCORE_TABLE = "inbox_scores";
const SPRITE_DETAILS = {
  "COFFEE": "Accélère ta cadence de tir et rend le bureau franchement plus productif pendant quelques secondes.",
  "HONEY": "Pose un champ collant: les distractions ralentissent et les projectiles se calment.",
  "CLIP": "Le trombone allié fait le ménage sur les menaces les plus proches. Old school, mais efficace.",
  "QAP": "Tir perforant x3. Le bonus préféré des pilotes qui n'ont pas le temps de négocier.",
  "DOLPHIN": "Dash esquive: une vague rapide pour sortir d'une situation qui sent la réunion surprise.",
  "VENDREDI": "Ralentit le temps. À 15h, même les invaders commencent à regarder l'horloge.",
  "CANNABIS": "Mode chill magique: ralentit le chaos, refroidit l'Outbox et transforme tes tirs en bonnes idées.",
  "EMAIL": "La distraction de base. Se multiplie vite si tu la laisses traîner dans l'inbox.",
  "DOUBLE MEETING": "Deux réunions dans la même case agenda. Rien d'illégal, mais tout est suspect.",
  "CALL": "Appel entrant qui vise juste. À traiter avant qu'il ne coupe ton flow.",
  "PPT": "Deck interminable. Lent, lourd, et toujours une slide de trop.",
  "DOCX": "Document mutant. Il tire proprement, mais il revient toujours avec des commentaires.",
  "CPU": "Processus qui chauffe. Rapide à ignorer, dangereux à laisser tourner.",
  "LOST FILES": "Fichier perdu, panique garantie. Zigzague dans le backlog en prétendant être urgent.",
  "TICKET JIRA": "Petit mais procédurier. Il arrive avec un statut, une priorité et zéro contexte.",
  "12H!!!!": "Deadline midi. Fonce droit sur toi avec l'énergie du message envoyé trop tard.",
  "ERROR 404": "Pop-up absurde. Tire en éventail parce que l'information est introuvable.",
  "ROCK": "Blocage solide. Lent, costaud, parfait pour casser ton rythme si tu ne le focus pas.",
  "WINDOUF UPDATE": "Mise à jour sauvage. Elle débarque quand tout allait presque bien.",
  "REF IS DOWN!": "Incident de prod déguisé en écran bleu. Résistant et franchement pénible.",
  "DGC": "Petit groupe compact qui aime arriver en renfort. À nettoyer avant l'effet boule de neige.",
  "AS400": "Ancien système, énorme inertie. Peu rapide, mais il encaisse comme un serveur oublié.",
  "PRAAT BARAK": "Parle beaucoup, bouge bizarrement, perturbe les trajectoires propres.",
  "PO AU JAPON": "Décalage horaire incarné. Beau, calme, mais jamais disponible au bon moment.",
  "EZF": "Formulaire facile en théorie. En pratique: deux points de vie et une validation de trop.",
  "MAGNOLIA": "Update CMS fleuri. Joli à regarder, moins joli quand ça casse la prod.",
  "CONSULTANT": "Arrive avec des slides, des graphes et une question simple qui coûte cher.",
  "HANDOVER": "Transfert de dossier. Si tu rates le relais, tout revient dans ton inbox.",
  "PASSKEY": "Clé magique d'authentification. Utile, mais elle adore expirer au pire moment.",
  "EASY FORM": "Formulaire prétendument simple. Il cache toujours un champ obligatoire invisible.",
  "SUNDAY RELEASE": "Release du dimanche. Personne ne sait pourquoi elle existe, tout le monde la subit.",
  "LAZY LOADING": "Charge quand ça l'arrange. Lent à venir, agaçant à finir.",
  "INFINITE VERSIONS": "Versions infinies, vérité zéro. Plus tu tires, plus ça ressemble à un drive partagé.",
  "CC EMAILS": "Boss de la copie cachée visible. Il transforme une info simple en pluie de réponses.",
  "CONTRADICTORY INFORMATION": "Boss de la contradiction. Chaque tentacule raconte une version différente.",
  "PRINTER": "Boss imprimante. Ancienne magie noire, bourrages papier et colère froide.",
  "MONDAY MORNING": "Boss du lundi matin. Trop tôt, trop gros, trop de notifications."
};
const POWERUP_TYPES = [
  { key: "coffee", label: "BONNUS COFFEE", color: "#ffd23d" },
  { key: "honey", label: "BONUS HONEY", color: "#ff8a1a" },
  { key: "clip", label: "BONUS CLIP", color: "#19e3e3" },
  { key: "star", label: "QAP", color: "#ff3d9a" },
  { key: "dolphin", label: "BONUS DOLPHIN", color: "#58d6ff" },
  { key: "cannabis", label: "CANNABIS MAGIQUE", color: "#b6ff2e" },
  { key: "vendredi", label: "BONUS VENDREDI 15H", color: "#b6e021" }
];
const COVER_TYPES = [
  { key: "spot", label: "SPOT", color: "#ffd23d", spriteKey: "cover_spot" },
  { key: "n1", label: "N+1", color: "#19e3e3", spriteKey: "cover_n1" },
  { key: "home", label: "HOME", color: "#ff8a1a", spriteKey: "cover_home" },
  { key: "team_po", label: "TEAM PO", color: "#e9f6ff", spriteKey: "cover_team_po" }
];

let state = "start";
let score = 0;
let highScore = Number(localStorage.getItem("inboxInvadersHighScore") || 0);
let level = 1;
let lives = MAX_LIVES;
let focus = 0;
let lastTime = 0;
let levelLostLife = false;
let audio;
let musicTimer;
let musicStep = 0;
let musicEnabled = false;
let musicMode = "";
let audioMuted = localStorage.getItem("inboxInvadersMuted") === "1";
let player;
let bullets;
let enemies;
let enemyBullets;
let powerups;
let coverObjects;
let particles;
let boss;
let stars;
let notices;
let keys = {};
let touch = { left: false, right: false, up: false, down: false, shoot: false, reply: false, blast: false };
let shootCooldown = 0;
let replyAllCooldown = 0;
let bossShootCooldown = 0;
let coffeeTimer = 0;
let bubbleTimer = 0;
let oooTimer = 0;
let outboxHeat = 0;
let overheated = false;
let heatNoticeCooldown = 0;
let vendrediSplashTimer = 0;
let vendrediBonusTimer = 0;
let cannabisTimer = 0;
let dolphinWaveTimer = 0;
let levelTransition = 0;
let waveRemaining = 0;
let spawnTimer = 0;
let playerId = localStorage.getItem("inboxInvadersPlayerId") || "";
let playerName = localStorage.getItem("inboxInvadersPlayerName") || "";
let playerAvatarKey = localStorage.getItem("inboxInvadersPlayerAvatar") || AVATAR_OPTIONS[0].key;
let runScoreSubmitted = false;
let renderedLives = -1;
const imageSprites = {};
let imageSpritesLoaded = 0;
let imageSpritesTotal = 0;
let pageAssetsLoaded = 0;
let pageAssetsTotal = 0;
const assetLoader = document.getElementById("assetLoader");
const assetLoaderBar = document.getElementById("assetLoaderBar");
const assetLoaderPercent = document.getElementById("assetLoaderPercent");
const ASSET_LOADER_MIN_MS = 2000;
const assetLoaderStartedAt = performance.now();
let assetLoaderHideQueued = false;
let assetLoaderFrame = 0;

function loadImageSprites() {
  imageSpritesTotal = Object.keys(imageSpriteSources).length;
  updateAssetLoader();
  Object.keys(imageSpriteSources).forEach(key => {
    const img = new Image();
    imageSprites[key] = { ready: false, image: img, canvas: null };
    img.onload = () => {
      try {
        imageSprites[key].canvas = prepareImageSprite(img);
      } catch (error) {
        console.warn("Sprite cleanup failed", key, error);
        imageSprites[key].canvas = img;
      }
      imageSprites[key].ready = true;
      imageSpritesLoaded += 1;
      updateAssetLoader();
    };
    img.onerror = () => {
      imageSprites[key].ready = false;
      imageSpritesLoaded += 1;
      updateAssetLoader();
    };
    img.src = encodeURI(imageSpriteSources[key]);
  });
}

function loadPageImageAssets() {
  const sources = Array.from(new Set(
    Array.from(document.querySelectorAll("img[src]"))
      .map(img => img.getAttribute("src"))
      .filter(src => src && !src.includes("loading_999.png"))
  ));
  pageAssetsTotal = sources.length;
  if (!sources.length) updateAssetLoader();
  sources.forEach(src => {
    const img = new Image();
    const done = () => {
      pageAssetsLoaded += 1;
      updateAssetLoader();
    };
    img.onload = done;
    img.onerror = done;
    img.src = encodeURI(src);
  });
}

function updateAssetLoader() {
  const total = Math.max(1, (imageSpritesTotal || Object.keys(imageSpriteSources).length) + pageAssetsTotal);
  const loaded = imageSpritesLoaded + pageAssetsLoaded;
  const elapsed = performance.now() - assetLoaderStartedAt;
  const assetPct = (loaded / total) * 100;
  const timePct = Math.min(100, (elapsed / ASSET_LOADER_MIN_MS) * 100);
  const pct = Math.min(100, Math.round(Math.min(assetPct, timePct)));
  if (assetLoaderBar) assetLoaderBar.style.width = pct + "%";
  if (assetLoaderPercent) assetLoaderPercent.textContent = pct + "%";
  if (loaded >= total && elapsed >= ASSET_LOADER_MIN_MS && !assetLoaderHideQueued) {
    assetLoaderHideQueued = true;
    if (assetLoaderFrame) cancelAnimationFrame(assetLoaderFrame);
    assetLoaderFrame = 0;
    if (assetLoader) assetLoader.classList.add("is-hidden");
    document.body.classList.remove("loading-assets");
    return;
  }
  requestAssetLoaderFrame();
}

function requestAssetLoaderFrame() {
  if (assetLoaderHideQueued || assetLoaderFrame) return;
  assetLoaderFrame = requestAnimationFrame(() => {
    assetLoaderFrame = 0;
    updateAssetLoader();
  });
}

function prepareImageSprite(img) {
  const source = document.createElement("canvas");
  source.width = img.naturalWidth || img.width;
  source.height = img.naturalHeight || img.height;
  const sourceCtx = source.getContext("2d");
  sourceCtx.drawImage(img, 0, 0);
  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height);
  const data = imageData.data;
  const hasRealAlpha = hasTransparentPixels(data);
  if (!hasRealAlpha) removeConnectedCheckerboardBackground(data, source.width, source.height);
  let minX = source.width;
  let minY = source.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const i = (y * source.width + x) * 4;
      if (data[i + 3] < 16) {
        data[i + 3] = 0;
      } else {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  sourceCtx.putImageData(imageData, 0, 0);
  if (maxX <= minX || maxY <= minY) return source;
  const pad = 16;
  const sx = Math.max(0, minX - pad);
  const sy = Math.max(0, minY - pad);
  const sw = Math.min(source.width - sx, maxX - minX + pad * 2);
  const sh = Math.min(source.height - sy, maxY - minY + pad * 2);
  const output = document.createElement("canvas");
  output.width = sw;
  output.height = sh;
  output.getContext("2d").drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
  return output;
}

function hasTransparentPixels(data) {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) return true;
  }
  return false;
}

function removeConnectedCheckerboardBackground(data, w, h) {
  const visited = new Uint8Array(w * h);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    const i = p * 4;
    if (!isCheckerboardPixel(data[i], data[i + 1], data[i + 2])) return;
    visited[p] = 1;
    data[i + 3] = 0;
    queue.push([x, y]);
  };
  for (let x = 0; x < w; x += 1) {
    enqueue(x, 0);
    enqueue(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    enqueue(0, y);
    enqueue(w - 1, y);
  }
  for (let head = 0; head < queue.length; head += 1) {
    const [x, y] = queue[head];
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }
}

function isCheckerboardPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max > 155 && max - min < 48;
}

// Restores a full run while preserving the browser's saved high score.
function resetGame() {
  score = 0;
  level = 1;
  lives = MAX_LIVES;
  focus = 30;
  player = { x: W / 2, y: H - 58, w: 44, h: 34, invincible: 0 };
  bullets = [];
  enemies = [];
  enemyBullets = [];
  powerups = [];
  coverObjects = [];
  particles = [];
  boss = null;
  notices = [];
  runScoreSubmitted = false;
  stars = Array.from({ length: 110 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    s: Math.random() * 2 + 0.5,
    speed: Math.random() * 22 + 12
  }));
  levelLostLife = false;
  coffeeTimer = 0;
  bubbleTimer = 0;
  oooTimer = 0;
  outboxHeat = 0;
  overheated = false;
  heatNoticeCooldown = 0;
  vendrediSplashTimer = 0;
  vendrediBonusTimer = 0;
  cannabisTimer = 0;
  dolphinWaveTimer = 0;
  levelTransition = 0;
  beginLevel();
  setState("game");
}

function ensurePlayerId() {
  if (playerId) return playerId;
  playerId = createPlayerId();
  localStorage.setItem("inboxInvadersPlayerId", playerId);
  return playerId;
}

function createPlayerId() {
  if (window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cleanPlayerName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 18)
    .toUpperCase();
}

let playerNameToastTimer = 0;

function clearPlayerNameError() {
  if (!playerNameInput) return;
  playerNameInput.classList.remove("is-missing");
  playerNameInput.removeAttribute("aria-invalid");
}

function showPlayerNameError() {
  if (playerNameInput) {
    playerNameInput.classList.add("is-missing");
    playerNameInput.setAttribute("aria-invalid", "true");
    playerNameInput.focus();
  }
  const setupScreen = screens.playerSetup;
  if (!setupScreen) return;
  let toast = setupScreen.querySelector(".setup-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "setup-toast";
    toast.setAttribute("role", "alert");
    setupScreen.appendChild(toast);
  }
  toast.textContent = "Entre un pseudo pour valider ton pilote";
  toast.classList.add("is-visible");
  window.clearTimeout(playerNameToastTimer);
  playerNameToastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function savePlayerFromInput() {
  const nextName = cleanPlayerName(playerNameInput ? playerNameInput.value : "");
  if (!nextName) {
    showPlayerNameError();
    addNotice("PSEUDO REQUIRED", "#ff3b3b");
    return false;
  }
  clearPlayerNameError();
  playerName = nextName;
  if (!AVATAR_OPTIONS.some(avatar => avatar.key === playerAvatarKey)) playerAvatarKey = AVATAR_OPTIONS[0].key;
  ensurePlayerId();
  localStorage.setItem("inboxInvadersPlayerName", playerName);
  localStorage.setItem("inboxInvadersPlayerAvatar", playerAvatarKey);
  updatePlayerReadout();
  return true;
}

function updatePlayerReadout() {
  const displayName = playerName || "INVITE";
  const selectedAvatar = AVATAR_OPTIONS.find(avatar => avatar.key === playerAvatarKey) || AVATAR_OPTIONS[0];
  const selectedAvatarSrc = imageSpriteSources[selectedAvatar.key] || imageSpriteSources[AVATAR_OPTIONS[0].key];
  if (playerReadout) playerReadout.textContent = `PILOTE : ${displayName}`;
  if (playerNameInput && playerName) playerNameInput.value = playerName;
  if (playerAvatarPreview) {
    playerAvatarPreview.src = selectedAvatarSrc;
    playerAvatarPreview.alt = playerName ? `Avatar de ${playerName}` : "Avatar pilote";
  }
  if (setupAvatarPreview) {
    setupAvatarPreview.src = selectedAvatarSrc;
    setupAvatarPreview.alt = playerName ? `Avatar de ${playerName}` : "Avatar pilote";
  }
  if (setupPilotName) setupPilotName.textContent = displayName;
  if (setupPilotClass) setupPilotClass.textContent = `CLASSE · ${selectedAvatar.label}`;
  renderAvatarOptions();
}

function selectAvatar(key) {
  if (!AVATAR_OPTIONS.some(avatar => avatar.key === key)) return;
  playerAvatarKey = key;
  localStorage.setItem("inboxInvadersPlayerAvatar", playerAvatarKey);
  updatePlayerReadout();
}

function renderAvatarOptions() {
  if (!avatarGrid) return;
  avatarGrid.innerHTML = "";
  AVATAR_OPTIONS.forEach(avatar => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const label = document.createElement("span");
    button.type = "button";
    button.className = avatar.key === playerAvatarKey ? "avatar-choice is-selected" : "avatar-choice";
    button.dataset.avatarKey = avatar.key;
    button.setAttribute("aria-label", avatar.label);
    button.setAttribute("aria-pressed", avatar.key === playerAvatarKey ? "true" : "false");
    image.src = imageSpriteSources[avatar.key];
    image.alt = "";
    label.textContent = avatar.label;
    button.append(image, label);
    avatarGrid.appendChild(button);
  });
}

function hasRemoteScores() {
  return SUPABASE_URL.indexOf("http") === 0 && SUPABASE_ANON_KEY.length > 20;
}

function submitRunScore() {
  if (runScoreSubmitted || !playerName) return;
  runScoreSubmitted = true;
  const entry = {
    player_id: ensurePlayerId(),
    player_name: playerName,
    score,
    level
  };
  saveLocalScore(entry);
  if (hasRemoteScores()) postRemoteScore(entry);
}

function saveLocalScore(entry) {
  const saved = JSON.parse(localStorage.getItem("inboxInvadersScores") || "[]");
  saved.push({ ...entry, created_at: new Date().toISOString() });
  saved.sort((a, b) => b.score - a.score);
  localStorage.setItem("inboxInvadersScores", JSON.stringify(saved.slice(0, 50)));
}

async function postRemoteScore(entry) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/${SCORE_TABLE}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(entry)
    });
  } catch (error) {
    console.warn("Score upload failed", error);
  }
}

async function loadLeaderboard() {
  renderLeaderboard(getLocalScores(), hasRemoteScores() ? "REMOTE SYNC..." : "LOCAL SCORES");
  if (!hasRemoteScores()) return;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${SCORE_TABLE}?select=player_name,score,level,created_at&order=score.desc&limit=10`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!response.ok) throw new Error(`Leaderboard ${response.status}`);
    const scores = await response.json();
    renderLeaderboard(scores, "GLOBAL SCORES");
  } catch (error) {
    console.warn("Leaderboard fetch failed", error);
    renderLeaderboard(getLocalScores(), "LOCAL FALLBACK");
  }
}

function getLocalScores() {
  return JSON.parse(localStorage.getItem("inboxInvadersScores") || "[]").slice(0, 10);
}

function renderLeaderboard(scores, mode) {
  if (leaderboardMode) leaderboardMode.textContent = mode;
  if (!leaderboardList) return;
  leaderboardList.innerHTML = "";
  const rows = scores.length ? scores : [{ player_name: "AUCUN SCORE", score: 0, level: 0 }];
  rows.forEach((entry, index) => {
    const avatar = entry.player_id === playerId
      ? (AVATAR_OPTIONS.find(option => option.key === playerAvatarKey) || AVATAR_OPTIONS[0])
      : AVATAR_OPTIONS[index % AVATAR_OPTIONS.length];
    const item = document.createElement("li");
    const avatarImage = document.createElement("img");
    const rank = document.createElement("span");
    const name = document.createElement("strong");
    const scoreValue = document.createElement("em");
    const levelValue = document.createElement("small");
    item.className = `${index < 3 ? `rank-${index + 1}` : ""}${entry.player_id === playerId ? " is-me" : ""}`.trim();
    rank.textContent = String(index + 1);
    avatarImage.src = imageSpriteSources[avatar.key];
    avatarImage.alt = "";
    name.textContent = entry.player_name || "INVITE";
    scoreValue.textContent = String(entry.score || 0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    levelValue.textContent = `LVL ${entry.level || 0}`;
    item.append(rank, avatarImage, name, scoreValue, levelValue);
    leaderboardList.appendChild(item);
  });
}

// Boss levels still spawn a smaller escort wave so the screen stays lively.
function beginLevel() {
  enemies = [];
  enemyBullets = [];
  boss = null;
  levelLostLife = false;
  spawnTimer = 0.3;
  const difficulty = levelDifficulty();
  if (level % 2 === 0) {
    const bossIndex = Math.floor(level / 2 - 1);
    const bossHp = Math.floor(90 + difficulty * 36 + Math.max(0, level - 10) * 30);
    boss = {
      x: W / 2 - 120,
      y: 60,
      w: 240,
      h: 118,
      hp: bossHp,
      maxHp: bossHp,
      vx: 96 + difficulty * 11,
      name: bossNames[bossIndex % bossNames.length],
      spriteKey: bossSpriteKeys[bossIndex % bossSpriteKeys.length]
    };
    waveRemaining = 9 + Math.floor(difficulty * 2.1);
  } else {
    waveRemaining = 16 + Math.floor(difficulty * 6.4);
  }
  createCoverObjects();
}

function levelDifficulty() {
  const lateGame = Math.max(0, level - 10);
  return level * 1.18 + lateGame * 0.85;
}

function createCoverObjects() {
  const count = Math.min(5, Math.max(3, Math.floor(W / 230)));
  const gap = W / (count + 1);
  coverObjects = Array.from({ length: count }, (_, index) => {
    const type = COVER_TYPES[index % COVER_TYPES.length];
    return {
      ...type,
      x: gap * (index + 1),
      y: H * 0.73,
      w: 112,
      h: 68,
      hp: 5,
      maxHp: 5
    };
  });
}

function updateCommandDock(next) {
  if (!commandDock) return;
  const tabMap = { playerSetup: "playerSetup", how: "how", leaderboard: "leaderboard" };
  const activeTab = tabMap[next] || "";
  commandDockTabs.forEach(tab => {
    const active = tab.dataset.screenTab === activeTab;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
  });
  if (!commandDockPrimary) return;
  if (next === "how") {
    commandDockPrimary.dataset.action = "start";
    commandDockPrimary.textContent = "START ►";
  } else if (next === "leaderboard") {
    commandDockPrimary.dataset.action = "restart";
    commandDockPrimary.textContent = "REJOUER ►";
  } else {
    commandDockPrimary.dataset.action = "savePlayer";
    commandDockPrimary.textContent = "VALIDER ►";
  }
}

function setState(next) {
  state = next;
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  if (screens[next]) {
    screens[next].classList.add("active");
    screens[next].scrollTo({ top: 0, left: 0 });
  }
  updateCommandDock(next);
  if (audio && !audioMuted && next === "gameOver") startMusic("fail");
  if (audio && !audioMuted && next === "game") startMusic("game");
  updateHud();
}

function updateHud() {
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
  levelEl.textContent = level;
  livesEl.textContent = lives;
  renderLivesReadout();
  focusFill.style.width = `${Math.min(100, focus)}%`;
  if (heatFill) heatFill.style.width = `${Math.min(100, outboxHeat)}%`;
  if (healthFill) healthFill.style.width = `${clamp(lives / MAX_LIVES, 0, 1) * 100}%`;
  if (focusPercentEl) focusPercentEl.textContent = `${Math.floor(Math.min(100, focus))}%`;
  if (heatPercentEl) heatPercentEl.textContent = overheated ? "RATE LIMIT" : `${Math.floor(Math.min(100, outboxHeat))}%`;
  updateSoundButton();
}

function renderLivesReadout() {
  if (!livesReadoutEl || renderedLives === lives) return;
  renderedLives = lives;
  livesReadoutEl.innerHTML = "";
  livesReadoutEl.setAttribute("aria-label", `${lives} vies`);
  if (!window.II) {
    livesReadoutEl.textContent = String(lives);
    return;
  }
  const visibleLives = Math.max(0, Math.min(MAX_LIVES, lives));
  for (let i = 0; i < visibleLives; i += 1) {
    const icon = document.createElement("canvas");
    const scale = 2;
    icon.width = 18 * scale;
    icon.height = 16 * scale;
    icon.className = "life-ship";
    icon.setAttribute("aria-hidden", "true");
    const iconCtx = icon.getContext("2d");
    window.II.dShip(window.II.Pix(iconCtx, scale), i % 2, window.II.SHIP);
    window.II.register(iconCtx, window.II.dShip, window.II.SHIP, 18, 16, scale);
    livesReadoutEl.appendChild(icon);
  }
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("inboxInvadersHighScore", String(highScore));
  }
}

// Tiny Web Audio synths keep the project asset-free and arcade-snappy.
function initAudio() {
  if (audioMuted) return;
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audio.state === "suspended") audio.resume();
  startMusic(state === "gameOver" ? "fail" : "game");
}

function tone(freq, duration, type, volume, slide = 0) {
  if (!audio || audioMuted) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), audio.currentTime + duration);
  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

function musicTone(freq, start, duration, type, volume) {
  if (!audio || audioMuted) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1250 + Math.sin(musicStep) * 420, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(filter).connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  musicEnabled = false;
}

function startMusic(mode = "game") {
  if (!audio || audioMuted) return;
  if (musicEnabled && musicMode === mode) return;
  stopMusic();
  musicMode = mode;
  musicStep = 0;
  musicEnabled = true;
  const bass = mode === "fail"
    ? [82.41, 73.42, 65.41, 61.74, 55, 49, 46.25, 41.2, 82.41, 73.42, 61.74, 55, 49, 46.25, 41.2, 36.71]
    : [
      55, 55, 82.41, 55, 73.42, 55, 98, 82.41,
      65.41, 65.41, 98, 65.41, 87.31, 65.41, 110, 98,
      73.42, 73.42, 110, 73.42, 98, 73.42, 123.47, 110,
      55, 82.41, 98, 110, 98, 82.41, 73.42, 65.41
    ];
  const lead = mode === "fail"
    ? [329.63, 293.66, 261.63, 246.94, 220, 196, 174.61, 164.81, 293.66, 261.63, 220, 196, 174.61, 164.81, 146.83, 130.81]
    : [
      440, 0, 523.25, 659.25, 0, 587.33, 523.25, 392,
      493.88, 0, 587.33, 698.46, 659.25, 0, 587.33, 523.25,
      392, 440, 493.88, 0, 587.33, 523.25, 493.88, 440,
      659.25, 0, 587.33, 523.25, 493.88, 440, 392, 0
    ];
  const gameBassAlt = [
    55, 82.41, 110, 82.41, 73.42, 98, 123.47, 98,
    65.41, 98, 130.81, 98, 87.31, 110, 146.83, 110,
    73.42, 110, 146.83, 110, 98, 123.47, 164.81, 123.47,
    55, 73.42, 82.41, 98, 110, 98, 82.41, 73.42
  ];
  const bassBridge = [
    98, 98, 146.83, 98, 87.31, 87.31, 130.81, 87.31,
    73.42, 73.42, 110, 73.42, 65.41, 65.41, 98, 65.41,
    61.74, 61.74, 92.5, 61.74, 73.42, 98, 110, 123.47,
    82.41, 110, 123.47, 146.83, 164.81, 146.83, 123.47, 110
  ];
  const bassChorus = [
    55, 110, 164.81, 110, 65.41, 130.81, 196, 130.81,
    73.42, 146.83, 220, 146.83, 82.41, 164.81, 246.94, 164.81,
    98, 196, 293.66, 196, 87.31, 174.61, 261.63, 174.61,
    73.42, 146.83, 220, 196, 164.81, 146.83, 123.47, 98
  ];
  const leadAlt = [
    0, 659.25, 587.33, 523.25, 493.88, 0, 523.25, 587.33,
    659.25, 0, 783.99, 698.46, 659.25, 587.33, 0, 523.25,
    493.88, 523.25, 587.33, 0, 659.25, 587.33, 523.25, 493.88,
    440, 0, 493.88, 523.25, 587.33, 659.25, 783.99, 0
  ];
  const leadBridge = [
    784, 0, 698.46, 659.25, 587.33, 0, 523.25, 493.88,
    440, 493.88, 523.25, 0, 587.33, 523.25, 493.88, 440,
    392, 0, 440, 493.88, 523.25, 587.33, 0, 659.25,
    698.46, 784, 880, 0, 784, 698.46, 659.25, 587.33
  ];
  const leadChorus = [
    659.25, 0, 659.25, 783.99, 880, 0, 783.99, 659.25,
    587.33, 0, 587.33, 698.46, 783.99, 0, 698.46, 587.33,
    523.25, 587.33, 659.25, 0, 783.99, 659.25, 587.33, 523.25,
    493.88, 0, 523.25, 587.33, 659.25, 783.99, 880, 0
  ];
  const leadFinal = [
    880, 783.99, 659.25, 587.33, 659.25, 783.99, 659.25, 0,
    698.46, 659.25, 587.33, 523.25, 587.33, 659.25, 587.33, 0,
    523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 0,
    880, 783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440
  ];
  const counter = [0, 0, 220, 0, 246.94, 0, 293.66, 0, 0, 0, 261.63, 0, 293.66, 0, 329.63, 0];
  const counterAlt = [0, 329.63, 0, 0, 293.66, 0, 246.94, 0, 0, 392, 0, 0, 329.63, 0, 293.66, 0];
  const arpeggio = [220, 329.63, 440, 329.63, 246.94, 369.99, 493.88, 369.99, 261.63, 392, 523.25, 392, 293.66, 440, 587.33, 440];
  const accent = [0, 110, 0, 146.83, 0, 110, 164.81, 0, 0, 130.81, 0, 174.61, 0, 130.81, 196, 0];
  const fill = [220, 246.94, 261.63, 293.66, 329.63, 392, 440, 523.25];
  const sectionBass = [bass, gameBassAlt, bass, bassBridge, bassChorus, gameBassAlt];
  const sectionLead = [lead, leadAlt, leadChorus, leadBridge, leadChorus, leadFinal];
  const sectionTranspose = [1, 1, 1.12246, 1, 1, 0.8909];
  const tickMs = mode === "fail" ? 185 : 118;
  musicTimer = setInterval(() => {
    if (!audio || audio.state !== "running") return;
    const t = audio.currentTime;
    const index = musicStep % bass.length;
    const cycle = Math.floor(musicStep / bass.length) % sectionLead.length;
    const phrase = Math.floor(musicStep / 8) % 4;
    const transpose = mode === "game" ? sectionTranspose[cycle] : 1;
    const bassSeq = mode === "game" ? sectionBass[cycle] : bass;
    const leadSeq = mode === "game" ? sectionLead[cycle] : lead;
    const bassNote = bassSeq[index];
    musicTone(bassNote * transpose, t, mode === "fail" ? 0.22 : 0.115, mode === "fail" ? "triangle" : "sawtooth", mode === "fail" ? 0.06 : 0.045);
    if (mode === "fail") {
      musicTone(lead[index], t + 0.035, 0.16, "square", 0.022);
      if (musicStep % 4 === 3) tone(41.2, 0.32, "sawtooth", 0.075, -16);
    } else {
      if (musicStep % 2 === 0) musicTone(110, t, 0.045, "square", 0.025);
      const leadNote = leadSeq[index];
      if (leadNote) musicTone(leadNote * transpose, t + 0.015, 0.085 + Math.min(cycle, 4) * 0.006, "square", 0.023 + Math.min(cycle, 3) * 0.002);
      const counterSeq = cycle % 2 === 0 ? counter : counterAlt;
      const counterNote = cycle >= 2 ? counterSeq[musicStep % counterSeq.length] : 0;
      if (counterNote && musicStep % 4 === 2) musicTone(counterNote * transpose, t + 0.07, 0.06, "triangle", 0.014);
      if (cycle >= 4 && musicStep % 4 === 1) musicTone(arpeggio[musicStep % arpeggio.length] * transpose, t + 0.09, 0.05, "triangle", 0.012);
      const accentNote = accent[musicStep % accent.length];
      if (accentNote && musicStep % 8 === 7) musicTone(accentNote, t + 0.055, 0.06, "triangle", 0.018);
      if ((cycle === 3 || cycle === 5) && musicStep % 32 >= 24) {
        const fillNote = fill[musicStep % fill.length];
        musicTone(fillNote * transpose, t + 0.07, 0.045, "square", 0.016);
      }
      if (musicStep % 16 === 15) tone(82.41, 0.09, "square", 0.032, -24);
    }
    musicStep += 1;
  }, tickMs);
}

function toggleSound() {
  audioMuted = !audioMuted;
  localStorage.setItem("inboxInvadersMuted", audioMuted ? "1" : "0");
  if (audioMuted) {
    stopMusic();
    if (audio && audio.state === "running") audio.suspend();
  } else {
    initAudio();
    startMusic(state === "gameOver" ? "fail" : "game");
  }
  updateSoundButton();
}

function updateSoundButton() {
  if (!soundButton) return;
  soundButton.classList.toggle("muted", audioMuted);
  soundButton.setAttribute("aria-pressed", audioMuted ? "true" : "false");
  soundButton.setAttribute("aria-label", audioMuted ? "Unmute sound" : "Mute sound");
  soundButton.title = audioMuted ? "Unmute sound" : "Mute sound";
  soundButton.textContent = audioMuted ? "🔇" : "🔊";
}

function shootSound() {
  tone(620, 0.08, "square", 0.05, 280);
}

function replyAllSound() {
  [420, 520, 620, 760].forEach((freq, index) => {
    setTimeout(() => tone(freq, 0.075, "square", 0.045, 160), index * 24);
  });
}

function explosionSound() {
  tone(170, 0.16, "sawtooth", 0.08, -110);
  tone(64, 0.12, "square", 0.04, -30);
}

function blastSound() {
  tone(110, 0.35, "sawtooth", 0.08, 650);
}

function gameOverSound() {
  [392, 329.63, 261.63, 196, 130.81].forEach((freq, index) => {
    setTimeout(() => tone(freq, 0.18, "triangle", 0.07, -20), index * 120);
  });
}

// Difficulty scales through spawn count, speed, and the chance of fast enemies.
function spawnEnemy() {
  const availableTypes = enemyTypes.filter(type => !imageSpriteSources[type] || (imageSprites[type] && imageSprites[type].ready));
  const spawnTypes = availableTypes.length >= fallbackEnemyTypes.length ? availableTypes : fallbackEnemyTypes;
  const type = spawnTypes[Math.floor(Math.random() * spawnTypes.length)];
  const difficulty = levelDifficulty();
  const fast = Math.random() < Math.min(0.18 + difficulty * 0.026, 0.64);
  const mainEnemy = createEnemy(type, fast, difficulty);
  enemies.push(mainEnemy);
  if (type === "dgc" && Math.random() < 0.72) {
    const wingman = createEnemy(type, false, difficulty);
    wingman.x = clamp(mainEnemy.x + (Math.random() > 0.5 ? 1 : -1) * (58 + Math.random() * 42), 32, W - 32);
    wingman.y = mainEnemy.y - 42 - Math.random() * 28;
    wingman.vx *= 0.75;
    wingman.vy *= 0.94;
    enemies.push(wingman);
  }
}

function createEnemy(type, fast, difficulty) {
  const size = type === "rock" ? (fast ? 98 : 92) : (type === "as400" ? (fast ? 96 : 92) : (["last_update", "mfa_loop", "vpn_down", "security_patch", "po_japon", "ezf", "magnolia", "consultant", "handover"].includes(type) ? (fast ? 88 : 80) : (fast ? 90 : 82)));
  const hp = type === "rock" ? (fast ? 4 : 3) : (type === "as400" ? (fast ? 4 : 3) : (type === "blue_screen" || type === "mfa_loop" || type === "security_patch" || type === "ezf" || type === "magnolia" || type === "consultant" || type === "handover" ? 2 : 1));
  const speedMods = { rock: 0.7, as400: 0.66, praat_barak: 1.18, po_japon: 1.08, ezf: 0.94, magnolia: 0.9, last_update: 1.28, vpn_down: 1.15, security_patch: 0.82, consultant: 0.96, handover: 0.92 };
  const speedMod = speedMods[type] || 1;
  return {
    type,
    fast,
    x: 24 + Math.random() * (W - 48),
    y: -50,
    w: size,
    h: size,
    hp,
    maxHp: hp,
    scoreValue: type === "as400" ? 28 : (type === "rock" ? 26 : (type === "ezf" || type === "magnolia" || type === "consultant" || type === "handover" ? 24 : (type === "blue_screen" || type === "mfa_loop" || type === "security_patch" ? 18 : null))),
    vx: (Math.random() - 0.5) * (46 + difficulty * 10.8) * speedMod,
    vy: ((fast ? 112 : 68) + difficulty * 14.5) * speedMod,
    color: fast ? "#ff3b3b" : (enemyLabelColors[type] || colors[Math.floor(Math.random() * colors.length)]),
    wobble: Math.random() * Math.PI * 2,
    zigzag: type === "praat_barak" || type === "vpn_down" ? 1 : 0,
    zigzagAmp: type === "praat_barak" ? 78 + Math.random() * 38 : (type === "vpn_down" ? 54 + Math.random() * 42 : 24),
    zigzagRate: type === "praat_barak" ? 5.8 + Math.random() * 1.2 : (type === "vpn_down" ? 6.8 + Math.random() * 1.6 : 4),
    shotTimer: 0.85 + Math.random() * Math.max(0.5, 2.8 - difficulty * 0.1)
  };
}

function shootEnemy(enemy) {
  if (!player || enemy.dead) return;
  const difficulty = levelDifficulty();
  const chance = Math.min(0.22 + difficulty * 0.018 + (enemy.fast ? 0.12 : 0), 0.62);
  if (Math.random() > chance) return;
  const speed = 130 + difficulty * 13;
  const aimed = aimedVelocity(enemy.x, enemy.y, player.x, player.y, speed);
  if (enemy.type === "call") {
    pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, aimed.vx, aimed.vy, 9, 20);
  } else if (enemy.type === "popup" || enemy.type === "email") {
    [-70, 0, 70].forEach(vx => pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, vx, speed, 8, 18));
  } else if (enemy.type === "blue_screen") {
    pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, aimed.vx * 0.18, speed * 0.58, 24, 30);
  } else if (enemy.type === "ppt" || enemy.type === "word" || enemy.type === "rock" || enemy.type === "lazy_loading" || enemy.type === "infinite_versions" || enemy.type === "as400" || enemy.type === "mfa_loop" || enemy.type === "security_patch" || enemy.type === "ezf" || enemy.type === "magnolia" || enemy.type === "consultant" || enemy.type === "handover") {
    pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, aimed.vx * 0.35, speed * 0.78, 14, 24);
  } else if (enemy.type === "jira" || enemy.type === "chat" || enemy.type === "windouf" || enemy.type === "praat_barak" || enemy.type === "vpn_down" || enemy.type === "po_japon") {
    pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, (Math.random() > 0.5 ? 1 : -1) * 95, speed * 0.95, 8, 18, 56);
  } else if (enemy.type === "urgent" || enemy.type === "last_update") {
    pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, aimed.vx * 0.45, speed * 1.32, 8, 22);
  } else {
    pushEnemyBullet(enemy.x, enemy.y + enemy.h / 2, 0, speed, 8, 18);
  }
}

function aimedVelocity(fromX, fromY, toX, toY, speed) {
  const dx = toX - fromX;
  const dy = Math.max(80, toY - fromY);
  const length = Math.hypot(dx, dy) || 1;
  return { vx: (dx / length) * speed, vy: (dy / length) * speed };
}

function pushEnemyBullet(x, y, vx, vy, w, h, wobble = 0, spriteKey = "enemy_shot") {
  enemyBullets.push({
    x,
    y,
    w,
    h,
    vx,
    vy,
    wobble,
    spriteKey,
    seed: Math.random() * 10
  });
}

function fire() {
  if (shootCooldown > 0) return;
  const cannabisActive = cannabisTimer > 0;
  if (!spendHeat(cannabisActive ? 4 : (coffeeTimer > 0 ? 5 : 8))) return;
  [-8, 8].forEach(offset => {
    bullets.push({
      x: player.x + offset,
      y: player.y - 24,
      w: 6,
      h: 24,
      vx: 0,
      vy: -650,
      damage: cannabisActive ? 11 : 9,
      color: cannabisActive ? (offset < 0 ? "#b6ff2e" : "#d65bff") : "#ffd23d",
      pierce: cannabisActive ? 1 : 0
    });
  });
  shootCooldown = 0.14;
  shootSound();
}

function fireReplyAll() {
  if (replyAllCooldown > 0) return;
  if (!spendHeat(28)) return;
  const spread = [-260, -170, -88, 0, 88, 170, 260];
  spread.forEach((vx, index) => {
    bullets.push({
      x: player.x + (index - 3) * 3,
      y: player.y - 24,
      w: index === 3 ? 8 : 6,
      h: 22,
      vx,
      vy: -500,
      damage: 13,
      color: index === 3 ? "#ffffff" : "#ff3d9a",
      replyAll: true
    });
  });
  replyAllCooldown = REPLY_ALL_COOLDOWN;
  replyAllSound();
}

function spendHeat(amount) {
  if (overheated) {
    if (shootCooldown <= 0 && heatNoticeCooldown <= 0) {
      shootCooldown = 0.22;
      heatNoticeCooldown = 0.85;
      addNotice("SMTP RATE LIMITED", "#ff3b3b");
      tone(130.81, 0.08, "square", 0.035, -30);
    }
    return false;
  }
  outboxHeat = Math.min(MAX_HEAT, outboxHeat + amount);
  if (outboxHeat >= MAX_HEAT) {
    overheated = true;
    shootCooldown = Math.max(shootCooldown, 0.45);
    addNotice("OUTBOX OVERHEATED", "#ff3b3b");
  }
  return true;
}

function maybeDropPowerup(x, y) {
  if (Math.random() > 0.16) return;
  const type = pickPowerupType();
  powerups.push({
    ...type,
    x,
    y,
    w: 58,
    h: 26,
    vy: 72,
    wobble: Math.random() * Math.PI * 2
  });
}

function pickPowerupType() {
  const roll = Math.random();
  if (roll < 0.1) return POWERUP_TYPES.find(powerup => powerup.key === "vendredi");
  if (roll < 0.24) return POWERUP_TYPES.find(powerup => powerup.key === "cannabis");
  if (roll < 0.46) return POWERUP_TYPES.find(powerup => powerup.key === "star");
  const regularPowerups = POWERUP_TYPES.filter(powerup => powerup.key !== "vendredi" && powerup.key !== "cannabis");
  return regularPowerups[Math.floor(Math.random() * regularPowerups.length)];
}

function collectPowerup(powerup) {
  powerup.dead = true;
  if (powerup.key === "coffee") {
    coffeeTimer = 7;
    replyAllCooldown = Math.max(0, replyAllCooldown - 2.5);
    player.invincible = Math.max(player.invincible, 1.2);
    addNotice("BONUS COFFEE: DOUBLE SHOTS", powerup.color);
  } else if (powerup.key === "honey") {
    oooTimer = 7;
    enemyBullets = [];
    enemies.forEach(enemy => {
      enemy.vx *= 0.45;
      enemy.vy *= 0.62;
      addExplosion(enemy.x, enemy.y, powerup.color, 6);
    });
    addNotice("BONUS HONEY: SLOW FIELD", powerup.color);
  } else if (powerup.key === "clip") {
    clipSweep(powerup.color);
  } else if (powerup.key === "star") {
    starBurst(powerup.color);
  } else if (powerup.key === "dolphin") {
    dolphinWave(powerup.color);
  } else if (powerup.key === "vendredi") {
    vendrediMode(powerup.color);
  } else if (powerup.key === "cannabis") {
    cannabisMode(powerup.color);
  }
  focus = Math.min(100, focus + 12);
  tone(880, 0.08, "square", 0.045, 240);
}

function clipSweep(color) {
  const targets = enemies
    .filter(enemy => !enemy.dead)
    .sort((a, b) => Math.hypot(a.x - player.x, a.y - player.y) - Math.hypot(b.x - player.x, b.y - player.y))
    .slice(0, 6);
  targets.forEach((enemy, index) => {
    enemy.dead = true;
    score += enemy.fast ? 18 : 11;
    addExplosion(enemy.x, enemy.y, color, 14 + index * 2);
  });
  enemyBullets = [];
  if (boss) {
    boss.hp -= 55;
    addExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, color, 24);
  }
  addNotice(targets.length ? `CLIP ASSIST x${targets.length}` : "CLIP ASSIST: BOSS MEMO", color);
}

function starBurst(color) {
  [0, 120, 240].forEach(delay => {
    setTimeout(() => pushQapVolley(color), delay);
  });
  outboxHeat = Math.max(0, outboxHeat - 45);
  enemyBullets = [];
  addNotice("QAP: TRIPLE SHOOT", color);
  replyAllSound();
}

function pushQapVolley(color) {
  if (!player || state !== "game") return;
  const count = 12;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    bullets.push({
      x: player.x,
      y: player.y - 12,
      w: 8,
      h: 24,
      vx: Math.cos(angle) * 560,
      vy: Math.sin(angle) * 560,
      damage: 15,
      color,
      replyAll: true
    });
  }
}

function dolphinWave(color) {
  dolphinWaveTimer = 0.85;
  const lowerScreenTargets = enemies
    .filter(enemy => !enemy.dead)
    .filter(enemy => enemy.y > H * 0.18)
    .sort((a, b) => b.y - a.y);
  const targets = (lowerScreenTargets.length ? lowerScreenTargets : enemies.filter(enemy => !enemy.dead))
    .slice(0, 10);
  targets.forEach((enemy, index) => {
    enemy.dead = true;
    score += enemy.fast ? 24 : 15;
    addExplosion(enemy.x, enemy.y, color, 18 + index);
  });
  enemyBullets = [];
  if (boss) {
    boss.hp -= 70;
    boss.y = Math.max(46, boss.y - 18);
    addExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, color, 34);
  }
  for (let i = 0; i < 14; i += 1) {
    addExplosion((W / 13) * i, H * (0.72 - i * 0.006), color, 4);
  }
  outboxHeat = Math.max(0, outboxHeat - 35);
  addNotice(targets.length ? `DOLPHIN WAVE x${targets.length}` : "DOLPHIN WAVE: CLEAR SHOTS", color);
  blastSound();
}

function cannabisMode(color) {
  cannabisTimer = 7;
  oooTimer = Math.max(oooTimer, 7);
  outboxHeat = Math.max(0, outboxHeat - 65);
  enemyBullets.forEach(bullet => {
    bullet.vx *= 0.52;
    bullet.vy *= 0.5;
  });
  enemies.forEach(enemy => addExplosion(enemy.x, enemy.y, color, 10));
  addNotice("CANNABIS MAGIQUE: MODE CHILL", color);
  tone(523.25, 0.12, "triangle", 0.045, 180);
  tone(783.99, 0.16, "sine", 0.035, 260);
}

function vendrediMode(color) {
  vendrediSplashTimer = 3.4;
  vendrediBonusTimer = 8;
  oooTimer = Math.max(oooTimer, 12);
  player.invincible = Math.max(player.invincible, 5);
  replyAllCooldown = 0;
  focus = 100;
  outboxHeat = 0;
  overheated = false;
  heatNoticeCooldown = 0;
  enemyBullets = [];
  coverObjects.forEach(cover => {
    cover.hp = cover.maxHp;
    cover.dead = false;
  });
  enemies.forEach(enemy => {
    if (!enemy.dead) {
      enemy.dead = true;
      score += enemy.fast ? 24 : 15;
      addExplosion(enemy.x, enemy.y, color, 18);
    }
  });
  if (boss) {
    boss.hp -= 160;
    addExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, color, 70);
  }
  lives = Math.min(MAX_LIVES, lives + 2);
  addNotice("VENDREDI 15H: MEGA BONUS", color);
  addNotice("FOCUS FULL - OUTBOX CLEAN", "#ff3d9a");
  tone(523.25, 0.12, "triangle", 0.05, 220);
  tone(783.99, 0.18, "square", 0.045, 120);
}

function mostCrowdedEnemyType() {
  const counts = {};
  enemies.forEach(enemy => {
    if (!enemy.dead) counts[enemy.type] = (counts[enemy.type] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : "email";
}

function addNotice(text, color = "#ffd23d") {
  notices.push({ text, color, life: 1.35, maxLife: 1.35 });
}

// The Focus Blast is a screen clear for normal enemies, not boss damage.
function focusBlast() {
  if (focus < 100) return;
  focus = 0;
  blastSound();
  enemies.forEach(enemy => {
    addExplosion(enemy.x, enemy.y, enemy.color, 16);
    score += enemy.fast ? 20 : 10;
  });
  enemies = [];
}

function loseLife() {
  if (player.invincible > 0 || state !== "game") return;
  lives -= 1;
  levelLostLife = true;
  player.invincible = 1.9;
  addExplosion(player.x, player.y, "#39ff14", 28);
  explosionSound();
  if (lives <= 0) {
    if (focus >= LAST_CHANCE_FOCUS_COST) {
      focus -= LAST_CHANCE_FOCUS_COST;
      lives = 1;
      player.invincible = 2.8;
      addExplosion(player.x, player.y, "#19e3e3", 42);
      blastSound();
      updateHud();
      return;
    }
    saveHighScore();
    document.getElementById("gameOverText").textContent = `Les distractions ont atteint ton bureau. Score : ${score}`;
    submitRunScore();
    gameOverSound();
    setState("gameOver");
  }
}

// Level-perfect bonus rewards completing a wave without losing a life.
function advanceLevel() {
  if (levelLostLife === false) score += 100 + level * 25;
  level += 1;
  focus = Math.min(100, focus + 25);
  if (level > MAX_LEVEL) {
    saveHighScore();
    submitRunScore();
    setState("victory");
    return;
  }
  beginLevel();
}

// One update pass owns all gameplay movement so pausing is simple.
function update(dt) {
  if (state !== "game") return;
  shootCooldown = Math.max(0, shootCooldown - dt);
  replyAllCooldown = Math.max(0, replyAllCooldown - dt);
  bossShootCooldown = Math.max(0, bossShootCooldown - dt);
  coffeeTimer = Math.max(0, coffeeTimer - dt);
  bubbleTimer = Math.max(0, bubbleTimer - dt);
  oooTimer = Math.max(0, oooTimer - dt);
  outboxHeat = Math.max(0, outboxHeat - dt * (cannabisTimer > 0 ? 48 : overheated ? 34 : coffeeTimer > 0 ? 27 : 18));
  heatNoticeCooldown = Math.max(0, heatNoticeCooldown - dt);
  vendrediSplashTimer = Math.max(0, vendrediSplashTimer - dt);
  vendrediBonusTimer = Math.max(0, vendrediBonusTimer - dt);
  cannabisTimer = Math.max(0, cannabisTimer - dt);
  dolphinWaveTimer = Math.max(0, dolphinWaveTimer - dt);
  if (overheated && outboxHeat <= 38) {
    overheated = false;
    addNotice("OUTBOX READY", "#34d957");
  }
  player.invincible = Math.max(0, player.invincible - dt);
  focus = Math.min(100, focus + dt * 3.5);

  const movingLeft = keys.ArrowLeft || keys.KeyA || touch.left;
  const movingRight = keys.ArrowRight || keys.KeyD || touch.right;
  const movingUp = keys.ArrowUp || keys.KeyW || touch.up;
  const movingDown = keys.ArrowDown || keys.KeyS || touch.down;
  const playerSpeed = (315 + level * 7) * (coffeeTimer > 0 ? 1.34 : 1);
  if (movingLeft) player.x -= playerSpeed * dt;
  if (movingRight) player.x += playerSpeed * dt;
  if (movingUp) player.y -= playerSpeed * dt;
  if (movingDown) player.y += playerSpeed * dt;
  player.x = clamp(player.x, 26, W - 26);
  player.y = clamp(player.y, playerMinY(), H - 38);
  if (keys.Space || touch.shoot) fire();
  if (keys.KeyE || touch.reply) {
    fireReplyAll();
    touch.reply = false;
  }
  if (keys.ShiftLeft || keys.ShiftRight || touch.blast) {
    focusBlast();
    touch.blast = false;
  }

  spawnTimer -= dt;
  if (waveRemaining > 0 && spawnTimer <= 0) {
    spawnEnemy();
    waveRemaining -= 1;
    spawnTimer = Math.max(0.08, 0.7 - levelDifficulty() * 0.052);
  }

  bullets.forEach(b => {
    b.x += (b.vx || 0) * dt;
    b.y += b.vy * dt;
  });
  bullets = bullets.filter(b => b.y > -30 && b.x > -40 && b.x < W + 40);

  enemies.forEach(enemy => {
    enemy.wobble += dt * (enemy.zigzag ? enemy.zigzagRate : 4);
    enemy.shotTimer -= dt;
    const enemySlow = cannabisTimer > 0 ? 0.4 : (oooTimer > 0 ? 0.42 : 1);
    const lateralWobble = Math.sin(enemy.wobble) * (enemy.zigzag ? enemy.zigzagAmp : 24);
    enemy.x += (enemy.vx + lateralWobble) * dt * enemySlow;
    enemy.y += enemy.vy * dt * enemySlow;
    if (enemy.y > 35 && enemy.y < H * 0.62 && enemy.shotTimer <= 0) {
      shootEnemy(enemy);
      const difficulty = levelDifficulty();
      enemy.shotTimer = Math.max(0.75, 3.1 - difficulty * 0.1) + Math.random() * 1.4;
    }
    if (enemy.x < 20 || enemy.x > W - 20) enemy.vx *= -1;
    if (enemy.y > H - 64) {
      enemy.dead = true;
      loseLife();
    }
  });

  if (boss) {
    boss.x += boss.vx * dt * (cannabisTimer > 0 ? 0.4 : (oooTimer > 0 ? 0.45 : 1));
    if (boss.x < 24 || boss.x + boss.w > W - 24) boss.vx *= -1;
    if (bossShootCooldown <= 0) {
      const difficulty = levelDifficulty();
      const shots = level >= 12 ? [-48, -24, 0, 24, 48] : (level >= 6 ? [-28, 0, 28] : [0]);
      shots.forEach(offset => pushEnemyBullet(
        boss.x + boss.w / 2 + offset,
        boss.y + boss.h,
        offset * 1.9,
        160 + difficulty * 20,
        8,
        18
      ));
      bossShootCooldown = Math.max(0.42, 1.5 - difficulty * 0.07);
    }
  }

  enemyBullets.forEach(b => {
    const bulletSlow = cannabisTimer > 0 ? 0.5 : (oooTimer > 0 ? 0.55 : 1);
    b.x += (b.vx || 0) * dt * bulletSlow;
    b.y += b.vy * dt * bulletSlow;
    if (b.wobble) b.x += Math.sin((performance.now() / 1000 + b.seed) * 7) * b.wobble * dt;
  });
  enemyBullets = enemyBullets.filter(b => b.y < H + 30 && b.x > -40 && b.x < W + 40);

  powerups.forEach(powerup => {
    powerup.wobble += dt * 5;
    powerup.y += powerup.vy * dt;
    powerup.x += Math.sin(powerup.wobble) * 24 * dt;
    if (hit(playerBounds(), powerup)) collectPowerup(powerup);
    if (powerup.y > H + 40) powerup.dead = true;
  });

  handleCollisions();
  updateParticles(dt);
  updateStars(dt);
  updateNotices(dt);
  enemies = enemies.filter(enemy => !enemy.dead);
  powerups = powerups.filter(powerup => !powerup.dead);
  if (waveRemaining === 0 && enemies.length === 0 && !boss) {
    levelTransition += dt;
    if (levelTransition > 0.8) {
      levelTransition = 0;
      advanceLevel();
    }
  }
  updateHud();
}

function handleCollisions() {
  enemyBullets.forEach(bullet => {
    for (const cover of coverObjects) {
      if (!cover.dead && hit(projectileBounds(bullet), coverBounds(cover))) {
        bullet.dead = true;
        damageCover(cover, 1);
        addExplosion(bullet.x, bullet.y, cover.color, 6);
        break;
      }
    }
  });

  enemies.forEach(enemy => {
    for (const cover of coverObjects) {
      if (!cover.dead && !enemy.dead && hit(enemyBounds(enemy), coverBounds(cover))) {
        enemy.dead = true;
        damageCover(cover, enemy.fast ? 3 : 2);
        addExplosion(enemy.x, enemy.y, cover.color, 12);
        break;
      }
    }
  });

  for (const bullet of bullets) {
    for (const enemy of enemies) {
      if (!enemy.dead && hit(bullet, enemy)) {
        if (bullet.pierce > 0) bullet.pierce -= 1;
        else if (!bullet.replyAll) bullet.dead = true;
        enemy.hp = (enemy.hp || 1) - (bullet.damage || 1);
        addExplosion(bullet.x || enemy.x, bullet.y || enemy.y, bullet.color || enemy.color, enemy.hp > 0 ? 6 : 18);
        if (enemy.hp <= 0) {
          enemy.dead = true;
          score += enemy.scoreValue || (bullet.replyAll ? (enemy.fast ? 30 : 18) : (enemy.fast ? 20 : 10));
          focus = Math.min(100, focus + 7);
          addExplosion(enemy.x, enemy.y, enemy.color, 18);
          maybeDropPowerup(enemy.x, enemy.y);
        } else {
          score += 2;
          focus = Math.min(100, focus + 2);
        }
        explosionSound();
      }
    }
    if (boss && hit(bullet, boss)) {
      if (bullet.pierce > 0) bullet.pierce = 0;
      bullet.dead = true;
      boss.hp -= bullet.damage || 8;
      score += bullet.replyAll ? 12 : 5;
      focus = Math.min(100, focus + 2);
      addExplosion(bullet.x, bullet.y, bullet.color || "#ffe94a", bullet.replyAll ? 12 : 7);
      if (boss.hp <= 0) {
        score += 500;
        focus = Math.min(100, focus + 40);
        addExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, "#ff00ff", 60);
        powerups.push({
          ...POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)],
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h / 2,
          w: 58,
          h: 26,
          vy: 58,
          wobble: 0
        });
        addNotice("BOSS CANCELLED", "#34d957");
        explosionSound();
        boss = null;
      }
    }
  }
  bullets = bullets.filter(bullet => !bullet.dead);

  enemies.forEach(enemy => {
    if (hit(playerBounds(), enemyBounds(enemy))) {
      enemy.dead = true;
      loseLife();
    }
  });
  enemyBullets.forEach(bullet => {
    if (hit(playerBounds(), projectileBounds(bullet))) {
      bullet.dead = true;
      if (bubbleTimer > 0) {
        bubbleTimer = Math.max(0, bubbleTimer - 0.8);
        addExplosion(bullet.x, bullet.y, "#9bffff", 10);
        tone(1046.5, 0.05, "sine", 0.035, 120);
      } else {
        loseLife();
      }
    }
  });
  enemyBullets = enemyBullets.filter(bullet => !bullet.dead);
  coverObjects = coverObjects.filter(cover => !cover.dead);
}

function damageCover(cover, amount) {
  cover.hp -= amount;
  if (cover.hp <= 0) {
    cover.dead = true;
    addExplosion(cover.x, cover.y, cover.color, 24);
    addNotice(`${cover.label} DOWN`, cover.color);
  }
}

function projectileBounds(projectile) {
  return { x: projectile.x - projectile.w / 2, y: projectile.y, w: projectile.w, h: projectile.h };
}

function enemyBounds(enemy) {
  return { x: enemy.x - enemy.w / 2, y: enemy.y - enemy.h / 2, w: enemy.w, h: enemy.h };
}

function coverBounds(cover) {
  return { x: cover.x - cover.w / 2, y: cover.y - cover.h / 2, w: cover.w, h: cover.h };
}

function hit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Collision boxes are intentionally compact so neon outlines feel fair.
function playerBounds() {
  return { x: player.x - 15, y: player.y - 10, w: 30, h: 24 };
}

function playerMinY() {
  return Math.max(72, H * 0.12);
}

function addExplosion(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 260,
      vy: (Math.random() - 0.5) * 260,
      life: 0.25 + Math.random() * 0.55,
      maxLife: 0.8,
      size: 2 + Math.random() * 5,
      color
    });
  }
}

function updateParticles(dt) {
  particles.forEach(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 80 * dt;
    p.life -= dt;
  });
  particles = particles.filter(p => p.life > 0);
}

function updateNotices(dt) {
  notices.forEach(notice => {
    notice.life -= dt;
  });
  notices = notices.filter(notice => notice.life > 0);
}

function updateStars(dt) {
  stars.forEach(star => {
    star.y += star.speed * dt;
    if (star.y > H) {
      star.y = 0;
      star.x = Math.random() * W;
    }
  });
}

function drawBackground() {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0b0d16");
  bg.addColorStop(0.48, "#05060a");
  bg.addColorStop(1, "#070510");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  stars.forEach(star => {
    ctx.fillStyle = star.s > 1.8 ? "#8efcff" : "#fff8ff";
    ctx.globalAlpha = 0.28 + star.s / 4;
    ctx.fillRect(star.x, star.y, star.s, star.s);
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,61,154,0.045)";
  for (let y = 120; y < H; y += 160) {
    ctx.fillRect(0, y, W, 2);
  }
  ctx.strokeStyle = "rgba(25,227,227,0.08)";
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.lineTo(W / 2 + (x - W / 2) * 0.18, H * 0.55);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,61,154,0.08)";
  ctx.fillRect(0, 0, W, 76);
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  if (bubbleTimer > 0) {
    ctx.save();
    ctx.globalAlpha = 0.32 + Math.sin(bubbleTimer * 12) * 0.08;
    ctx.strokeStyle = "#9bffff";
    ctx.lineWidth = 3;
    glow("#9bffff", 18);
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if (player.invincible > 0 && Math.floor(player.invincible * 16) % 2 === 0) ctx.globalAlpha = 0.38;
  const shipSpriteKey = vendrediBonusTimer > 0 ? "player_ship_rainbow" : "player_ship";
  const shipGlow = vendrediBonusTimer > 0 ? "#fff8ff" : "#19e3e3";
  if (drawImageSprite(shipSpriteKey, 0, 1, 92, shipGlow, 16)) {
    ctx.restore();
    ctx.shadowBlur = 0;
    return;
  }
  if (window.II) {
    const ship = window.II.bake("focus-ship", window.II.dShip, window.II.SHIP, 18, 16, 3, window.II.frame);
    window.II.blit(ctx, ship, -ship.width / 2, -ship.height / 2, window.II.SHIP.glow, 18);
    ctx.restore();
    ctx.shadowBlur = 0;
    return;
  }
  glow("#39ff14", 18);
  ctx.fillStyle = "#39ff14";
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(25, 18);
  ctx.lineTo(9, 12);
  ctx.lineTo(0, 24);
  ctx.lineTo(-9, 12);
  ctx.lineTo(-25, 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#00f6ff";
  ctx.fillRect(-7, -3, 14, 12);
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(-3, 18, 6, 12);
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawBullets() {
  ctx.save();
  bullets.forEach(b => {
    const angle = b.vx ? Math.atan2(b.vx, -b.vy) : 0;
    const spriteSize = b.replyAll ? 38 : 30;
    const spriteDrawn = drawRotatedImageSprite("player_shot", b.x, b.y + b.h / 2, spriteSize, angle, b.color || "#ffd23d", b.replyAll ? 18 : 12);
    if (!spriteDrawn) {
      glow(b.color || "#ffd23d", b.replyAll ? 18 : 12);
      ctx.fillStyle = b.color || "#ffd23d";
      ctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h);
      if (b.replyAll) {
        ctx.globalAlpha = 0.32;
        ctx.fillRect(b.x - b.w / 2 - 3, b.y + 7, b.w + 6, b.h - 5);
        ctx.globalAlpha = 1;
      }
    }
  });
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawPowerups() {
  powerups.forEach(powerup => {
    ctx.save();
    glow(powerup.color, 16);
    ctx.translate(powerup.x, powerup.y);
    const spriteSize = powerup.key === "star" ? 86 : (powerup.key === "cannabis" ? 76 : 62);
    const labelY = powerup.key === "star" ? 31 : (powerup.key === "cannabis" ? 29 : 23);
    const labelTop = powerup.key === "star" ? 23 : (powerup.key === "cannabis" ? 21 : 15);
    const imageDrawn = drawImageSprite(powerup.key, 0, -4, spriteSize, powerup.color, 14);
    if (imageDrawn) {
      ctx.font = "bold 8px 'Press Start 2P', Courier New";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelWidth = Math.max(powerup.w, ctx.measureText(powerup.label).width + 12);
      ctx.fillStyle = "rgba(5,6,10,0.78)";
      ctx.fillRect(-labelWidth / 2, labelTop, labelWidth, 15);
      ctx.strokeStyle = powerup.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(-labelWidth / 2, labelTop, labelWidth, 15);
      ctx.fillStyle = powerup.color;
      ctx.fillText(powerup.label, 0, labelY);
      ctx.restore();
      return;
    }
    if (powerup.key === "star") {
      drawStarPowerup(powerup);
      ctx.restore();
      return;
    }
    ctx.fillStyle = "rgba(5,6,10,0.86)";
    ctx.strokeStyle = powerup.color;
    ctx.lineWidth = 3;
    ctx.fillRect(-powerup.w / 2, -powerup.h / 2, powerup.w, powerup.h);
    ctx.strokeRect(-powerup.w / 2, -powerup.h / 2, powerup.w, powerup.h);
    ctx.fillStyle = powerup.color;
    ctx.font = "bold 9px 'Press Start 2P', Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(powerup.label, 0, 1);
    ctx.restore();
  });
  ctx.shadowBlur = 0;
}

function drawStarPowerup(powerup) {
  ctx.save();
  glow(powerup.color, 18);
  ctx.fillStyle = "rgba(5,6,10,0.84)";
  ctx.strokeStyle = powerup.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? 24 : 10;
    const angle = -Math.PI / 2 + i * Math.PI / 5;
    const x = Math.cos(angle) * radius;
    const y = -8 + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.font = "bold 8px 'Press Start 2P', Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#05060a";
  ctx.fillRect(-31, 17, 62, 15);
  ctx.fillStyle = powerup.color;
  ctx.fillText(powerup.label, 0, 25);
  ctx.restore();
}

function drawCoverObjects() {
  coverObjects.forEach(cover => {
    const health = clamp(cover.hp / cover.maxHp, 0, 1);
    ctx.save();
    ctx.translate(cover.x, cover.y);
    glow(cover.color, 5);
    ctx.globalAlpha = 0.72 + health * 0.28;
    const spriteKey = vendrediBonusTimer > 0 ? `${cover.spriteKey}_rainbow` : cover.spriteKey;
    const spriteDrawn = drawImageSprite(spriteKey, 0, -10, 122, cover.color, 12);
    if (!spriteDrawn) {
      drawPixelPanel(-cover.w / 2, -cover.h / 2, cover.w, cover.h, cover.color);
      drawCoverIcon(cover);
    }
    ctx.font = "bold 9px 'Press Start 2P', Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const labelWidth = Math.max(64, ctx.measureText(cover.label).width + 18);
    const labelY = cover.h / 2 + 10;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(5,6,10,0.96)";
    ctx.fillRect(-labelWidth / 2, labelY - 10, labelWidth, 18);
    ctx.strokeStyle = cover.color;
    ctx.lineWidth = 1;
    ctx.strokeRect(-labelWidth / 2, labelY - 10, labelWidth, 18);
    glow(cover.color, 8);
    ctx.fillStyle = "#f3fbff";
    ctx.fillText(cover.label, 0, labelY);
    ctx.fillStyle = "rgba(5,6,10,0.92)";
    ctx.shadowBlur = 0;
    ctx.fillRect(-cover.w / 2 + 12, cover.h / 2 + 24, cover.w - 24, 5);
    ctx.fillStyle = cover.color;
    ctx.fillRect(-cover.w / 2 + 12, cover.h / 2 + 24, (cover.w - 24) * health, 5);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawPixelPanel(x, y, w, h, color) {
  ctx.fillStyle = "rgba(5,6,10,0.88)";
  ctx.fillRect(x + 5, y, w - 10, h);
  ctx.fillRect(x, y + 5, w, h - 10);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(x + 10, y + 8, w - 20, 5);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 5, y, w - 10, h);
  ctx.strokeRect(x, y + 5, w, h - 10);
}

function drawCoverIcon(cover) {
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = cover.color;
  ctx.fillStyle = cover.color;
  if (cover.key === "coffee") {
    ctx.strokeRect(-18, -13, 28, 20);
    ctx.strokeRect(10, -8, 12, 10);
    ctx.fillRect(-22, 9, 42, 4);
    ctx.globalAlpha = 0.55;
    ctx.fillRect(-12, -22, 4, 7);
    ctx.fillRect(0, -24, 4, 9);
    ctx.fillRect(12, -22, 4, 7);
  } else if (cover.key === "bubble") {
    ctx.strokeRect(-24, -14, 48, 24);
    ctx.beginPath();
    ctx.arc(-11, -2, 8, 0, Math.PI * 2);
    ctx.arc(7, -4, 10, 0, Math.PI * 2);
    ctx.arc(17, 7, 5, 0, Math.PI * 2);
    ctx.stroke();
  } else if (cover.key === "party") {
    ctx.beginPath();
    ctx.moveTo(-19, 11);
    ctx.lineTo(-5, -17);
    ctx.lineTo(11, 11);
    ctx.closePath();
    ctx.stroke();
    ctx.fillRect(-3, -12, 6, 6);
    ctx.fillRect(-9, 0, 6, 6);
    ctx.fillRect(4, 4, 6, 6);
    ctx.beginPath();
    ctx.arc(22, -12, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillRect(20, -5, 3, 13);
  } else {
    ctx.strokeRect(-24, -13, 48, 22);
    ctx.fillRect(-16, -22, 32, 10);
    ctx.fillRect(-16, 11, 32, 5);
    ctx.fillStyle = "#05060a";
    ctx.fillRect(-10, -5, 20, 5);
    ctx.fillStyle = cover.color;
    ctx.fillRect(15, -6, 5, 5);
  }
  ctx.restore();
}

function drawEnemyBullet(b) {
  ctx.save();
  const angle = b.vx ? Math.atan2(-(b.vx || 0), b.vy || 1) : 0;
  const spriteKey = b.spriteKey || "enemy_shot";
  const spriteColor = spriteKey === "boss_special_shot" ? "#ffd23d" : "#ff3b3b";
  const spriteDrawn = drawRotatedImageSprite(spriteKey, b.x, b.y + b.h / 2, Math.max(spriteKey === "boss_special_shot" ? 54 : 34, b.h + 18), angle, spriteColor, spriteKey === "boss_special_shot" ? 18 : 13);
  if (!spriteDrawn) {
    glow("#ff3b3b", 11);
    ctx.fillStyle = "#ff3b3b";
    ctx.fillRect(b.x - b.w / 2, b.y, b.w, b.h);
  }
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawEnemy(enemy) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  const imageEnemy = drawPngEnemy(enemy);
  if (imageEnemy) {
    drawEnemyLabel(enemy, imageEnemy.labelY);
    ctx.restore();
    ctx.shadowBlur = 0;
    return;
  }
  const pixelEnemy = drawPixelEnemy(enemy);
  if (pixelEnemy) {
    drawEnemyLabel(enemy, pixelEnemy.labelY);
    ctx.restore();
    ctx.shadowBlur = 0;
    return;
  }
  glow(enemy.color, 12);
  ctx.strokeStyle = enemy.color;
  ctx.fillStyle = "rgba(0,0,0,0.82)";
  ctx.lineWidth = 3;
  const s = enemy.w;
  const h = enemy.h;
  if (enemy.fast) {
    ctx.fillStyle = "#3a0000";
    ctx.fillRect(-s / 2 - 3, -h / 2 - 3, s + 6, h + 6);
    ctx.fillStyle = "rgba(0,0,0,0.82)";
  }
  drawEnemyIcon(enemy.type, -s / 2, -h / 2, s, h);
  drawEnemyLabel(enemy, h / 2 + 14);
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawPngEnemy(enemy) {
  const baseSize = enemy.fast ? 154 : 138;
  const enemySpriteScales = {
    ppt: 0.78,
    word: 0.78,
    windouf: 0.82,
    blue_screen: 0.82
  };
  const spriteScale = enemySpriteScales[enemy.type] || 1;
  const size = Math.round(baseSize * spriteScale);
  if (!drawImageSprite(enemy.type, 0, 0, size, enemy.fast ? "#ff3b3b" : enemy.color, enemy.fast ? 22 : 15)) return null;
  return { labelY: size / 2 + 16 };
}

function drawImageSprite(key, cx, cy, targetSize, glowColor, blur) {
  const sprite = imageSprites[key];
  if (!sprite || !sprite.ready || !sprite.canvas || !targetSize) return false;
  const img = sprite.canvas;
  const ratio = img.width / img.height;
  const drawW = ratio >= 1 ? targetSize : targetSize * ratio;
  const drawH = ratio >= 1 ? targetSize / ratio : targetSize;
  ctx.save();
  if (glowColor) glow(glowColor, blur || 12);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  ctx.restore();
  return true;
}

function drawEnemyLabel(enemy, y) {
  const label = enemyLabels[enemy.type] || enemy.type.toUpperCase();
  const labelColor = enemy.fast ? "#ff3b3b" : (enemyLabelColors[enemy.type] || enemy.color || "#19e3e3");
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.font = "bold 9px 'Press Start 2P', Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const width = Math.max(46, ctx.measureText(label).width + 14);
  const height = 17;
  ctx.fillStyle = "rgba(5,6,10,0.78)";
  ctx.fillRect(-width / 2, y - 10, width, height);
  ctx.strokeStyle = labelColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(-width / 2, y - 10, width, height);
  ctx.fillStyle = enemy.fast ? "#ffb3b3" : labelColor;
  ctx.fillText(label, 0, y - 1);
  ctx.restore();
}

function drawPixelEnemy(enemy) {
  if (!window.II) return false;
  const key = enemy.type === "question" ? "popup" : enemy.type;
  const sprite = window.II.SPRITES.find(item => item.key === key);
  if (!sprite) return false;
  const scale = enemy.fast ? 4 : 3;
  const baked = window.II.bake(`enemy-${key}`, sprite.draw, sprite.pal, window.II.GRID, window.II.GRID, scale, window.II.frame);
  if (enemy.fast) {
    ctx.fillStyle = "rgba(74,12,12,0.62)";
    ctx.fillRect(-baked.width / 2 - 5, -baked.height / 2 - 5, baked.width + 10, baked.height + 10);
  }
  window.II.blit(ctx, baked, -baked.width / 2, -baked.height / 2, sprite.pal.lite, enemy.fast ? 18 : 12);
  return { labelY: baked.height / 2 + 11 };
}

// Every enemy icon is built from primitive canvas shapes.
function drawEnemyIcon(type, x, y, w, h) {
  if (type === "email") {
    ctx.strokeRect(x, y + 6, w, h - 12);
    ctx.beginPath(); ctx.moveTo(x, y + 6); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x + w, y + 6); ctx.stroke();
  } else if (type === "meeting") {
    ctx.strokeRect(x + 3, y + 5, w - 6, h - 8);
    ctx.fillRect(x + 9, y, 4, 10); ctx.fillRect(x + w - 13, y, 4, 10);
    ctx.fillRect(x + 8, y + 17, w - 16, 4);
  } else if (type === "call") {
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w / 2 - 4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillRect(x + 11, y + 10, 5, h - 20); ctx.fillRect(x + w - 16, y + 10, 5, h - 20);
  } else if (type === "ppt") {
    ctx.strokeRect(x + 3, y + 6, w - 6, h - 10);
    ctx.fillRect(x + 8, y + h - 12, 5, 6); ctx.fillRect(x + 16, y + h - 18, 5, 12); ctx.fillRect(x + 24, y + h - 24, 5, 18);
  } else if (type === "word") {
    ctx.beginPath(); ctx.moveTo(x + 8, y); ctx.lineTo(x + w - 8, y); ctx.lineTo(x + w, y + 8); ctx.lineTo(x + w, y + h); ctx.lineTo(x + 8, y + h); ctx.closePath(); ctx.stroke();
    ctx.fillRect(x + 12, y + 13, w - 20, 3); ctx.fillRect(x + 12, y + 22, w - 14, 3);
  } else if (type === "excel") {
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
    for (let i = 1; i < 3; i += 1) { ctx.beginPath(); ctx.moveTo(x + 4, y + i * h / 3); ctx.lineTo(x + w - 4, y + i * h / 3); ctx.stroke(); }
    for (let i = 1; i < 3; i += 1) { ctx.beginPath(); ctx.moveTo(x + i * w / 3, y + 4); ctx.lineTo(x + i * w / 3, y + h - 4); ctx.stroke(); }
  } else if (type === "chat") {
    ctx.strokeRect(x + 4, y + 4, w - 8, h - 13);
    ctx.beginPath(); ctx.moveTo(x + 13, y + h - 9); ctx.lineTo(x + 11, y + h); ctx.lineTo(x + 22, y + h - 9); ctx.stroke();
    ctx.fillRect(x + 12, y + 15, 4, 4); ctx.fillRect(x + 21, y + 15, 4, 4);
  } else if (type === "jira") {
    ctx.beginPath(); ctx.moveTo(x + 7, y + 6); ctx.lineTo(x + w - 7, y + 6); ctx.lineTo(x + w - 2, y + h / 2); ctx.lineTo(x + w - 7, y + h - 6); ctx.lineTo(x + 7, y + h - 6); ctx.lineTo(x + 2, y + h / 2); ctx.closePath(); ctx.stroke();
    ctx.fillRect(x + 13, y + 13, w - 26, 4); ctx.fillRect(x + 13, y + 22, w - 26, 4);
  } else if (type === "urgent") {
    ctx.beginPath(); ctx.moveTo(x + w / 2, y + 1); ctx.lineTo(x + w - 2, y + h - 2); ctx.lineTo(x + 2, y + h - 2); ctx.closePath(); ctx.stroke();
    ctx.fillRect(x + w / 2 - 2, y + 12, 4, 12); ctx.fillRect(x + w / 2 - 2, y + 28, 4, 4);
  } else {
    const label = enemyLabels[type] || type.slice(0, 4).toUpperCase();
    ctx.strokeRect(x + 3, y + 5, w - 6, h - 10);
    ctx.fillRect(x + 10, y + 12, w - 20, h - 24);
    ctx.fillStyle = "#05060a";
    ctx.font = "bold 9px 'Press Start 2P', Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2);
  }
}

function drawBoss() {
  ctx.save();
  glow("#ff3d9a", 22);
  const bossSpriteKey = boss.spriteKey || "boss_cc";
  const pngBossDrawn = drawImageSpriteAt(bossSpriteKey, boss.x + boss.w / 2, boss.y + boss.h / 2 + 14, 190, "#ff3d9a", 26);
  if (!pngBossDrawn && window.II) {
    const bossSprite = pixelBossForLevel();
    const baked = window.II.bake(`boss-${bossSprite.key}`, bossSprite.draw, bossSprite.pal, window.II.BW, window.II.BH, 4, window.II.frame);
    window.II.blit(ctx, baked, boss.x + boss.w / 2 - baked.width / 2, boss.y + 21, bossSprite.pal.lite, 24);
  }
  ctx.fillStyle = "#19e3e3";
  ctx.font = "bold 11px 'Press Start 2P', Courier New";
  ctx.textAlign = "center";
  wrapBossName(boss.name, boss.x + boss.w / 2, boss.y + 6);
  ctx.fillStyle = "#080a12";
  ctx.fillRect(boss.x, boss.y - 18, boss.w, 8);
  ctx.fillStyle = "#ff3b3b";
  ctx.fillRect(boss.x, boss.y - 18, boss.w * Math.max(0, boss.hp / boss.maxHp), 8);
  ctx.strokeStyle = "#ffd23d";
  ctx.strokeRect(boss.x, boss.y - 18, boss.w, 8);
  ctx.restore();
  ctx.shadowBlur = 0;
}

function drawImageSpriteAt(key, cx, cy, targetSize, glowColor, blur) {
  const sprite = imageSprites[key];
  if (!sprite || !sprite.ready || !sprite.canvas) return false;
  const img = sprite.canvas;
  const ratio = img.width / img.height;
  const drawW = ratio >= 1 ? targetSize : targetSize * ratio;
  const drawH = ratio >= 1 ? targetSize / ratio : targetSize;
  ctx.save();
  if (glowColor) glow(glowColor, blur || 12);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  ctx.restore();
  return true;
}

function drawRotatedImageSprite(key, cx, cy, targetSize, angle, glowColor, blur) {
  const sprite = imageSprites[key];
  if (!sprite || !sprite.ready || !sprite.canvas) return false;
  const img = sprite.canvas;
  const ratio = img.width / img.height;
  const drawW = ratio >= 1 ? targetSize : targetSize * ratio;
  const drawH = ratio >= 1 ? targetSize / ratio : targetSize;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  if (glowColor) glow(glowColor, blur || 12);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
  return true;
}

function pixelBossForLevel() {
  const bosses = window.II.BOSSES;
  return bosses[Math.floor(level / 2 - 1) % bosses.length];
}

function wrapBossName(name, x, y) {
  const words = name.split(" ");
  let line = "";
  let lineY = y;
  words.forEach(word => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > boss.w - 24 && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += 16;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, lineY);
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

function drawDolphinWave() {
  if (dolphinWaveTimer <= 0) return;
  const duration = 0.85;
  const progress = 1 - dolphinWaveTimer / duration;
  const alpha = Math.sin(progress * Math.PI);
  const y = H * (0.82 - progress * 0.52);
  ctx.save();
  ctx.globalAlpha = 0.82 * alpha;
  ctx.strokeStyle = "#58d6ff";
  ctx.lineWidth = Math.max(8, H * 0.012);
  ctx.shadowColor = "#58d6ff";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  for (let x = -20; x <= W + 20; x += 18) {
    const waveY = y + Math.sin(x * 0.026 + progress * Math.PI * 5) * 18;
    if (x === -20) ctx.moveTo(x, waveY);
    else ctx.lineTo(x, waveY);
  }
  ctx.stroke();
  ctx.globalAlpha = 0.34 * alpha;
  ctx.lineWidth = Math.max(18, H * 0.026);
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawNotices() {
  notices.forEach((notice, index) => {
    const alpha = Math.max(0, notice.life / notice.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = notice.color;
    ctx.shadowColor = notice.color;
    ctx.shadowBlur = 14;
    ctx.font = "bold 13px 'Press Start 2P', Courier New";
    ctx.textAlign = "center";
    ctx.fillText(notice.text, W / 2, H * 0.24 + index * 24 - (1 - alpha) * 22);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawVendrediSplash() {
  if (vendrediSplashTimer <= 0) return;
  const duration = 3.4;
  const progress = 1 - vendrediSplashTimer / duration;
  const alpha = Math.min(1, vendrediSplashTimer / 0.35, (duration - vendrediSplashTimer) / 0.35);
  ctx.save();
  ctx.globalAlpha = 0.28 * alpha;
  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, W, H);
  drawVendrediMagic(progress, alpha, false);
  ctx.globalAlpha = alpha;
  drawImageSpriteAt("vendredi_rainbow", W / 2, H * 0.49 + Math.sin(progress * Math.PI * 2) * 6, Math.min(W * 1.08, H * 0.82), null, 0);
  drawVendrediMagic(progress, alpha, true);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "#ff3d9a";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#05060a";
  ctx.globalAlpha = 0.48 * alpha;
  ctx.fillRect(W * 0.12, H * 0.335, W * 0.76, 122);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#fff8ff";
  ctx.font = `bold ${Math.max(18, Math.min(42, W / 16))}px 'Press Start 2P', Courier New`;
  ctx.fillText("VENDREDI 15H", W / 2, H * 0.38);
  ctx.fillStyle = "#ffd23d";
  ctx.shadowColor = "#ff3d9a";
  ctx.font = `bold ${Math.max(12, Math.min(24, W / 28))}px 'Press Start 2P', Courier New`;
  ctx.fillText("MEGA BONUS", W / 2, H * 0.46);
  ctx.fillStyle = "#19e3e3";
  ctx.font = `bold ${Math.max(8, Math.min(13, W / 52))}px 'Press Start 2P', Courier New`;
  ctx.fillText("FOCUS FULL / OUTBOX CLEAN / DEFENDERS RESTORED", W / 2, H * 0.52);
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
}

function drawVendrediMagic(progress, alpha, front) {
  const colors = ["#ff3d9a", "#19e3e3", "#ffd23d", "#34d957", "#ff8a1a"];
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = (front ? 0.52 : 0.34) * alpha;
  colors.forEach((color, colorIndex) => {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = front ? 12 : 8;
    for (let i = 0; i < 8; i += 1) {
      const seed = i + colorIndex * 11;
      const angle = progress * Math.PI * 2 + seed * 1.37;
      const radius = Math.min(W, H) * (front ? 0.18 : 0.32) + Math.sin(progress * 8 + seed) * 22;
      const x = W / 2 + Math.cos(angle) * radius + Math.sin(seed * 4.2) * W * 0.11;
      const y = H * 0.49 + Math.sin(angle * 1.25) * radius * 0.62;
      const size = front ? 3 + ((seed + Math.floor(progress * 10)) % 3) : 2;
      ctx.fillRect(Math.round(x), Math.round(y), size, size);
    }
  });
  ctx.restore();
}

function drawCenterText(text) {
  ctx.save();
  ctx.fillStyle = "#34d957";
  ctx.shadowColor = "#34d957";
  ctx.shadowBlur = 18;
  ctx.font = "bold 28px 'Press Start 2P', Courier New";
  ctx.textAlign = "center";
  ctx.fillText(text, W / 2, H / 2);
  ctx.restore();
}

function glow(color, blur) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function loop(time = 0) {
  const dt = Math.min(0.033, (time - lastTime) / 1000 || 0);
  lastTime = time;
  update(dt);
  renderFrame();
}

function renderFrame() {
  ctx.clearRect(0, 0, W, H);
  drawBackground();
  drawBullets();
  enemies.forEach(drawEnemy);
  drawPowerups();
  if (boss) drawBoss();
  drawCoverObjects();
  enemyBullets.forEach(drawEnemyBullet);
  drawPlayer();
  drawDolphinWave();
  drawParticles();
  drawVendrediSplash();
  drawNotices();
  if (state === "game" && levelTransition > 0) drawCenterText("LEVEL CLEARED");
  requestAnimationFrame(loop);
}

function normalizeSpriteTitle(value) {
  return String(value || "").trim().replace(/\s+/g, " " ).toUpperCase();
}

function openSpriteInfo(card) {
  const modal = document.getElementById("spriteInfoModal");
  if (!modal) return;
  const image = card.querySelector("img");
  const strong = card.querySelector("strong");
  const title = normalizeSpriteTitle(strong ? strong.textContent : card.textContent);
  const titleEl = document.getElementById("spriteInfoTitle");
  const textEl = document.getElementById("spriteInfoText");
  const imgEl = document.getElementById("spriteInfoImage");
  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = SPRITE_DETAILS[title] || "Sprite special du systeme Inbox Invaders. Priorite: observer, comprendre, puis tirer.";
  if (imgEl && image) {
    imgEl.src = image.getAttribute("src");
    imgEl.alt = title;
  }
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeSpriteInfo() {
  const modal = document.getElementById("spriteInfoModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

function bindInput() {
  window.addEventListener("keydown", event => {
    if (event.code === "Escape") closeSpriteInfo();
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "ShiftLeft", "ShiftRight", "KeyE"].includes(event.code)) event.preventDefault();
    initAudio();
    keys[event.code] = true;
    if (event.code === "KeyP") {
      if (state === "game") setState("pause");
      else if (state === "pause") setState("game");
    }
  });
  window.addEventListener("keyup", event => {
    keys[event.code] = false;
  });

  if (playerNameInput) {
    playerNameInput.addEventListener("input", () => {
      if (cleanPlayerName(playerNameInput.value)) clearPlayerNameError();
    });
  }

  document.addEventListener("click", event => {
    const spriteCard = event.target.closest("#howScreen .bonus-item, #howScreen .enemy-legend span");
    if (spriteCard) {
      openSpriteInfo(spriteCard);
      return;
    }
    if (event.target.closest("[data-action=\"closeSpriteInfo\"]") || event.target.id === "spriteInfoModal") {
      closeSpriteInfo();
      return;
    }
    const avatarButton = event.target.closest("[data-avatar-key]");
    if (avatarButton) {
      selectAvatar(avatarButton.dataset.avatarKey);
      return;
    }
    const control = event.target.closest("[data-action]");
    const action = control ? control.dataset.action : "";
    if (!action) return;
    if (action === "mute") {
      toggleSound();
      return;
    }
    initAudio();
    if (action === "start" || action === "restart") {
      if (!playerName) {
        setState("playerSetup");
      } else {
        resetGame();
      }
    }
    if (action === "savePlayer") {
      if (savePlayerFromInput()) resetGame();
    }
    if (action === "changePlayer") setState("playerSetup");
    if (action === "scores") {
      loadLeaderboard();
      setState("leaderboard");
    }
    if (action === "how") setState("how");
    if (action === "back") setState("start");
    if (action === "resume") setState("game");
    if (action === "pause" && state === "game") setState("pause");
  });

  const bindTouch = (id, prop) => {
    const button = document.getElementById(id);
    if (!button) return;
    const on = event => { event.preventDefault(); initAudio(); touch[prop] = true; };
    const off = event => { event.preventDefault(); touch[prop] = false; };
    button.addEventListener("pointerdown", on);
    button.addEventListener("pointerup", off);
    button.addEventListener("pointercancel", off);
    button.addEventListener("pointerleave", off);
  };
  bindTouch("touchLeft", "left");
  bindTouch("touchRight", "right");
  bindTouch("touchUp", "up");
  bindTouch("touchDown", "down");
  bindTouch("touchShoot", "shoot");
  bindTouch("touchReply", "reply");
  bindTouch("touchBlast", "blast");
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const nextW = Math.max(360, Math.floor(rect.width * ratio));
  const nextH = Math.max(520, Math.floor(rect.height * ratio));
  if (canvas.width === nextW && canvas.height === nextH) return;
  const oldW = W || nextW;
  const oldH = H || nextH;
  canvas.width = nextW;
  canvas.height = nextH;
  W = canvas.width;
  H = canvas.height;
  if (player) {
    player.x = clamp(player.x * (W / oldW), 26, W - 26);
    player.y = clamp(player.y * (H / oldH), playerMinY(), H - 38);
  }
  if (stars) {
    stars.forEach(star => {
      star.x = Math.random() * W;
      star.y = Math.random() * H;
    });
  }
  if (coverObjects) createCoverObjects();
}

bindInput();
window.addEventListener("resize", resizeCanvas);
loadPageImageAssets();
loadImageSprites();
resizeCanvas();
resetGame();
updatePlayerReadout();
setState(playerName ? "start" : "playerSetup");
requestAnimationFrame(loop);
