const socket = io();
const $ = id => document.getElementById(id);
let currentRoom = null;
let players = [];
let started = false;
let axis = {x:0,y:0};
const canvas = $("arena");
const ctx = canvas.getContext("2d");

function name(){return $("name").value.trim() || "Jogador"}
function showError(message){$("status").textContent = message || ""}
function enter(result){
  if(!result?.ok){showError(result?.error || "Não foi possível entrar.");return}
  currentRoom = result.room.code;
  $("lobby").hidden = false;
  $("roomInfo").hidden = false;
  $("codeLabel").textContent = currentRoom;
  $("gameCode").textContent = "SALA " + currentRoom;
  showRoom(result.room);
}
function showRoom(room){
  players = room.players;
  started = room.started;
  $("codeLabel").textContent = room.code;
  $("players").innerHTML = "";
  players.forEach(p=>{const li=document.createElement("li");li.textContent=p.name; $("players").appendChild(li)});
  if(started){$("lobby").hidden=true;$("game").hidden=false;draw()}
}
$("create").onclick=()=>socket.emit("room:create",name(),enter);
$("join").onclick=()=>socket.emit("room:join",{code:$("roomCode").value,name:name()},enter);
$("start").onclick=()=>socket.emit("game:start");
socket.on("room:update",showRoom);
socket.on("player:moved",p=>{const i=players.findIndex(x=>x.id===p.id);if(i>=0)players[i]=p;draw()});
socket.on("player:boosted",id=>{const p=players.find(x=>x.id===id);if(p)p.boostUntil=Date.now()+450});

function roundedRect(x,y,w,h,r){
  ctx.beginPath();
  ctx.roundRect(x,y,w,h,r);
}
function drawFloor(){
  ctx.fillStyle="#263b4d";ctx.fillRect(0,0,900,600);
  // Painéis metálicos do piso
  for(let y=0;y<600;y+=60)for(let x=0;x<900;x+=60){
    ctx.fillStyle=((x/60+y/60)%2===0)?"#2b4254":"#30495b";
    ctx.fillRect(x+2,y+2,56,56);
    ctx.strokeStyle="#40596a";ctx.lineWidth=1;ctx.strokeRect(x+2,y+2,56,56);
    ctx.fillStyle="#587080";ctx.beginPath();ctx.arc(x+8,y+8,1.8,0,Math.PI*2);ctx.fill();
  }
  // Corredores e salas com contornos de metal
  const walls=[[35,35,210,105],[655,35,210,105],[35,455,210,105],[655,455,210,105],[330,35,240,42],[330,523,240,42]];
  walls.forEach(([x,y,w,h])=>{
    ctx.fillStyle="#172b3b";roundedRect(x,y,w,h,12);ctx.fill();
    ctx.strokeStyle="#7891a0";ctx.lineWidth=5;ctx.stroke();
    ctx.strokeStyle="#3e5a6d";ctx.lineWidth=2;ctx.strokeRect(x+12,y+12,w-24,h-24);
  });
  // Caixas e máquinas como obstáculos visuais
  [[95,190],[760,205],[95,350],[760,355],[405,95],[405,440]].forEach(([x,y],i)=>{
    ctx.fillStyle="#172b3c";roundedRect(x,y,76,52,9);ctx.fill();
    ctx.strokeStyle="#6a8292";ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle=i%2?"#ffca68":"#78dff3";ctx.fillRect(x+12,y+12,12,5);
    ctx.fillStyle="#40596b";ctx.fillRect(x+31,y+12,32,27);
  });
  // Linhas luminosas no chão
  ctx.strokeStyle="#6bd8e655";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(270,300);ctx.lineTo(360,300);ctx.lineTo(360,160);ctx.stroke();
  ctx.beginPath();ctx.moveTo(540,300);ctx.lineTo(630,300);ctx.lineTo(630,420);ctx.stroke();
}
function drawCrewmate(p){
  const x=p.x,y=p.y;
  const boost=Date.now()<(p.boostUntil||0);
  // Sombra
  ctx.fillStyle="#07121c88";ctx.beginPath();ctx.ellipse(x+2,y+13,21,9,0,0,Math.PI*2);ctx.fill();
  if(boost){ctx.fillStyle="#ffe18a88";ctx.beginPath();ctx.ellipse(x-23,y,13,7,0,0,Math.PI*2);ctx.fill()}
  // Mochila
  ctx.fillStyle="#0005";roundedRect(x-19,y-12,13,29,7);ctx.fill();
  ctx.fillStyle=p.color;roundedRect(x-22,y-15,14,29,6);ctx.fill();
  // Corpo arredondado
  const grad=ctx.createLinearGradient(x-15,y-24,x+16,y+20);
  grad.addColorStop(0,"#ffffff55");grad.addColorStop(.28,p.color);grad.addColorStop(1,"#00000045");
  ctx.fillStyle=grad;roundedRect(x-15,y-24,32,46,14);ctx.fill();
  ctx.strokeStyle="#07152299";ctx.lineWidth=2;ctx.stroke();
  // Visor de vidro
  const visor=ctx.createLinearGradient(x-4,y-18,x+18,y-4);
  visor.addColorStop(0,"#efffff");visor.addColorStop(.35,"#9ceaff");visor.addColorStop(1,"#4386a8");
  ctx.fillStyle=visor;roundedRect(x-1,y-16,22,14,7);ctx.fill();
  ctx.strokeStyle="#17394f";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="#ffffffaa";ctx.beginPath();ctx.ellipse(x+5,y-12,4,2,0,0,Math.PI*2);ctx.fill();
  // Perninhas
  ctx.fillStyle=p.color;roundedRect(x-12,y+14,10,9,4);ctx.fill();roundedRect(x+2,y+14,10,9,4);ctx.fill();
  // Nome
  ctx.font="bold 13px system-ui";ctx.textAlign="center";
  ctx.lineWidth=3;ctx.strokeStyle="#101b28";ctx.strokeText(p.name,x,y-33);
  ctx.fillStyle="#fff";ctx.fillText(p.name,x,y-33);
}
function draw(){
  if(!ctx)return;
  ctx.clearRect(0,0,900,600);
  drawFloor();
  players.forEach(drawCrewmate);
}
function move(){if(!started)return;if(axis.x||axis.y)socket.emit("player:move",axis)}
setInterval(move,30);
$("boost").onclick=()=>socket.emit("player:boost");
const joy=$("joystick"),stick=$("stick");
function updateJoy(e){
 const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
 let dx=e.clientX-cx,dy=e.clientY-cy;const max=34,len=Math.hypot(dx,dy)||1;
 if(len>max){dx=dx/len*max;dy=dy/len*max}
 stick.style.transform=`translate(${dx}px,${dy}px)`;
 axis={x:dx/max,y:dy/max};
}
joy.addEventListener("pointerdown",e=>{joy.setPointerCapture(e.pointerId);updateJoy(e)});
joy.addEventListener("pointermove",e=>{if(e.buttons)updateJoy(e)});
function resetJoy(){axis={x:0,y:0};stick.style.transform="translate(0,0)"}
joy.addEventListener("pointerup",resetJoy);joy.addEventListener("pointercancel",resetJoy);
const keys={};
window.addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(e.key===" ")socket.emit("player:boost")});
window.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
setInterval(()=>{if(!started)return;let x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),y=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);if(x||y)socket.emit("player:move",{x,y})},30);
