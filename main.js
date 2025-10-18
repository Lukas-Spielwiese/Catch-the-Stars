// Canvas & HiDPI
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const scoreEl = document.getElementById('score');
const timeEl  = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');

(function scaleForHiDPI(){
  const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
  const cssW = canvas.getAttribute('width')|0;
  const cssH = canvas.getAttribute('height')|0;
  canvas.width  = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
})();

let running=false, basket, stars, score, timeLeft, lastTime, spawnCooldown;
function createBasket(){
  return { w:90, h:20,
    x:(canvas.width/(window.devicePixelRatio||1))/2-45,
    y:(canvas.height/(window.devicePixelRatio||1))-30,
    speed:9 };
}
function createStar(){
  const r=10+Math.random()*6;
  const cw=canvas.width/(window.devicePixelRatio||1);
  return { x:r+Math.random()*(cw-2*r), y:-r, r, vy:2+Math.random()*3, hue:Math.floor(Math.random()*360) };
}

// Input
let moveLeft=false, moveRight=false;
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') moveLeft=true;
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') moveRight=true;
});
document.addEventListener('keyup',e=>{
  if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A') moveLeft=false;
  if(e.key==='ArrowRight'||e.key==='d'||e.key==='D') moveRight=false;
});
function pointerMove(ev){
  const rect=canvas.getBoundingClientRect();
  const x=(ev.touches?ev.touches[0].clientX:ev.clientX)-rect.left;
  basket.x=Math.max(0,Math.min(x-basket.w/2,rect.width-basket.w));
}
canvas.addEventListener('mousemove',pointerMove,{passive:true});
canvas.addEventListener('touchstart',pointerMove,{passive:true});
canvas.addEventListener('touchmove',pointerMove,{passive:true});

function resetGame(){
  basket=createBasket(); stars=[]; score=0; timeLeft=30.0; spawnCooldown=0;
  lastTime=performance.now(); running=true; overlay.classList.remove('show'); updateHUD();
}
function updateHUD(){ scoreEl.textContent=`Punkte: ${score}`; timeEl.textContent=`Zeit: ${timeLeft.toFixed(1)} s`; }

function update(dt){
  if(moveLeft) basket.x-=basket.speed;
  if(moveRight) basket.x+=basket.speed;
  const cw=canvas.width/(window.devicePixelRatio||1);
  if(basket.x<0)basket.x=0; if(basket.x+basket.w>cw) basket.x=cw-basket.w;

  spawnCooldown-=dt;
  if(spawnCooldown<=0){
    stars.push(createStar());
    const next=700-(300*(1-Math.max(0,Math.min(1,timeLeft/30))));
    spawnCooldown=Math.max(250,next);
  }
  for(let i=stars.length-1;i>=0;i--){
    const s=stars[i];
    s.y+=s.vy*(dt/16.6667);
    const top=basket.y,left=basket.x,right=basket.x+basket.w;
    if(s.y+s.r>=top && s.x>=left && s.x<=right){ stars.splice(i,1); score++; updateHUD(); continue; }
    const ch=canvas.height/(window.devicePixelRatio||1);
    if(s.y-s.r>ch) stars.splice(i,1);
  }
  timeLeft-=dt/1000;
  if(timeLeft<=0){ timeLeft=0; running=false; overlay.textContent=`Spiel vorbei! Gefangene Sterne: ${score}`; overlay.classList.add('show'); }
  updateHUD();
}
function draw(){
  const cw=canvas.width/(window.devicePixelRatio||1);
  const ch=canvas.height/(window.devicePixelRatio||1);
  ctx.clearRect(0,0,cw,ch);
  ctx.save(); ctx.globalAlpha=.05;
  for(let x=0;x<cw;x+=25){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,ch); ctx.stroke(); }
  for(let y=0;y<ch;y+=25){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(cw,y); ctx.stroke(); }
  ctx.restore();
  for(const s of stars){ ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`hsl(${s.hue} 70% 50%)`; ctx.fill(); }
  ctx.fillStyle='#0d6efd'; ctx.fillRect(basket.x,basket.y,basket.w,basket.h);
  ctx.fillStyle='#084298'; ctx.fillRect(basket.x,basket.y, basket.w, 4);
}
function loop(now){
  const dt=Math.min(50, now-lastTime); lastTime=now;
  if(running) update(dt);
  draw();
  requestAnimationFrame(loop);
}
function startGame(){
  resetGame();
  requestAnimationFrame(ts=>{ lastTime=ts; requestAnimationFrame(loop); });
}
restartBtn.addEventListener('click', startGame);
startGame(); // auto-start
