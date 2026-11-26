// Caos Total pixel-art game renderer
(() => {
 const sprite=new Image();
 const svg="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"192\" height=\"64\" viewBox=\"0 0 192 64\" shape-rendering=\"crispEdges\">\n<g transform=\"translate(0 0)\">\n<ellipse cx=\"32\" cy=\"59\" rx=\"19\" ry=\"4\" fill=\"#080611\"/>\n<rect x=\"20\" y=\"40\" width=\"10\" height=\"16\" fill=\"#171327\"/><rect x=\"35\" y=\"40\" width=\"10\" height=\"16\" fill=\"#171327\"/>\n<rect x=\"17\" y=\"52\" width=\"15\" height=\"7\" fill=\"#090914\"/><rect x=\"33\" y=\"52\" width=\"15\" height=\"7\" fill=\"#090914\"/>\n<rect x=\"17\" y=\"29\" width=\"30\" height=\"20\" fill=\"#10101c\"/><rect x=\"20\" y=\"27\" width=\"24\" height=\"21\" fill=\"#8bff55\"/>\n<rect x=\"22\" y=\"29\" width=\"5\" height=\"16\" fill=\"#d7ffad\"/><rect x=\"38\" y=\"29\" width=\"4\" height=\"16\" fill=\"#367c37\"/>\n<rect x=\"25\" y=\"19\" width=\"14\" height=\"10\" fill=\"#eab28d\"/>\n<rect x=\"19\" y=\"5\" width=\"27\" height=\"23\" fill=\"#f2c49e\"/><rect x=\"17\" y=\"7\" width=\"31\" height=\"10\" fill=\"#30204b\"/>\n<rect x=\"17\" y=\"10\" width=\"5\" height=\"15\" fill=\"#30204b\"/><rect x=\"43\" y=\"9\" width=\"5\" height=\"14\" fill=\"#30204b\"/>\n<rect x=\"21\" y=\"2\" width=\"22\" height=\"7\" fill=\"#30204b\"/><rect x=\"24\" y=\"16\" width=\"5\" height=\"4\" fill=\"#171327\"/><rect x=\"36\" y=\"16\" width=\"5\" height=\"4\" fill=\"#171327\"/>\n<rect x=\"25\" y=\"17\" width=\"3\" height=\"2\" fill=\"#8bff55\"/><rect x=\"37\" y=\"17\" width=\"3\" height=\"2\" fill=\"#8bff55\"/>\n<rect x=\"29\" y=\"23\" width=\"7\" height=\"2\" fill=\"#a65e5c\"/>\n<rect x=\"17\" y=\"26\" width=\"5\" height=\"18\" fill=\"#30204b\"/><rect x=\"43\" y=\"26\" width=\"5\" height=\"18\" fill=\"#30204b\"/>\n<rect x=\"23\" y=\"35\" width=\"18\" height=\"3\" fill=\"#17243c\"/><rect x=\"24\" y=\"35\" width=\"6\" height=\"2\" fill=\"#76f2ff\"/><rect x=\"34\" y=\"35\" width=\"6\" height=\"2\" fill=\"#76f2ff\"/>\n</g>\n<g transform=\"translate(64 0)\">\n<ellipse cx=\"32\" cy=\"59\" rx=\"19\" ry=\"4\" fill=\"#080611\"/><rect x=\"20\" y=\"40\" width=\"10\" height=\"16\" fill=\"#171327\"/><rect x=\"35\" y=\"40\" width=\"10\" height=\"16\" fill=\"#171327\"/><rect x=\"17\" y=\"52\" width=\"15\" height=\"7\" fill=\"#090914\"/><rect x=\"33\" y=\"52\" width=\"15\" height=\"7\" fill=\"#090914\"/>\n<rect x=\"17\" y=\"29\" width=\"30\" height=\"20\" fill=\"#10101c\"/><rect x=\"20\" y=\"27\" width=\"24\" height=\"21\" fill=\"#56328c\"/><rect x=\"22\" y=\"29\" width=\"5\" height=\"16\" fill=\"#b68bdf\"/><rect x=\"38\" y=\"29\" width=\"4\" height=\"16\" fill=\"#281643\"/>\n<rect x=\"25\" y=\"19\" width=\"14\" height=\"10\" fill=\"#eab28d\"/><rect x=\"19\" y=\"5\" width=\"27\" height=\"23\" fill=\"#f2c49e\"/><rect x=\"17\" y=\"7\" width=\"31\" height=\"10\" fill=\"#b96cff\"/><rect x=\"17\" y=\"10\" width=\"5\" height=\"15\" fill=\"#b96cff\"/><rect x=\"43\" y=\"9\" width=\"5\" height=\"14\" fill=\"#b96cff\"/><rect x=\"21\" y=\"2\" width=\"22\" height=\"7\" fill=\"#b96cff\"/><rect x=\"24\" y=\"16\" width=\"5\" height=\"4\" fill=\"#171327\"/><rect x=\"36\" y=\"16\" width=\"5\" height=\"4\" fill=\"#171327\"/><rect x=\"25\" y=\"17\" width=\"3\" height=\"2\" fill=\"#8bff55\"/><rect x=\"37\" y=\"17\" width=\"3\" height=\"2\" fill=\"#8bff55\"/><rect x=\"29\" y=\"23\" width=\"7\" height=\"2\" fill=\"#a65e5c\"/>\n<path d=\"M18 9L11 1L24 4M44 9L53 1L41 4\" fill=\"#b96cff\" stroke=\"#160d28\" stroke-width=\"3\"/>\n</g>\n<g transform=\"translate(128 0)\">\n<ellipse cx=\"32\" cy=\"59\" rx=\"19\" ry=\"4\" fill=\"#080611\"/><rect x=\"20\" y=\"40\" width=\"10\" height=\"16\" fill=\"#171327\"/><rect x=\"35\" y=\"40\" width=\"10\" height=\"16\" fill=\"#171327\"/><rect x=\"17\" y=\"52\" width=\"15\" height=\"7\" fill=\"#090914\"/><rect x=\"33\" y=\"52\" width=\"15\" height=\"7\" fill=\"#090914\"/><rect x=\"17\" y=\"29\" width=\"30\" height=\"20\" fill=\"#10101c\"/><rect x=\"20\" y=\"27\" width=\"24\" height=\"21\" fill=\"#315b9d\"/><rect x=\"22\" y=\"29\" width=\"5\" height=\"16\" fill=\"#8ecbff\"/><rect x=\"38\" y=\"29\" width=\"4\" height=\"16\" fill=\"#17315e\"/><rect x=\"25\" y=\"19\" width=\"14\" height=\"10\" fill=\"#eab28d\"/><rect x=\"19\" y=\"5\" width=\"27\" height=\"23\" fill=\"#f2c49e\"/><rect x=\"17\" y=\"7\" width=\"31\" height=\"10\" fill=\"#2468b9\"/><rect x=\"17\" y=\"10\" width=\"5\" height=\"15\" fill=\"#2468b9\"/><rect x=\"43\" y=\"9\" width=\"5\" height=\"14\" fill=\"#2468b9\"/><rect x=\"21\" y=\"2\" width=\"22\" height=\"7\" fill=\"#2468b9\"/><rect x=\"24\" y=\"16\" width=\"5\" height=\"4\" fill=\"#171327\"/><rect x=\"36\" y=\"16\" width=\"5\" height=\"4\" fill=\"#171327\"/><rect x=\"25\" y=\"17\" width=\"3\" height=\"2\" fill=\"#8bff55\"/><rect x=\"37\" y=\"17\" width=\"3\" height=\"2\" fill=\"#8bff55\"/><rect x=\"29\" y=\"23\" width=\"7\" height=\"2\" fill=\"#a65e5c\"/><rect x=\"14\" y=\"0\" width=\"36\" height=\"5\" fill=\"#17243c\"/><rect x=\"17\" y=\"0\" width=\"29\" height=\"3\" fill=\"#8bff55\"/>\n</g></svg>";
 sprite.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
 const tile=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
 window.floor=()=>{
   ctx.fillStyle="#171027";ctx.fillRect(0,0,W,H);
   for(let y=0;y<H;y+=32)for(let x=0;x<W;x+=32){
     const n=((x/32*7+y/32*11)%5);
     tile(x+1,y+1,30,30,["#292044","#30234c","#233b31","#392641","#202c49"][n]);
     ctx.strokeStyle=["#493267","#574078","#477044","#65415b","#394d70"][n];ctx.lineWidth=2;ctx.strokeRect(x+2,y+2,28,28);
     if(n===2){tile(x+7,y+8,18,3,"#70b84c");tile(x+12,y+17,10,3,"#4d9d43");}
     if(n===3){tile(x+5,y+7,20,3,"#a56a55");tile(x+5,y+21,20,3,"#a56a55");}
   }
   // neon industrial walls
   [[28,30,208,86],[664,30,208,86],[28,484,208,86],[664,484,208,86],[346,28,208,42],[346,530,208,42]].forEach(([x,y,w,h])=>{
     tile(x,y,w,h,"#100b1c");ctx.strokeStyle="#a64be0";ctx.lineWidth=5;ctx.strokeRect(x+2,y+2,w-4,h-4);ctx.strokeStyle="#493064";ctx.lineWidth=2;ctx.strokeRect(x+10,y+10,w-20,h-20);
   });
   // crates and energy terminals
   [[90,166],[720,166],[90,370],[720,370],[405,112],[405,430]].forEach(([x,y],i)=>{
     tile(x,y,76,58,i%2?"#4b2c5d":"#252d54");ctx.strokeStyle=i%2?"#d08b49":"#5ad9ff";ctx.lineWidth=4;ctx.strokeRect(x+3,y+3,70,52);ctx.strokeStyle="#171027";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+9,y+9);ctx.lineTo(x+67,y+49);ctx.moveTo(x+67,y+9);ctx.lineTo(x+9,y+49);ctx.stroke();
   });
   // collectible powers on the floor
   const drops=[[278,130,"#ff526e","♥"],[620,310,"#54cfff","ϟ"],[270,455,"#a5ff4f","+"],[625,455,"#c36aff","✦"]];
   drops.forEach(([x,y,c,s])=>{ctx.fillStyle=c+"33";ctx.beginPath();ctx.arc(x+16,y+16,23,0,Math.PI*2);ctx.fill();tile(x+3,y+3,26,26,"#160e25");ctx.strokeStyle=c;ctx.lineWidth=3;ctx.strokeRect(x+3,y+3,26,26);ctx.fillStyle=c;ctx.font="bold 22px monospace";ctx.textAlign="center";ctx.fillText(s,x+16,y+24);});
 };
 window.crew=(p)=>{
   const x=Math.round(p.x),y=Math.round(p.y);ctx.save();ctx.globalAlpha=p.alive?1:.25;
   if(sprite.complete&&sprite.naturalWidth){
     let sx=0;
     if(p.accessory==="cat")sx=64;else if(p.accessory==="cap"||p.accessory==="crown")sx=128;
     ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,sx,0,64,64,x-32,y-32,64,64);
     // tint clothing only with multiply, clipped to torso
     if(p.color&&p.color!=="#8bff55"){
       ctx.globalCompositeOperation="source-atop";ctx.fillStyle=p.color;ctx.globalAlpha=.24;ctx.fillRect(x-15,y-6,30,23);
     }
   }
   ctx.restore();
   ctx.font="bold 12px monospace";ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="#090715";ctx.strokeText(p.name||"Jogador",x,y-40);ctx.fillStyle="#fff";ctx.fillText(p.name||"Jogador",x,y-40);
   if(p.alive){ctx.fillStyle="#0a0917";ctx.fillRect(x-15,y+30,30,5);ctx.fillStyle=p.hp>50?"#8bff55":p.hp>25?"#ffc84b":"#ff536c";ctx.fillRect(x-14,y+31,28*Math.max(0,p.hp)/100,3);}
 };
 window.draw=()=>{if(!ctx)return;ctx.clearRect(0,0,W,H);floor();bullets.forEach(b=>{ctx.fillStyle="#fff3a5";ctx.shadowColor="#ffb84b";ctx.shadowBlur=12;ctx.fillRect(Math.round(b.x)-4,Math.round(b.y)-4,8,8);ctx.shadowBlur=0;});players.forEach(crew);};
 sprite.onload=()=>draw();
 const c=document.getElementById("avatarColor"),o=document.getElementById("avatarOutfit"),a=document.getElementById("avatarAccessory"),preview=document.getElementById("avatarPreview");
 if(c&&o&&a){
  c.value=localStorage.getItem("ct_color")||"#8bff55";o.value=localStorage.getItem("ct_outfit")||"tech";a.value=localStorage.getItem("ct_accessory")||"visor";
  const paint=()=>{localStorage.setItem("ct_color",c.value);localStorage.setItem("ct_outfit",o.value);localStorage.setItem("ct_accessory",a.value);if(preview){preview.style.setProperty("--avatar-color",c.value);preview.dataset.outfit=o.value;preview.dataset.accessory=a.value;}};
  [c,o,a].forEach(el=>el.addEventListener("change",paint));paint();
 }
})();