// Caos Total — pixel-art renderer v1
(() => {
  const atlas = new Image();
  atlas.src = "./assets/caos-atlas.svg";
  const tile = (sx, sy, sw, sh, dx, dy, dw, dh) => {
    if (atlas.complete && atlas.naturalWidth) ctx.drawImage(atlas, sx, sy, sw, sh, dx, dy, dw, dh);
  };
  const pixel = (x,y,w,h,c) => { ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),w,h); };
  const palette = (hex) => {
    const n=parseInt((hex||"#8bff65").replace("#",""),16);
    const c=[(n>>16)&255,(n>>8)&255,n&255];
    const shade=(f)=>"#"+c.map(v=>Math.max(0,Math.min(255,Math.round(v*f))).toString(16).padStart(2,"0")).join("");
    return {base:hex||"#8bff65",light:shade(1.35),dark:shade(.48)};
  };
  window.floor = function(){
    ctx.fillStyle="#171328";ctx.fillRect(0,0,W,H);
    for(let y=0;y<H;y+=32) for(let x=0;x<W;x+=32){
      const v=((x/32+y/32)%6);
      tile([0,32,64,96,128,160][v],0,32,32,x,y,32,32);
      if(((x/32*7+y/32*11)%19)===0){ctx.globalAlpha=.2;tile(352,0,32,32,x+8,y+8,16,16);ctx.globalAlpha=1;}
    }
    // Neon-lit arena walls and machinery
    [[28,30,208,86],[664,30,208,86],[28,484,208,86],[664,484,208,86],[346,28,208,42],[346,530,208,42]].forEach(([x,y,w,h])=>{
      ctx.fillStyle="#100d20";ctx.fillRect(x,y,w,h);ctx.strokeStyle="#8b43b8";ctx.lineWidth=5;ctx.strokeRect(x+2,y+2,w-4,h-4);
      ctx.strokeStyle="#3d285d";ctx.lineWidth=2;ctx.strokeRect(x+9,y+9,w-18,h-18);
    });
    [[90,166],[720,166],[90,370],[720,370],[405,112],[405,430]].forEach(([x,y],i)=>{
      tile(i%2?128:72,48,48,48,x,y,76,58);
    });
    // Collectible power cells — world objects, not character skills
    const drops=[[278,130,144],[620,310,96],[270,455,192],[625,455,48]];
    drops.forEach(([x,y,s],i)=>{ctx.globalAlpha=.18;ctx.fillStyle=["#ff536c","#56d9ff","#a6ff4c","#bb61ff"][i];ctx.beginPath();ctx.arc(x+16,y+16,22,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;tile(s,112,32,32,x,y,32,32);});
    // crystals and plants
    tile(256,0,32,40,300,34,28,36);tile(48,168,32,32,568,515,30,30);tile(96,168,32,32,242,514,30,30);
  };
  window.crew = function(p){
    const x=Math.round(p.x),y=Math.round(p.y),c=palette(p.color),outfit=p.outfit||"tech";
    ctx.save();ctx.globalAlpha=p.alive?1:.25;
    // shadow
    ctx.fillStyle="#080611";ctx.fillRect(x-14,y+15,30,6);ctx.fillRect(x-9,y+20,20,3);
    // legs and boots
    pixel(x-10,y+8,8,11,"#171327");pixel(x+2,y+8,8,11,"#171327");
    pixel(x-12,y+17,10,4,"#080914");pixel(x+1,y+17,10,4,"#080914");
    pixel(x-9,y+10,5,7,c.dark);pixel(x+3,y+10,5,7,c.dark);
    // torso / jacket
    const jacket=outfit==="hoodie"?"#56328c":outfit==="armor"?"#3d526e":outfit==="red"?"#8e304a":c.base;
    pixel(x-13,y-7,26,18,"#080914");pixel(x-11,y-8,22,17,jacket);
    pixel(x-9,y-7,5,14,c.light);pixel(x+5,y-7,5,14,c.dark);
    pixel(x-3,y-4,6,12,"#171327");pixel(x-2,y-2,4,4,"#b8f8ff");
    // neck and face
    pixel(x-5,y-15,10,8,"#e6ad88");pixel(x-9,y-28,18,16,"#f1c49d");
    pixel(x-11,y-27,22,7,p.hairColor||"#33204d");
    pixel(x-13,y-23,5,9,p.hairColor||"#33204d");pixel(x+8,y-24,5,10,p.hairColor||"#33204d");
    pixel(x-7,y-17,4,3,"#1b1930");pixel(x+3,y-17,4,3,"#1b1930");
    pixel(x-6,y-17,2,2,"#8dff75");pixel(x+4,y-17,2,2,"#8dff75");
    pixel(x-2,y-12,4,2,"#a65e5c");
    // hair fringe
    pixel(x-8,y-29,16,4,p.hairColor||"#33204d");pixel(x-4,y-25,7,4,p.hairColor||"#33204d");
    // accessory
    const acc=p.accessory||"visor";
    if(acc==="crown"){pixel(x-6,y-35,4,6,"#ffd34f");pixel(x-2,y-39,4,10,"#ffd34f");pixel(x+2,y-35,4,6,"#ffd34f");}
    else if(acc==="cat"){pixel(x-11,y-32,6,8,"#b96cff");pixel(x+5,y-32,6,8,"#b96cff");}
    else if(acc==="cap"){pixel(x-12,y-28,24,4,"#315b9d");pixel(x+6,y-25,8,3,"#315b9d");}
    else {pixel(x-9,y-19,18,4,"#16263a");pixel(x-7,y-18,5,2,"#76f2ff");pixel(x+2,y-18,5,2,"#76f2ff");}
    // outline shine
    pixel(x-13,y-5,2,12,c.light);pixel(x+11,y-5,2,12,c.dark);
    ctx.restore();
    ctx.font="bold 12px monospace";ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="#090715";ctx.strokeText(p.name||"Jogador",x,y-42);ctx.fillStyle="#fff";ctx.fillText(p.name||"Jogador",x,y-42);
    if(p.alive){ctx.fillStyle="#0a0917";ctx.fillRect(x-15,y+25,30,5);ctx.fillStyle=p.hp>50?"#8bff55":p.hp>25?"#ffc84b":"#ff536c";ctx.fillRect(x-14,y+26,28*Math.max(0,p.hp)/100,3);}
  };
  window.draw = function(){
    if(!ctx)return;ctx.clearRect(0,0,W,H);floor();
    bullets.forEach(b=>{ctx.fillStyle="#fff3a5";ctx.shadowColor="#ffb84b";ctx.shadowBlur=12;ctx.fillRect(Math.round(b.x)-3,Math.round(b.y)-3,7,7);ctx.shadowBlur=0;});
    players.forEach(crew);
  };
  atlas.onload=()=>{if(typeof draw==="function")draw();};
  const colors=["#8bff55","#4ad8ff","#ff5b78","#b66aff","#ffc34e","#f4f1ff"];
  const colorInput=document.getElementById("avatarColor");
  const outfitInput=document.getElementById("avatarOutfit");
  const accessoryInput=document.getElementById("avatarAccessory");
  const preview=document.getElementById("avatarPreview");
  if(colorInput&&outfitInput&&accessoryInput){
    colorInput.value=localStorage.getItem("ct_color")||colors[0];
    outfitInput.value=localStorage.getItem("ct_outfit")||"tech";
    accessoryInput.value=localStorage.getItem("ct_accessory")||"visor";
    const paint=()=>{localStorage.setItem("ct_color",colorInput.value);localStorage.setItem("ct_outfit",outfitInput.value);localStorage.setItem("ct_accessory",accessoryInput.value);if(preview){preview.style.setProperty("--avatar-color",colorInput.value);preview.dataset.outfit=outfitInput.value;preview.dataset.accessory=accessoryInput.value;}};
    [colorInput,outfitInput,accessoryInput].forEach(el=>el.addEventListener("change",paint));paint();
    const originalCreate=document.getElementById("create").onclick;
    const originalJoin=document.getElementById("join").onclick;
    document.getElementById("create").onclick=()=>{COLORS[0]=colorInput.value;return originalCreate();};
    document.getElementById("join").onclick=()=>{COLORS[0]=colorInput.value;return originalJoin();};
  }
})();