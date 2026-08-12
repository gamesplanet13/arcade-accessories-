(function(){
  "use strict";
  const modal=document.getElementById("imgModal");
  if(!modal) return;
  const box=modal.querySelector(".modal-image-box");
  if(!box) return;
  modal.classList.add("gp3d-modal");
  box.classList.add("gp3d-shell");
  box.innerHTML=`
    <div class="gp3d-head"><div><strong id="gp3dTitle">Product 3D View</strong><small>Touch and drag to rotate • Pinch or wheel to zoom</small></div></div>
    <div class="gp3d-viewport" id="gp3dViewport" role="dialog" aria-label="Interactive AI 3D product preview">
      <div class="gp3d-badge">360° AI 3D VIEW</div><div class="gp3d-floor"></div>
      <div class="gp3d-object" id="gp3dObject">
        <div class="gp3d-face gp3d-front"></div><div class="gp3d-face gp3d-back"></div>
        <div class="gp3d-face gp3d-side gp3d-left"></div><div class="gp3d-face gp3d-side gp3d-right"></div>
        <div class="gp3d-face gp3d-side gp3d-top"></div><div class="gp3d-face gp3d-side gp3d-bottom"></div>
      </div>
      <button class="close-btn gp3d-close" type="button" aria-label="Close 3D view">×</button>
    </div>
    <div class="gp3d-controls"><button type="button" data-action="spin">⏸ Auto Rotate</button><button type="button" data-action="reset">↺ Reset</button><button type="button" data-action="zoom-in">＋ Zoom</button><button type="button" data-action="zoom-out">− Zoom</button><p class="gp3d-note">Front photo is original. Hidden rear and side surfaces are an AI-style simulation, not a guaranteed physical view.</p></div>`;
  const viewport=box.querySelector("#gp3dViewport"), object=box.querySelector("#gp3dObject"), title=box.querySelector("#gp3dTitle");
  const front=box.querySelector(".gp3d-front"), back=box.querySelector(".gp3d-back");
  let rx=-7,ry=0,scale=1,auto=true,raf=0,last=performance.now(),moved=false,lastTap=0;
  const pointers=new Map(); let startDistance=0,startScale=1,lastPoint=null;
  function imageUrl(src){return `url("${String(src||"").replace(/"/g,"%22")}")`}
  function render(){object.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`}
  function frame(now){if(auto&&modal.style.display==="flex"){ry+=(now-last)*.018;render()}last=now;raf=requestAnimationFrame(frame)}
  function reset(){rx=-7;ry=0;scale=1;auto=true;updateSpin();render()}
  function updateSpin(){const b=box.querySelector('[data-action="spin"]');if(b)b.textContent=auto?"⏸ Auto Rotate":"▶ Auto Rotate"}
  function open(src,imgEl){
    const alt=(imgEl&&imgEl.alt)||"Product"; title.textContent=alt.replace(/\s+—\s+view\s+\d+$/i,"");
    let sources=[]; const row=imgEl&&imgEl.parentElement;
    if(row) sources=[...row.querySelectorAll("img")].map(x=>x.getAttribute("src")).filter(Boolean);
    const second=sources.find(x=>x!==src)||src;
    front.style.backgroundImage=imageUrl(src); back.style.backgroundImage=imageUrl(second);
    modal.style.display="flex";document.body.style.overflow="hidden";reset();
    try{history.pushState({imgOpen:true},"")}catch(_e){}
  }
  function close(){modal.style.display="none";document.body.style.overflow="";pointers.clear();lastPoint=null}
  viewport.addEventListener("pointerdown",e=>{viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});lastPoint={x:e.clientX,y:e.clientY};moved=false;auto=false;updateSpin()});
  viewport.addEventListener("pointermove",e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const pts=[...pointers.values()];if(pts.length===2){const d=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);if(!startDistance){startDistance=d;startScale=scale}else{scale=Math.min(2.7,Math.max(.55,startScale*d/startDistance));render()}return}if(lastPoint){const dx=e.clientX-lastPoint.x,dy=e.clientY-lastPoint.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;ry+=dx*.55;rx=Math.max(-70,Math.min(70,rx-dy*.4));lastPoint={x:e.clientX,y:e.clientY};render()}});
  function pointerEnd(e){pointers.delete(e.pointerId);startDistance=0;lastPoint=null;const now=Date.now();if(!moved&&now-lastTap<320)reset();if(!moved)lastTap=now}
  viewport.addEventListener("pointerup",pointerEnd);viewport.addEventListener("pointercancel",pointerEnd);
  viewport.addEventListener("wheel",e=>{e.preventDefault();auto=false;scale=Math.min(2.7,Math.max(.55,scale+(e.deltaY<0?.12:-.12)));updateSpin();render()},{passive:false});
  box.querySelector(".gp3d-close").addEventListener("click",close);
  box.querySelector(".gp3d-controls").addEventListener("click",e=>{const a=e.target.dataset.action;if(!a)return;if(a==="spin"){auto=!auto;updateSpin()}if(a==="reset")reset();if(a==="zoom-in"){scale=Math.min(2.7,scale+.18);render()}if(a==="zoom-out"){scale=Math.max(.55,scale-.18);render()}});
  modal.addEventListener("click",e=>{if(e.target===modal)close()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.style.display==="flex")close()});
  window.openImg=open;window.closeImg=close;render();raf=requestAnimationFrame(frame);
})();
