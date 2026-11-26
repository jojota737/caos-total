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
function draw(){
  ctx.clearRect(0,0,900,600);
  ctx.strokeStyle="#263d2a";ctx.lineWidth=1;
  for(let x=0;x<900;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,600);ctx.stroke()}
  for(let y=0;y<600;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(900,y);ctx.stroke()}
  players.forEach(p=>{
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,17,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.font="14px system-ui";ctx.textAlign="center";ctx.fillText(p.name,p.x,p.y-26);
  });
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
