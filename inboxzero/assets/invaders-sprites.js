/* ============================================================
   iNbox Invaders — sprite engine (pure, no layout)
   exposes window.II
   ============================================================ */
(function(){
const SCALE = 11, SCLERA = '#f7fdff', PUPIL = '#0a0f1c';

function Pix(ctx, s){
  s = s || SCALE;
  return {
    set(x,y,c){ if(!c) return; ctx.fillStyle=c; ctx.fillRect(x*s,y*s,s,s); },
    clr(x,y){ ctx.clearRect(x*s,y*s,s,s); },
    rect(x,y,w,h,c){ ctx.fillStyle=c; ctx.fillRect(x*s,y*s,w*s,h*s); },
    frame(x,y,w,h,c){ this.rect(x,y,w,1,c); this.rect(x,y+h-1,w,1,c); this.rect(x,y,1,h,c); this.rect(x+w-1,y,1,h,c); },
    h(x,y,w,c){ this.rect(x,y,w,1,c); },
    v(x,y,h,c){ this.rect(x,y,1,h,c); },
  };
}
function eyes(P,spots,f){ spots.forEach(([x,y])=>{ P.rect(x,y,2,2,SCLERA); P.set(x+(f?1:0),y+1,PUPIL); }); }
function antennae(P,xs,topY,bodyY,c,lite){ xs.forEach(x=>{ P.v(x,topY+1,bodyY-topY-1,c); P.set(x,topY,lite); }); }
function legs(P,y,cols,f,c){
  cols.forEach((cx,i)=>{
    const a=(i+f)&1, out=(i&1)?1:-1;
    P.set(cx,y,c); P.set(cx,y+1,c);
    if(a){ P.set(cx,y+2,c); P.set(cx+out,y+2,c); }
    else { P.set(cx+out,y+1,c); P.set(cx+out,y+2,c); }
  });
}
function rc(P,x,y,w,h,r){
  for(let i=0;i<r;i++)for(let j=0;j<(r-i);j++){
    P.clr(x+j,y+i); P.clr(x+w-1-j,y+i); P.clr(x+j,y+h-1-i); P.clr(x+w-1-j,y+h-1-i);
  }
}
function blob(P,x,y,w,h,base,dark,r){
  P.rect(x,y,w,h,dark); rc(P,x,y,w,h,r);
  P.rect(x+1,y+1,w-2,h-2,base); rc(P,x+1,y+1,w-2,h-2,Math.max(1,r-1));
}

/* ---------------- ENEMIES (18 x 18) ---------------- */
function dEmail(P,f,C){
  antennae(P,[5,12],1,4,C.base,C.lite);
  P.frame(2,4,14,9,C.dark); P.rect(3,5,12,7,C.base);
  for(let i=0;i<6;i++){ P.set(3+i,5+i,C.dark); P.set(14-i,5+i,C.dark); }
  P.set(9,10,C.dark); eyes(P,[[4,9],[12,9]],f); legs(P,13,[4,8,11,14],f,C.base);
}
function dMeeting(P,f,C){
  antennae(P,[4,13],0,3,C.base,C.lite);
  P.frame(2,2,14,11,C.dark); P.rect(3,3,12,9,C.base); P.rect(4,4,10,7,'#0a0c16');
  [[5,5],[10,5],[5,8],[10,8]].forEach(([x,y],i)=>{ P.rect(x,y,3,2,C.lite); P.set(x,y,(i+f)&1?C.lite:SCLERA); P.set(x+2,y,SCLERA); });
  legs(P,13,[4,8,11,14],f,C.base);
}
function dCall(P,f,C){
  P.rect(4,4,10,2,C.base); P.rect(3,4,4,6,C.base); P.rect(11,4,4,6,C.base);
  P.clr(3,9); P.clr(14,9); P.rect(4,7,2,2,C.dark); P.rect(12,7,2,2,C.dark);
  P.h(5,4,8,C.lite); eyes(P,[[6,5],[10,5]],f);
  if(f){ P.set(1,3,C.lite); P.set(0,2,C.lite); P.set(2,4,C.base); }
  else { P.set(16,3,C.lite); P.set(17,2,C.lite); P.set(15,4,C.base); }
  P.set(f?1:16,5,C.base); legs(P,10,[4,13],f,C.base);
}
function dPpt(P,f,C){
  antennae(P,[4,13],0,3,C.base,C.lite);
  P.frame(2,2,14,9,C.dark); P.rect(3,3,12,7,C.base); P.rect(4,4,10,5,'#0a0c16');
  [[5,7,2],[8,6,3],[11,4,5]].forEach(([x,y,h],i)=> P.rect(x,y-((i+f)&1?1:0),2,h+((i+f)&1?1:0),C.lite));
  P.set(13,4,'#ffd23d'); P.set(12,5,'#ffd23d'); P.rect(8,11,2,2,C.dark); P.rect(6,13,6,1,C.base);
  legs(P,14,[6,11],f,C.base);
}
function dWord(P,f,C){
  P.frame(3,1,11,14,C.dark); P.rect(4,2,9,12,C.base);
  P.set(12,2,C.dark); P.set(13,2,C.dark); P.set(13,3,C.dark); P.set(12,2,C.lite);
  P.rect(5,3,7,2,C.lite); P.set(6,3,C.dark); P.set(7,3,C.dark); P.set(9,3,C.dark); P.set(10,3,C.dark);
  [7,9,11].forEach(y=>P.h(5,y,7,C.lite)); P.h(5,13,4,C.lite);
  eyes(P,[[5,6],[10,6]],f); legs(P,15,[5,8,11],f,C.base);
}
function dExcel(P,f,C){
  P.frame(3,1,11,14,C.dark); P.rect(4,2,9,12,C.base);
  [5,8,11].forEach(x=>P.v(x,3,10,C.dark)); [5,8,11].forEach(y=>P.h(4,y,9,C.dark));
  P.rect(9,9,2,2,C.lite); P.rect(6,12,2,2,'#ffd23d');
  eyes(P,[[5,4],[10,4]],f); legs(P,15,[5,8,11],f,C.base);
}
function dChat(P,f,C){
  P.frame(2,2,14,9,C.dark); P.rect(3,3,12,7,C.base);
  P.rect(5,10,3,2,C.base); P.set(5,12,C.base); P.frame(5,10,3,2,C.dark);
  eyes(P,[[5,4],[10,4]],f);
  P.rect(4,7,8,1,'#0a0c16'); [4,7,10].forEach((x,i)=> P.set(x,7,(i===f%3)?C.lite:'#0a0c16'));
  P.rect(13,1,4,4,'#ff2e2e'); P.frame(13,1,4,4,'#8c0000'); P.set(14,2,SCLERA);
  legs(P,12,[4,8,11,14],f,C.base);
}
function dJira(P,f,C){
  antennae(P,[5,12],0,3,C.base,C.lite);
  P.frame(3,2,12,11,C.dark); P.rect(4,3,10,9,C.base); P.rect(5,4,6,1,'#ffd23d');
  P.frame(5,6,2,2,C.dark); if(f){ P.set(5,7,C.lite); P.set(6,6,C.lite); }
  P.h(8,6,4,C.lite); P.h(8,7,3,C.lite); P.rect(11,9,2,2,C.lite);
  eyes(P,[[5,9],[8,9]],f); legs(P,13,[5,9,12],f,C.base);
}
function dUrgent(P,f,C){
  P.rect(7,0,4,2, f?C.lite:'#fff'); P.set(6,1,C.base); P.set(11,1,C.base);
  P.frame(3,3,12,10,C.dark); P.rect(4,4,10,8,C.base);
  P.set(5,5,C.dark); P.set(6,6,C.dark); P.set(12,5,C.dark); P.set(11,6,C.dark);
  eyes(P,[[5,6],[10,6]],f); P.rect(8,8,2,2,'#fff'); P.rect(8,10,2,1,'#fff');
  legs(P,13,[3,6,9,12,15],f,C.base);
}
function dPopup(P,f,C){
  P.frame(2,3,14,10,C.dark); P.rect(3,4,12,8,C.base); P.rect(3,4,12,2,C.dark);
  P.set(4,4,C.lite); P.set(13,4,'#ff2e2e'); P.set(14,5,'#ff2e2e'); P.set(13,5,'#ff2e2e'); P.set(14,4,'#ff2e2e');
  P.set(7,7,C.dark); P.set(8,7,C.dark); P.set(9,7,C.dark); P.set(10,8,C.dark);
  P.set(9,9,C.dark); P.set(8,9,C.dark); P.set(8,10,C.dark); P.set(8,12,C.dark);
  eyes(P,[[5,4],[9,4]],f); legs(P,13,[4,8,11,14],f,C.base);
}

/* ---------------- BOSSES (30 x 22) ---------------- */
function bDeadline(P,f,C){
  P.rect(6,1,5,4,C.base); rc(P,6,1,5,4,1); P.rect(19,1,5,4,C.base); rc(P,19,1,5,4,1);
  P.rect(13,2,4,2,C.dark); P.rect(14,0,2,2,C.lite); P.rect(f?7:20,2,2,2,C.lite);
  blob(P,4,4,22,15,C.base,C.dark,3); blob(P,8,6,14,11,'#180608','#4a0c0c',2);
  P.rect(10,8,3,3,'#000'); P.rect(17,8,3,3,'#000');
  P.set(11,9, f?'#ffec6e':C.base); P.set(18,9, f?'#ffec6e':C.base);
  P.set(10,7,C.dark); P.set(12,7,C.dark); P.set(17,7,C.dark); P.set(19,7,C.dark);
  P.rect(14,11,2,1,C.lite); P.rect(14,9,1,2,C.lite); P.set(16,11,C.lite); P.set(17,12,C.lite);
  P.rect(9,14,12,1,'#4a0c0c'); for(let i=0;i<6;i++) P.rect(9+i*2,14,1,2,'#f7fdff');
  legs(P,19,[6,11,15,19,23],f,C.base);
}
function bReplyAll(P,f,C){
  const M='#ff3d9a';
  [[6,2],[13,0],[21,3]].forEach(([hx,hy],i)=>{
    const wig=((i+f)&1)?1:0; P.v(hx+2,hy+4,6,C.dark);
    P.rect(hx,hy+wig,5,4,C.base); P.frame(hx,hy+wig,5,4,C.dark);
    P.set(hx+1,hy+1+wig,C.dark); P.set(hx+3,hy+1+wig,C.dark); P.set(hx+2,hy+2+wig,C.dark);
    P.set(hx+1,hy+2+wig,M); P.set(hx+3,hy+2+wig,M);
  });
  blob(P,3,8,24,12,C.base,C.dark,2);
  for(let i=0;i<10;i++){ P.set(4+i,9+i,C.dark); P.set(25-i,9+i,C.dark); }
  [[6,14],[11,14],[16,14],[21,14]].forEach(([x,y])=>{ P.rect(x,y,2,2,SCLERA); P.set(x+(f?1:0),y+1,M); });
  legs(P,20,[5,9,13,17,21,24],f,C.base);
}
function bRecurring(P,f,C){
  P.rect(8,0,2,4,C.lite); P.rect(20,0,2,4,C.lite); blob(P,4,3,22,16,C.base,C.dark,2);
  P.rect(6,5,18,3,C.dark);
  P.set(11,5,C.lite); P.set(10,6,C.lite); P.set(11,7,C.lite); P.h(11,6,8,C.lite);
  P.set(19,5,C.lite); P.set(20,6,C.lite); P.set(19,7,C.lite); P.set(14,4,C.lite); P.set(16,8,C.lite);
  [[7,10],[13,10],[19,10],[7,14],[13,14],[19,14]].forEach(([x,y],i)=>{
    P.rect(x,y,4,3,C.lite); P.set(x+1,y+1,(i+f)&1?PUPIL:C.base); P.set(x+2,y+1,PUPIL);
  });
  legs(P,19,[6,11,15,19,23],f,C.base);
}

/* ---------------- FOCUS SHIP (18 x 16) ---------------- */
function dShip(P,f,S){
  // nose
  P.rect(8,0,2,3,S.lite);
  // upper fuselage
  P.rect(7,3,4,3,S.hull); P.set(7,3,S.edge); P.set(10,3,S.edge);
  // twin cannons (the guns)
  P.rect(4,2,1,5,S.lite); P.rect(13,2,1,5,S.lite);
  P.set(4,1, f?S.glass:S.lite); P.set(13,1, f?S.lite:S.glass);
  // wings
  P.rect(2,7,14,3,S.hull); P.set(1,8,S.hull); P.set(16,8,S.hull);
  P.v(2,7,3,S.edge); P.v(15,7,3,S.edge);
  P.set(1,8,S.edge); P.set(16,8,S.edge);
  // cockpit / focus lens
  P.rect(6,5,6,4,S.edge); P.rect(7,6,4,3,S.glass); P.set(8,7, f?S.lite:S.glass); P.set(9,7,S.lite);
  // lower fuselage taper
  P.rect(6,10,6,2,S.hull); P.rect(7,12,4,1,S.edge);
  // side thruster glints
  P.set(3,10,S.glass); P.set(14,10,S.glass);
  // engine flame
  P.rect(7,13,4,1, S.flame1); P.rect(7,13,4,2, f?S.flame1:S.flame2);
  P.rect(8,15,2, f?1:2, S.flame1); P.set(8,16,f?S.flame2:null);
}

/* ---------------- EXPLOSION (12 x 12, stage 0..2) ---------------- */
function dBoom(P,stage){
  const c='#ffffff', y='#ffd23d', o='#ff7a1a';
  if(stage===0){ P.rect(5,5,2,2,c); P.set(4,4,y); P.set(7,4,y); P.set(4,7,y); P.set(7,7,y); }
  else if(stage===1){
    P.rect(5,5,2,2,c); P.set(3,3,y); P.set(8,3,y); P.set(3,8,y); P.set(8,8,y);
    P.set(5,2,o); P.set(6,2,o); P.set(2,5,o); P.set(2,6,o); P.set(9,5,o); P.set(9,6,o); P.set(5,9,o); P.set(6,9,o);
  } else {
    P.set(2,2,o); P.set(9,2,o); P.set(2,9,o); P.set(9,9,o);
    P.set(5,0,y); P.set(6,0,y); P.set(0,5,y); P.set(0,6,y); P.set(11,5,y); P.set(11,6,y); P.set(5,11,y); P.set(6,11,y);
    P.set(5,5,c); P.set(6,6,c);
  }
}

/* ---------------- palettes & data ---------------- */
const PAL = {
  email:{base:'#16d6d6',lite:'#9bffff',dark:'#0a5f6b'}, meeting:{base:'#a64bff',lite:'#e0b3ff',dark:'#54208a'},
  call:{base:'#ffce2e',lite:'#fff3b0',dark:'#9c6f00'}, ppt:{base:'#ff7a1a',lite:'#ffc080',dark:'#a33d00'},
  word:{base:'#3d7bff',lite:'#b9d0ff',dark:'#163a8c'}, excel:{base:'#2bd14f',lite:'#b3ffc4',dark:'#0a6e22'},
  chat:{base:'#ff3d9a',lite:'#ffb3d9',dark:'#99004d'}, jira:{base:'#19b8e6',lite:'#b3ecff',dark:'#0a5a78'},
  urgent:{base:'#ff3535',lite:'#ffb3b3',dark:'#8c0000'}, popup:{base:'#b6e021',lite:'#e6ff99',dark:'#5c7a00'},
};
const BPAL = {
  replyall:{base:'#16d6d6',lite:'#9bffff',dark:'#0a5f6b'},
  recurring:{base:'#a64bff',lite:'#e0b3ff',dark:'#54208a'},
  deadline:{base:'#ff3535',lite:'#ffd0d0',dark:'#8c0000'},
};
const SHIP = {hull:'#dff4ff',lite:'#ffffff',edge:'#1c7f9c',glass:'#19e3e3',glow:'#19e3e3',flame1:'#ffd23d',flame2:'#ff7a1a'};

const SPRITES = [
  {key:'email',label:'EMAIL',draw:dEmail}, {key:'meeting',label:'R\u00C9UNION',draw:dMeeting},
  {key:'call',label:'APPEL',draw:dCall}, {key:'ppt',label:'SLIDE PPT',draw:dPpt},
  {key:'word',label:'DOC WORD',draw:dWord}, {key:'excel',label:'FICHIER EXCEL',draw:dExcel},
  {key:'chat',label:'PING CHAT',draw:dChat}, {key:'jira',label:'TICKET JIRA',draw:dJira},
  {key:'urgent',label:'URGENT !!',draw:dUrgent}, {key:'popup',label:'\u00AB T\u2019AS 2 MIN ? \u00BB',draw:dPopup},
];
const BOSSES = [
  {key:'replyall',label:'REPLY-ALL HYDRA',sub:'crache une t\u00EAte \u00E0 chaque \u00AB merci \u00E0 tous ! \u00BB',hp:78,draw:bReplyAll},
  {key:'recurring',label:'LA R\u00C9UNION R\u00C9CURRENTE',sub:'refuser ne sert \u00E0 rien. elle revient chaque semaine.',hp:90,draw:bRecurring},
  {key:'deadline',label:'LA DEADLINE',sub:'BOSS FINAL \u00B7 avance toujours \u00B7 ne peut pas \u00EAtre report\u00E9e',hp:100,draw:bDeadline},
];
SPRITES.forEach(s=>{ s.pal = PAL[s.key]; });
BOSSES.forEach(b=>{ b.pal = BPAL[b.key]; });

/* ---------------- baking / blit for live scenes ---------------- */
const cache = {};
function bake(id, drawFn, pal, w, h, scale, frame){
  const k = id+'|'+scale+'|'+frame;
  if(cache[k]) return cache[k];
  const c = document.createElement('canvas'); c.width=w*scale; c.height=h*scale;
  drawFn(Pix(c.getContext('2d'),scale), frame, pal);
  cache[k]=c; return c;
}
function blit(ctx, baked, px, py, glow, blur){
  ctx.save();
  if(glow){ ctx.shadowColor=glow; ctx.shadowBlur=blur||10; }
  ctx.drawImage(baked, Math.round(px), Math.round(py));
  ctx.restore();
}

/* ---------------- static marching registry ---------------- */
const reg = [];
function register(ctx, drawFn, pal, w, h, scale){ reg.push({ctx,drawFn,pal,w,h,scale}); }
let gframe = 0;
function tick(){ gframe^=1; reg.forEach(r=>{ r.ctx.clearRect(0,0,r.w*r.scale,r.h*r.scale); r.drawFn(Pix(r.ctx,r.scale), gframe, r.pal); }); }
setInterval(tick, 560);

function downloadPng(draw,pal,w,h,name){
  const target=560, sc=Math.floor(target/Math.max(w,h));
  const c=document.createElement('canvas'); c.width=w*sc; c.height=h*sc;
  draw(Pix(c.getContext('2d'),sc),0,pal);
  c.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='inbox-'+name+'.png'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); });
}

window.II = {
  Pix, SCALE, GRID:18, BW:30, BH:22,
  PAL, BPAL, SHIP, SPRITES, BOSSES,
  dShip, dBoom,
  bake, blit, register, downloadPng,
  get frame(){ return gframe; },
};
})();
