'use strict';
(() => {
 const tabs=$('.tabs'),indicator=$('.tab-indicator'),body=$('#shopBody');
 const buttons=$$('[data-tab]'),panels=$$('[role=tabpanel]');
 const viewport=document.createElement('div');viewport.className='panel-viewport';
 const track=document.createElement('div');track.className='panel-track';viewport.append(track);body.append(viewport);
 panels.forEach(p=>{p.hidden=false;track.append(p)});
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 let animation=0,animationActive=false,settleTimer=0,touching=false,pointerDown=false,ignoreSettleUntil=0;
 let horizontal=null;
 const px=rem=>parseFloat(getComputedStyle(document.documentElement).fontSize)*rem;
 function foldRange(){return Math.max(0,$('#shopBody').offsetTop-parseFloat(getComputedStyle(tabs).top))}
 function selectedIndex(){return buttons.findIndex(b=>b.dataset.tab===activeTab)}
 function updateHeight(){const p=panels[selectedIndex()];if(p)viewport.style.height=`${Math.ceil(p.getBoundingClientRect().height)}px`}
 function indicatorAt(index){const b=buttons[index];return b.offsetLeft+b.offsetWidth/2-indicator.offsetWidth/2}
 function setIndicator(index){indicator.style.transform=`translate3d(${indicatorAt(index)}px,0,0)`}
 function stopAnimation(){if(animation)cancelAnimationFrame(animation);animation=0;animationActive=false}
 function animateTo(target,duration=420){
  clearTimeout(settleTimer);stopAnimation();target=Math.max(0,target);
  const from=window.scrollY,delta=target-from;
  if(Math.abs(delta)<.75||reduced()){window.scrollTo(0,target);updateScroll();return}
  const started=performance.now();animationActive=true;ignoreSettleUntil=started+duration+160;
  function frame(now){const t=Math.min(1,(now-started)/duration);const eased=(1-Math.cos(Math.PI*t))/2;window.scrollTo(0,from+delta*eased);if(t<1){animation=requestAnimationFrame(frame)}else{animation=0;animationActive=false;updateScroll()}}
  animation=requestAnimationFrame(frame);
 }
 function settle(){
  if(animationActive||touching||pointerDown||performance.now()<ignoreSettleUntil)return;
  const range=foldRange(),y=window.scrollY;
  if(y<1||y>=range-1)return;
  // The title crossing the fixed navigation is the recorded iOS decision point.
  const title=$('.name-row'),navBottom=parseFloat(getComputedStyle(tabs).top);
  const threshold=Math.max(px(2),title.offsetTop+title.offsetHeight-navBottom);
  animateTo(y>=threshold?range:0,380);
 }
 function scheduleSettle(){clearTimeout(settleTimer);settleTimer=setTimeout(settle,115)}
 function selectTab(tab,collapse=true,slide=false){
  const index=buttons.findIndex(b=>b.dataset.tab===tab);if(index<0)return;
  clearTimeout(settleTimer);activeTab=tab;
  buttons.forEach((b,i)=>{b.setAttribute('aria-selected',i===index);b.tabIndex=i===index?0:-1});
  panels.forEach((p,i)=>{p.inert=i!==index;p.setAttribute('aria-hidden',i!==index)});
  // Direct tab clicks must not sweep unrelated panels through the viewport.
  if(!slide)track.classList.add('is-direct-switch');
  track.style.setProperty('--panel-index',index);
  if(!slide){track.getBoundingClientRect();track.classList.remove('is-direct-switch')}
  setIndicator(index);updateHeight();
  if(collapse)animateTo(foldRange());
 }
 window.shopMotion={selectTab,foldRange,expand:()=>animateTo(0),collapse:()=>animateTo(foldRange()),settle, get animating(){return animationActive}};
 window.addEventListener('scroll',()=>{if(!animationActive)scheduleSettle()},{passive:true});
 window.addEventListener('scrollend',scheduleSettle,{passive:true});
 window.addEventListener('wheel',()=>{if(animationActive)stopAnimation();ignoreSettleUntil=0;scheduleSettle()},{passive:true});
 window.addEventListener('touchstart',()=>{touching=true;clearTimeout(settleTimer);stopAnimation();ignoreSettleUntil=0},{passive:true});
 window.addEventListener('touchend',e=>{touching=e.touches.length>0;if(!touching)scheduleSettle()},{passive:true});
 window.addEventListener('touchcancel',()=>{touching=false;scheduleSettle()},{passive:true});
 window.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'){pointerDown=true;clearTimeout(settleTimer);stopAnimation();ignoreSettleUntil=0}},{passive:true});
 window.addEventListener('pointerup',()=>{pointerDown=false;scheduleSettle()},{passive:true});
 viewport.addEventListener('pointerdown',e=>{if(e.target.closest('.carousel,.tab-carousel,.flip-grid,.hotspot'))return;horizontal={x:e.clientX,y:e.clientY,index:selectedIndex(),active:false}});
 viewport.addEventListener('pointermove',e=>{if(!horizontal)return;const dx=e.clientX-horizontal.x,dy=e.clientY-horizontal.y;if(!horizontal.active&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.3){horizontal.active=true;viewport.setPointerCapture(e.pointerId);track.classList.add('is-dragging');tabs.classList.add('is-dragging')}
  if(horizontal.active){e.preventDefault();const shift=Math.max(-1,Math.min(1,dx/viewport.clientWidth));const pos=Math.max(0,Math.min(buttons.length-1,horizontal.index-shift));track.style.setProperty('--panel-index',pos);const left=Math.floor(pos),right=Math.ceil(pos),x=indicatorAt(left)+(indicatorAt(right)-indicatorAt(left))*(pos-left);indicator.style.transform=`translate3d(${x}px,0,0)`}
 });
 let suppressClick=false;
 viewport.addEventListener('pointerup',e=>{if(!horizontal)return;const h=horizontal;horizontal=null;track.classList.remove('is-dragging');tabs.classList.remove('is-dragging');if(h.active){suppressClick=true;const dx=e.clientX-h.x;const next=Math.max(0,Math.min(buttons.length-1,h.index+(Math.abs(dx)>45?(dx<0?1:-1):0)));selectTab(buttons[next].dataset.tab,true,true);setTimeout(()=>suppressClick=false,0)}});
 viewport.addEventListener('pointercancel',()=>{if(horizontal){horizontal=null;track.classList.remove('is-dragging');tabs.classList.remove('is-dragging');track.style.setProperty('--panel-index',selectedIndex());setIndicator(selectedIndex())}});
 viewport.addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopPropagation()}},true);
 viewport.addEventListener('dragstart',e=>e.preventDefault());
 const resize=new ResizeObserver(()=>{updateHeight();setIndicator(selectedIndex())});panels.forEach(p=>resize.observe(p));window.addEventListener('resize',()=>{updateHeight();setIndicator(selectedIndex())});
 function follow(){const b=$('#follow'),on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);$('.follow-label span').textContent=on?'已关注':'关注';$('.follow-plus').toggleAttribute('hidden',on);$('.gift-label').hidden=on;$('.mini-plus').hidden=on;b.animate([{transform:'scale(.94)'},{transform:'scale(1)'}],{duration:180,easing:'ease-out'})}
 $('#follow').addEventListener('click',follow);$('.mini-plus').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();follow()});
 // Reputation pills are a separate horizontal scroller, not an autoplay marquee.
 const reputationTags=$('.tag-scroll');let tagGesture=null,tagDragClick=false;
 reputationTags.addEventListener('pointerdown',e=>{tagDragClick=false;tagGesture={x:e.clientX,y:e.clientY,left:reputationTags.scrollLeft,mouse:e.pointerType==='mouse',moved:false}});
 reputationTags.addEventListener('pointermove',e=>{if(!tagGesture)return;const dx=e.clientX-tagGesture.x,dy=e.clientY-tagGesture.y;
  if(Math.abs(dx)>5&&Math.abs(dx)>Math.abs(dy)){tagGesture.moved=true;tagDragClick=true;reputationTags.classList.add('is-dragging');if(tagGesture.mouse){reputationTags.setPointerCapture(e.pointerId);e.preventDefault();reputationTags.scrollLeft=tagGesture.left-dx}}
 });
 reputationTags.addEventListener('scroll',()=>{if(tagGesture){tagGesture.moved=true;tagDragClick=true}},{passive:true});
 function finishTagDrag(){if(tagGesture?.moved)tagDragClick=true;tagGesture=null;reputationTags.classList.remove('is-dragging')}
 reputationTags.addEventListener('pointerup',finishTagDrag);reputationTags.addEventListener('pointercancel',finishTagDrag);
 reputationTags.addEventListener('click',e=>{if(tagDragClick){e.preventDefault();e.stopPropagation();tagDragClick=false}},true);
 reputationTags.addEventListener('dragstart',e=>e.preventDefault());
 reputationTags.addEventListener('wheel',e=>{if(e.shiftKey&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();reputationTags.scrollLeft+=e.deltaY}},{passive:false});
 selectTab('brand',false);document.fonts.ready.then(()=>{updateHeight();setIndicator(selectedIndex())});
})();
