const express=require("express"),http=require("http"),crypto=require("crypto");
const {Server}=require("socket.io");
const app=express(),server=http.createServer(app),io=new Server(server);
const rooms=new Map(),COLORS=["#8bff65","#63d9ff","#ffcf5c","#ff6b9a","#b58cff"],W=900,H=600,TICK=50;
const obstacles=[{x:95,y:190,w:76,h:52},{x:760,y:205,w:76,h:52},{x:95,y:350,w:76,h:52},{x:760,y:355,w:76,h:52},{x:405,y:95,w:76,h:52},{x:405,y:440,w:76,h:52}];
app.use(express.static("public"));app.get("/health",(_,r)=>r.json({ok:true,game:"Caos Total"}));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rand=(a,b)=>a+Math.random()*(b-a),code=()=>crypto.randomBytes(2).toString("hex").toUpperCase();
function pub(p){return{id:p.id,name:p.name,color:p.color,x:p.x,y:p.y,hp:p.hp,score:p.score,kos:p.kos,alive:p.alive,boostUntil:p.boostUntil,invulnerableUntil:p.invulnerableUntil}}
function snap(r){return{code:r.code,started:r.started,players:[...r.players.values()].map(pub),round:r.round,phase:r.phase,endsAt:r.endsAt,feed:r.feed.slice(-4)}}
function broadcast(r){io.to(r.code).emit("room:update",snap(r))}
function say(r,text){r.feed.push({id:crypto.randomUUID(),text,at:Date.now()});r.feed=r.feed.slice(-8);io.to(r.code).emit("game:feed",r.feed.slice(-4))}
function blocked(x,y,rad=15){return obstacles.some(o=>x+rad>o.x&&x-rad<o.x+o.w&&y+rad>o.y&&y-rad<o.y+o.h)}
function leave(s){const c=s.data.roomCode;if(!c)return;s.data.roomCode=null;const r=rooms.get(c);if(!r)return;r.players.delete(s.id);if(!r.players.size){clearInterval(r.timer);rooms.delete(c)}else{if(r.started&&r.players.size<2)end(r,null,"Partida encerrada: faltam jogadores.");broadcast(r)}}
function end(r,w,msg){if(!r.started)return;r.started=false;r.phase="results";r.endsAt=0;if(w){w.score++;say(r,w.name+" venceu a rodada!")}if(msg)say(r,msg);io.to(r.code).emit("game:over",{winner:w?w.name:null,players:[...r.players.values()].map(pub)});broadcast(r)}
function start(r){r.started=true;r.phase="playing";r.round++;r.bullets=[];r.endsAt=Date.now()+120000;const spots=[[300,250],[600,250],[300,370],[600,370],[450,300]];[...r.players.values()].forEach((p,i)=>{p.x=spots[i][0];p.y=spots[i][1];p.hp=100;p.alive=true;p.input={x:0,y:0};p.boostUntil=0;p.invulnerableUntil=Date.now()+1800;p.lastShot=0;p.lastBoost=0});say(r,"Rodada "+r.round+" começou! Último sobrevivente vence.");broadcast(r)}
function tick(r){if(!r.started)return;const now=Date.now(),dt=TICK/1000;
 for(const p of r.players.values()){if(!p.alive)continue;const len=Math.hypot(p.input.x,p.input.y)||1,speed=now<p.boostUntil?390:205,nx=clamp(p.x+p.input.x/len*speed*dt,22,W-22),ny=clamp(p.y+p.input.y/len*speed*dt,22,H-22);if(!blocked(nx,p.y))p.x=nx;if(!blocked(p.x,ny))p.y=ny}
 for(let i=r.bullets.length-1;i>=0;i--){const b=r.bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.life<=0||b.x<0||b.x>W||b.y<0||b.y>H||blocked(b.x,b.y,4)){r.bullets.splice(i,1);continue}for(const p of r.players.values()){if(p.id===b.owner||!p.alive||now<p.invulnerableUntil)continue;if(Math.hypot(p.x-b.x,p.y-b.y)<19){p.hp-=b.damage;r.bullets.splice(i,1);if(p.hp<=0){p.hp=0;p.alive=false;const a=r.players.get(b.owner);if(a){a.kos++;a.score++;say(r,a.name+" derrubou "+p.name+"!")}else say(r,p.name+" foi eliminado!")}break}}}
 if(now>=r.endsAt){const alive=[...r.players.values()].filter(p=>p.alive);alive.sort((a,b)=>a.hp-b.hp);end(r,alive.pop()||null,"Tempo esgotado!")}else{const alive=[...r.players.values()].filter(p=>p.alive);if(alive.length<=1)end(r,alive[0]||null,alive.length?"Todos os outros foram eliminados.":"Ninguém sobreviveu.")}
 if(r.started)io.to(r.code).emit("game:state",{players:[...r.players.values()].map(pub),bullets:r.bullets,endsAt:r.endsAt})
}
io.on("connection",s=>{
 s.on("room:create",(name,done)=>{leave(s);let c;do{c=code()}while(rooms.has(c));const r={code:c,started:false,phase:"lobby",round:0,endsAt:0,players:new Map(),bullets:[],feed:[]};r.timer=setInterval(()=>tick(r),TICK);rooms.set(c,r);join(s,r,name,done)});
 s.on("room:join",({code:c,name}={},done)=>{const r=rooms.get(String(c||"").toUpperCase());if(!r)return done?.({error:"Sala não encontrada."});if(r.players.size>=5)return done?.({error:"Sala cheia (máximo 5 jogadores)."});if(r.started)return done?.({error:"A partida já começou."});leave(s);join(s,r,name,done)});
 function join(sock,r,name,done){const spots=[[300,250],[600,250],[300,370],[600,370],[450,300]],i=r.players.size,p={id:sock.id,name:String(name||"Jogador").trim().slice(0,16)||"Jogador",color:COLORS[i%5],x:spots[i][0]+rand(-20,20),y:spots[i][1]+rand(-20,20),hp:100,score:0,kos:0,alive:true,input:{x:0,y:0},boostUntil:0,invulnerableUntil:0,lastShot:0,lastBoost:0};r.players.set(sock.id,p);sock.join(r.code);sock.data.roomCode=r.code;done?.({ok:true,room:snap(r)});broadcast(r)}
 s.on("player:input",({x=0,y=0}={})=>{const p=rooms.get(s.data.roomCode)?.players.get(s.id);if(p&&p.alive)p.input={x:clamp(Number(x)||0,-1,1),y:clamp(Number(y)||0,-1,1)}});
 s.on("player:move",({x=0,y=0}={})=>{const p=rooms.get(s.data.roomCode)?.players.get(s.id);if(p&&p.alive)p.input={x:clamp(Number(x)||0,-1,1),y:clamp(Number(y)||0,-1,1)}});
 s.on("player:boost",()=>{const r=rooms.get(s.data.roomCode),p=r?.players.get(s.id),n=Date.now();if(!r?.started||!p?.alive||n-p.lastBoost<3500)return;p.lastBoost=n;p.boostUntil=n+550;io.to(r.code).emit("player:boosted",p.id)});
 s.on("player:shoot",({x=0,y=0}={})=>{const r=rooms.get(s.data.roomCode),p=r?.players.get(s.id),n=Date.now(),len=Math.hypot(x,y);if(!r?.started||!p?.alive||n-p.lastShot<450||len<.1)return;p.lastShot=n;x/=len;y/=len;r.bullets.push({id:crypto.randomUUID(),owner:p.id,x:p.x+x*23,y:p.y+y*23,vx:x*510,vy:y*510,life:1.25,damage:25})});
 s.on("game:start",()=>{const r=rooms.get(s.data.roomCode);if(r&&r.players.size>=2&&!r.started)start(r)});
 s.on("game:again",()=>{const r=rooms.get(s.data.roomCode);if(r&&!r.started&&r.players.size>=2)start(r)});
 s.on("disconnect",()=>leave(s))
});
server.listen(process.env.PORT||3000,()=>console.log("Caos Total na porta "+(process.env.PORT||3000)));
