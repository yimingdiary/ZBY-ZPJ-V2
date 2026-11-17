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
function card(p){return `<button class="product-card" data-product="${p.id}"><div class="product-image"><img src="/shop-ui/assets/product-${p.img}.png" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div><h3>${p.name}</h3><p class="price"><small>¥</small>${p.price}<span class="sold">已售${p.sales>=10000?(p.sales/10000).toFixed(1)+'万':p.sales}</span></p></button>`}
function renderProducts(){let p=products.filter(x=>filter==='all'||x.type===filter);if(sort==='new')p=p.slice().reverse();if(sort==='sales')p.sort((a,b)=>b.sales-a.sales);if(sort==='price')p.sort((a,b)=>ascending?a.price-b.price:b.price-a.price);$('#products').innerHTML=p.map(card).join('')||'<div class="empty">暂无符合条件的商品</div>'}
$('#categories').innerHTML=products.map(card).join('');$('#newProducts').innerHTML=[products[6],products[3],products[4],products[7]].map(card).join('');renderProducts();
function setTab(tab,scroll=true){return window.shopMotion.selectTab(tab,scroll)}
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-close]');if(!b)return;if(b.dataset.tab)return setTab(b.dataset.tab);if(b.dataset.action==='back'){if(activeTab!=='brand')return setTab('brand');window.scrollTo({top:0,behavior:'smooth'});return;}if(b.dataset.sort){if(sort==='price'&&b.dataset.sort==='price')ascending=!ascending;sort=b.dataset.sort;$$('[data-sort]').forEach(x=>x.classList.toggle('active',x===b));renderProducts();return}if(b.dataset.category){$$('[data-category]').forEach(x=>x.classList.toggle('active',x===b));$('#categoryTitle').textContent=b.textContent;$('#categories').innerHTML=products.filter(p=>b.dataset.category==='all'||p.type===b.dataset.category).map(card).join('')}});
document.addEventListener('keydown',e=>{if(e.target.matches('[role=tab]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const tabs=$$('[data-tab]'),i=tabs.indexOf(e.target),b=tabs[(i+(e.key==='ArrowRight'?1:3))%4];setTab(b.dataset.tab);b.focus()}});

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
 scheduled=false;
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}},{passive:true});
window.addEventListener('resize',updateScroll);
updateScroll();
