'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const products=[
{id:1,img:'ios-0',name:'CROCS/卡骆驰【经典羊茸】儿童洞洞鞋百搭外穿冬季212856/212857',price:313,sales:900,type:'warm',tag:'经典羊茸'},
{id:2,img:'ios-1',name:'CROCS/卡骆驰【经典暖棉】儿童冬季加绒洞洞拖鞋207009/207010',price:283,sales:100,type:'warm',tag:'暖棉系列'},
{id:3,img:'ios-2',name:'新潮新品 CROCS/卡骆驰经典羊茸雪花棉拖外穿保暖加绒童鞋214078/21407',price:399,sales:35,type:'warm',tag:'新潮新品'},
{id:4,img:'ios-3',name:'CROCS/卡骆驰【儿童洞洞鞋】多巴胺儿童沙滩拖鞋207012/207013',price:169,sales:10000,type:'classic',tag:'经典洞洞鞋'},
{id:5,img:'ios-4',name:'【达人831】CROCS 儿童冬季经典百搭洞洞鞋207500',price:439,sales:100,type:'classic',tag:'经典百搭'},
{id:6,img:37,name:'Crocs 经典儿童洞洞鞋 奶油白',price:229,sales:9200,type:'classic',tag:'经典百搭'},
{id:7,img:199,name:'Crocs 儿童暖棉鞋 淡紫色',price:329,sales:1730,type:'warm',tag:'温暖上新'},
{id:8,img:189,name:'Crocs 儿童经典款 亮粉色',price:239,sales:2680,type:'classic',tag:'缤纷色彩'},
{id:9,img:169,name:'Crocs 儿童运动休闲洞洞鞋 黑色',price:289,sales:3320,type:'classic',tag:'自在出行'},
{id:10,img:195,name:'Crocs 儿童轻盈洞洞鞋 海洋蓝',price:229,sales:2500,type:'classic',tag:'舒适轻盈'}];
let activeTab='brand',sort='default',ascending=true,filter='all',previousFocus=null,toastTimer,slide=0,timer,paused=false;
const overlay=$('#overlay');
function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,2300)}
function openSheet(title,html){previousFocus=document.activeElement;$('#sheetTitle').textContent=title;$('#sheetContent').innerHTML=html;overlay.hidden=false;document.body.style.overflow='hidden';$('.sheet').focus();paused=true}
function closeSheet(){overlay.hidden=true;document.body.style.overflow='';paused=false;previousFocus?.focus()}
function card(p){return `<button class="product-card" data-product="${p.id}"><div class="product-image"><img src="assets/product-${p.img}.png" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div><h3>${p.name}</h3><p class="price"><small>¥</small>${p.price}<span class="sold">已售${p.sales>=10000?(p.sales/10000).toFixed(1)+'万':p.sales}</span></p></button>`}
function renderProducts(){let p=products.filter(x=>filter==='all'||x.type===filter);if(sort==='new')p=p.slice().reverse();if(sort==='sales')p.sort((a,b)=>b.sales-a.sales);if(sort==='price')p.sort((a,b)=>ascending?a.price-b.price:b.price-a.price);$('#products').innerHTML=p.map(card).join('')||'<div class="empty">暂无符合条件的商品</div>'}
$('#featured').innerHTML=products.slice(0,6).map(card).join('');$('#categories').innerHTML=products.map(card).join('');$('#newProducts').innerHTML=[products[6],products[3],products[4],products[7]].map(card).join('');renderProducts();
function setTab(tab,scroll=true){return window.shopMotion.selectTab(tab,scroll)}
const realSlides=$$('.slides > .slide');
const slideCount=realSlides.length;
const slideTrack=$('.slides');
let slidePosition=1,dragStart=null,suppressSlideClick=false;
function makeClone(node){const clone=node.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.tabIndex=-1;clone.dataset.clone='true';return clone}
slideTrack.prepend(makeClone(realSlides.at(-1)));slideTrack.append(makeClone(realSlides[0]));
slideTrack.style.transition='none';slideTrack.style.transform='translateX(-100%)';
function setSlide(i){slide=(i+slideCount)%slideCount;slidePosition=i<0?0:i>=slideCount?slideCount+1:slide+1;slideTrack.style.transition='transform .42s cubic-bezier(.2,.7,.3,1)';slideTrack.style.transform=`translateX(-${slidePosition*100}%)`;$$('.carousel-dots button').forEach((b,j)=>b.setAttribute('aria-current',j===slide))}
slideTrack.addEventListener('transitionend',()=>{if(slidePosition===0||slidePosition===slideCount+1){slidePosition=slide+1;slideTrack.style.transition='none';slideTrack.style.transform=`translateX(-${slidePosition*100}%)`}});
function startCarousel(){clearInterval(timer);timer=setInterval(()=>{if(!paused&&activeTab==='brand'&&!document.hidden)setSlide(slide+1)},5000)}startCarousel();
$$('.carousel-dots button').forEach((b,i)=>b.addEventListener('click',()=>{setSlide(i);startCarousel()}));
$('#carousel').addEventListener('pointerdown',e=>{dragStart={x:e.clientX,y:e.clientY};paused=true;suppressSlideClick=false});
$('#carousel').addEventListener('pointerup',e=>{if(dragStart){const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){suppressSlideClick=true;setSlide(slide+(dx<0?1:-1));startCarousel()}}dragStart=null;paused=false});
$('#carousel').addEventListener('click',e=>{if(suppressSlideClick){e.preventDefault();e.stopPropagation();suppressSlideClick=false}},true);
$('#carousel').addEventListener('dragstart',e=>e.preventDefault());
$('#carousel').addEventListener('pointercancel',()=>{dragStart=null;paused=false});
const note='<p class="dialog-note">独立交互预览，不会操作抖音账号。</p>';
function searchSheet(){openSheet('搜索店内商品',`<form id="searchForm"><input id="searchInput" type="search" placeholder="搜索店内商品" autocomplete="off"><button class="primary" type="submit">搜索</button></form><h3 class="search-heading">热门搜索</h3><div class="chips">${['鞋花','洞洞鞋','暖棉鞋','联名款','儿童凉鞋'].map(s=>`<button data-query="${s}">${s}</button>`).join('')}</div>`);setTimeout(()=>$('#searchInput')?.focus(),150)}
function doSearch(q){q=q.trim();closeSheet();setTab('products');const found=products.filter(p=>q==='洞洞鞋'||q==='儿童凉鞋'?p.type==='classic':q==='暖棉鞋'?p.type==='warm':q==='联名款'?p.type==='collab':p.name.includes(q));$('#products').innerHTML=found.map(card).join('')||`<p class="empty">没有找到相关商品</p>`;toast(`搜索：${q||'全部商品'}`)}
function productDetail(id){const p=products.find(x=>x.id===id);if(!p)return;openSheet('商品详情',`<img class="product-detail-image" src="assets/product-${p.img}.png" alt="${p.name}"><div class="detail-price">¥${p.price}</div><p><b>${p.name}</b></p><h3 class="search-heading">选择尺码</h3><div class="sizes">${['C6','C7','C8','C9','C10','C11','C12','C13'].map(s=>`<button data-size="${s}">${s}</button>`).join('')}</div><button class="primary" data-action="bag">加入购物袋</button>${note}`)}
const actions={
back:()=>{if(!overlay.hidden)return closeSheet();if(activeTab!=='brand')return setTab('brand');window.scrollTo({top:0,behavior:'smooth'});toast('已在店铺首页')},
search:searchSheet,
share:()=>openSheet('分享店铺',`<div class="share-options"><button data-action="copy"><span class="share-icon"><svg viewBox="0 0 24 24"><path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"/></svg></span>复制预览链接</button><button data-action="copy-name"><span class="share-icon">Aa</span>复制店铺名称</button></div>${note}<button class="secondary" data-close>取消</button>`),
copy:async()=>{try{await navigator.clipboard.writeText(location.href);toast('已复制预览链接')}catch{toast('可从浏览器地址栏复制链接')}},
'copy-name':async()=>{try{await navigator.clipboard.writeText('CROCS童鞋官方旗舰店');toast('已复制店铺名称')}catch{toast('CROCS童鞋官方旗舰店')}},
'store-info':()=>openSheet('店铺信息',`<div class="verified"><span>✓</span> 品牌官方旗舰店</div><div class="sheet-row"><b>店铺名称</b><span>CROCS童鞋官方旗舰店</span></div><div class="sheet-row"><b>粉丝</b><span>10.3万</span></div><div class="sheet-row"><b>店铺体验分</b><span>4.7</span></div><div class="sheet-row"><b>主营品牌</b><span>CROCS / 卡骆驰</span></div>${note}`),
reputation:()=>openSheet('店铺口碑',`<img class="stars-lg" src="assets/stars.png" alt="店铺评分"><h2>4.7</h2><div class="sheet-row"><b>品牌儿童鞋靴榜</b><span>入选品牌榜单 ›</span></div><div class="sheet-row"><b>回头客</b><span>近半年5万</span></div><div class="sheet-row"><b>好评</b><span>近半年1千</span></div><div class="sheet-row"><b>累计销量</b><span>14.7万</span></div>${note}`),
live:()=>openSheet('店铺直播',`<div class="live-still"><img src="assets/live.png" alt="店铺直播封面"><span>直播封面预览</span></div><p><b>CROCS童鞋官方旗舰店</b><br>49件热卖商品</p><button class="primary" data-action="view-products">查看店内商品</button>${note}`),
member:()=>openSheet('店铺会员',`<div class="coupon"><strong>10<small>元</small></strong><div><h3>入会专享礼</h3><p>尊享会员身份</p></div></div><div class="sheet-row"><b>会员权益</b><span>入会礼券 · 专属活动</span></div><button class="primary" data-action="join">立即入会领券</button>${note}`),
join:()=>{const b=$('[data-action="join"]');b.textContent='已领取（预览）';b.disabled=true;toast('领券效果已演示，不产生实际入会或领券')},
certification:()=>openSheet('品牌官方认证',`<div class="verified"><svg viewBox="0 0 24 24"><path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5Z"/><path d="m8 12 3 3 5-6"/></svg>抖音商城官方认证</div><div class="sheet-row"><b>店铺类型</b><span>品牌旗舰店</span></div><div class="sheet-row"><b>品牌</b><span>CROCS</span></div><p>此区域展示原页面的品牌认证信息样式。</p>${note}`),
collection:()=>setTab('products'),
'view-products':()=>{closeSheet();actions.collection()},
filter:()=>openSheet('筛选',`<h3 class="search-heading">商品系列</h3><div class="chips">${[['all','全部'],['classic','经典洞洞鞋'],['warm','暖棉系列'],['collab','联名系列'],['jibbitz','个性鞋花']].map(([v,n])=>`<button data-filter="${v}" class="${filter===v?'active':''}">${n}</button>`).join('')}</div><button class="primary" data-action="apply-filter">确定</button><button class="secondary" data-action="reset-filter">重置</button>`),
'apply-filter':()=>{closeSheet();renderProducts()},'reset-filter':()=>{filter='all';closeSheet();renderProducts()},
bag:()=>{if(!$('.sizes .active'))return toast('请先选择尺码');toast('已演示加入购物袋，不产生真实订单')}
};
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-close]');if(!b)return;if(b.hasAttribute('data-close'))return closeSheet();if(b.dataset.tab)return setTab(b.dataset.tab);if(b.dataset.product)return productDetail(+b.dataset.product);if(b.dataset.action)return actions[b.dataset.action]?.();if(b.dataset.query)return doSearch(b.dataset.query);if(b.dataset.size){$$('[data-size]').forEach(x=>x.classList.toggle('active',x===b));return}if(b.dataset.sort){if(sort==='price'&&b.dataset.sort==='price')ascending=!ascending;sort=b.dataset.sort;$$('[data-sort]').forEach(x=>x.classList.toggle('active',x===b));renderProducts();return}if(b.dataset.filter){filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));return}if(b.dataset.category){$$('[data-category]').forEach(x=>x.classList.toggle('active',x===b));$('#categoryTitle').textContent=b.textContent;$('#categories').innerHTML=products.filter(p=>b.dataset.category==='all'||p.type===b.dataset.category).map(card).join('')}});
document.addEventListener('submit',e=>{if(e.target.id==='searchForm'){e.preventDefault();doSearch($('#searchInput').value)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)closeSheet();if(!overlay.hidden&&e.key==='Tab'){const f=[...$('.sheet').querySelectorAll('button:not(:disabled),input')],first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}if(e.target.matches('[role=tab]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const tabs=$$('[data-tab]'),i=tabs.indexOf(e.target),b=tabs[(i+(e.key==='ArrowRight'?1:3))%4];setTab(b.dataset.tab);b.focus()}});
const root=$('#store');
const miniBrand=$('.mini-brand');
const sourceHeader=window.SOURCE_HEADER_CONTRACT;
function sourceOpacity(key,p){const f=sourceHeader.opacity[key];return clamp(f.intercept+f.slope*p)}
const clamp=n=>Math.max(0,Math.min(1,n));
let scheduled=false;
function updateScroll(){
 const unit=parseFloat(getComputedStyle(document.documentElement).fontSize)/16;
 const y=Math.max(0,window.scrollY)/unit;
 const range=Math.max(1,$('.store-header').offsetHeight-parseFloat(getComputedStyle($('.tabs')).top));
 const progress=clamp(Math.max(0,window.scrollY)/range);
 const mini=sourceOpacity('mini',progress);
 root.style.setProperty('--mini-progress',mini.toFixed(3));
 root.style.setProperty('--search-progress',clamp(progress/.44).toFixed(4));
 root.style.setProperty('--mask-alpha',((sourceHeader.background_mask.top_alpha_255_start+sourceHeader.background_mask.top_alpha_255_delta*progress)/255).toFixed(4));
 root.style.setProperty('--floating-live-opacity',clamp((progress-.55)/.35).toFixed(3));
 for(const key of ['logo','name','reputation','cards','certification'])root.style.setProperty(`--${key}-opacity`,sourceOpacity(key,progress).toFixed(4));
 root.classList.toggle('has-mini',mini>.5);root.classList.toggle('is-folded',progress>.88);
 // Keep the offscreen full header out of the focus order after it has folded.
 for(const [selector,key] of [['.name-row','name'],['.reputation','reputation'],['.benefit-cards','cards'],['.official-banner','certification']])$(selector).inert=sourceOpacity(key,progress)<=0;
 miniBrand.tabIndex=mini>.5?0:-1;miniBrand.setAttribute('aria-hidden',mini<=.5);
 $('#toTop').hidden=window.scrollY<900*unit;scheduled=false;
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});
window.addEventListener('resize',updateScroll);
$('#toTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));updateScroll();
