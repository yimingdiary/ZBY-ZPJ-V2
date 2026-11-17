"""Compile confirmed static header parameters and formulas from the APK's template URLs.
No expression eval runs in the browser. Server-provided data and native custom elements
remain separate from this compiler; this is not the original Slice rendering engine.
"""
from pathlib import Path
import json,ast,operator,hashlib,re
ROOT=Path(__file__).resolve().parents[1]
brand=json.loads((ROOT/'source-templates/shop_profile_brand.json').read_text())
concise=json.loads((ROOT/'source-templates/shop_profile_brand_concise.json').read_text())
topbar=json.loads((ROOT/'source-templates/shop_top_bar.json').read_text())
els=brand['elements']; module=els[4]['elements'][0]['elements'][0]['elements'][0];parts=module['elements'];copy=parts[2]
# The extracted tree at 1440px/480dpi shows 52 template units -> 200px;
# this matches 480/375 layout adaptation. ECShopScrollText uses native sp.
layout_factor=480/375
L=lambda n:f'{float(n)*layout_factor/16:.7g}rem'
F=lambda n:f'{float(n)/16:.7g}rem'
def find(n,predicate):
 if isinstance(n,dict):
  if predicate(n):return n
  for v in n.values():
   r=find(v,predicate)
   if r:return r
 elif isinstance(n,list):
  for v in n:
   r=find(v,predicate)
   if r:return r
 return None
follow=find(els[2],lambda n:n.get('attr',{}).get('slice_key')=='follow_button')
name=find(els[2],lambda n:n.get('type')=='ECShopScrollText')
follow_text=find(follow,lambda n:n.get('attr',{}).get('text')=='关注')
follow_gradient=find(follow,lambda n:'bg_gradient' in n.get('style',{}))['style']['bg_gradient']
title=find(copy,lambda n:n.get('attr',{}).get(':text')=='props.title')
sub=find(copy,lambda n:n.get('attr',{}).get(':text')=='props.sub_title')
number=find(parts[1],lambda n:n.get('attr',{}).get(':text')=='props.cover_text')
root_top_padding=int(re.match(r'\[(\d+),',brand['style'][':padding']).group(1))
css=['/* GENERATED from source-templates/*.json. Rebuild with scripts/compile-source-styles.py. */']
css+=['@font-face{font-family:DouyinNumberABC;src:url("assets/douyin_number_abc_medium.otf") format("opentype");font-weight:500;font-display:swap}']
css += [f'.header-details{{padding:{F(68+4+root_top_padding*layout_factor)} 0 0;}}',
 f'.wordmark{{height:{L(els[1]["style"]["height"])};width:{L(els[1]["style"]["max_width"])};margin:0 {L(12)};transform:none;object-fit:contain}}',
 f'.name-row{{height:{L(els[2]["style"]["height"])};margin:{L(els[2]["style"]["margin"][0])} {L(12)} 0}}',
 f'.store-name{{font-size:{F(name["style"]["font_size"])};font-weight:{name["style"]["font_weight"]};letter-spacing:0}}',
 f'.follow{{min-width:0;width:{L(follow["style"]["width"])};height:{L(follow["style"]["height"])};border-radius:{L(follow["style"]["radius"][0])};font-size:{L(follow_text["style"]["font_size"])};padding:0;flex-shrink:0;background:linear-gradient({follow_gradient["degree"]}deg,'+','.join(f'{c["color"]} {100*c["location"]}%' for c in follow_gradient['colors'])+')}',
 f'.follow[aria-pressed=true]{{background:#ffffff33;color:#ffffff57;font-size:{L(13)}}}',
 f'.reputation{{height:{L(els[3]["style"]["height"])};margin:{L(4)} {L(12)} 0;width:calc(100% - {L(24)});padding:0}}',
 f'.benefit-cards{{height:{L(parts[1]["style"]["height"])};margin:{L(els[4]["style"]["margin"][0])} 0 0;padding:0 {L(12)};gap:{L(11)}}}',
 f'.benefit{{border-radius:{L(12)}}}.live-preview,.member-icon{{height:{L(52)};width:{L(52)};flex-shrink:0}}',
 f'.member-icon img{{width:100%;height:100%}}.member-icon>span{{top:{L(12)};left:{L(11)};right:{L(11)};display:flex;align-items:center;justify-content:center;color:{number["style"]["font_color"]};font-size:{L(13)};font-family:DouyinNumberABC,sans-serif;letter-spacing:0;font-weight:500;line-height:1}}.member-icon>span small{{font-size:{L(9)};font-family:inherit;margin-top:{L(2)}}}',
 f'.benefit-copy,.member-card .benefit-copy{{padding-left:{L(12)}}}.benefit-copy strong{{font-size:{L(title["style"]["font_size"])};font-weight:{title["style"]["font_weight"]};line-height:1.2}}.benefit-copy small{{font-size:{L(sub["style"]["font_size"])};font-weight:{sub["style"]["font_weight"]};color:#ffffff99;line-height:1.2;margin-top:{L(4)}}}',
 '.live-card{border-color:rgba(243,149,188,.34);background:linear-gradient(281deg,rgba(255,46,122,.15) 0%,rgba(255,255,255,.06) 55%)}',
 '.member-card{border-color:#ffe2a433;background:linear-gradient(281.25deg,rgba(255,225,119,.15) 7%,rgba(255,255,255,.06) 54%)}',
 f'.mini-info strong{{font-size:{F(12)};font-weight:600}}',
 '.cover-shade{background:linear-gradient(to bottom,rgba(0,0,0,var(--mask-alpha,.2)) 0%,#000000c2 50%,#000 100%)}',
 '.toolbar-shade{opacity:1;background:linear-gradient(to bottom,rgba(0,0,0,var(--mask-alpha,.2)),#000000c2 50%,#000)}']
# Do not invent scroll thresholds: preserve the template's formula coefficients.
ops={ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv}
def evaluate(n,p):
 if isinstance(n,ast.Expression):return evaluate(n.body,p)
 if isinstance(n,ast.Constant):return n.value
 if isinstance(n,ast.Name) and n.id=='p':return p
 if isinstance(n,ast.BinOp) and type(n.op) in ops:return ops[type(n.op)](evaluate(n.left,p),evaluate(n.right,p))
 raise ValueError(ast.dump(n))
formulas={}
for key,node in [('logo',els[1]),('name',els[2]),('reputation',els[3]),('cards',els[4]),('certification',els[5]),('mini',topbar['elements'][1]['elements'][1])]:
 expr=node['style'][':opacity'];tree=ast.parse(expr.replace('data.slice_item_states.profile_scroll_percent','p'),mode='eval');intercept=evaluate(tree,0);slope=evaluate(tree,1)-intercept;formulas[key]={'expression':expr,'intercept':intercept,'slope':slope}
contract={'source':'shop_profile_brand + shop_top_bar','runtime_template_version_verified':False,'layout_reference_width':375,'captured_device_logical_width':480,'progress':{'expression':'scrollY / getTopSheetViewHeight()','source':'TopSheetLayout.java:LIZJ'},'opacity':formulas,'background_mask':{'top_alpha_255_start':51,'top_alpha_255_delta':102,'middle_argb':'#C2000000','bottom_argb':'#FF000000'},'limits':['CDN template version has not been matched against protected runtime cache.','Native Slice custom widgets are adapted to DOM; full native engine and current server data are not available.']}
css+=['@font-face{font-family:AndroidLatin;src:url(assets/android-latin.woff2) format("woff2");font-weight:100 900;font-display:swap}@font-face{font-family:AndroidCJK;src:url(assets/android-cjk.woff2) format("woff2");font-weight:400;font-display:swap}body{font-family:AndroidLatin,AndroidCJK,sans-serif}', '.cover,.cover-shade{height:23.4375rem}.toolbar-shade{display:none}', '.toolbar{padding:0;gap:0}.toolbar>button{transform:none}.toolbar .back{margin-left:.75rem;width:1.5rem;height:1.5rem;padding:0}.toolbar .share{width:1.5rem;height:1.5rem;margin:0 .75rem;padding:0}.toolbar .back img,.toolbar .share img{width:1.5rem;height:1.5rem}.toolbar .search{margin-left:calc((157 - 21*var(--search-progress,0))*1rem/16);flex:1;min-width:0;width:auto;height:2.25rem;padding:0 .5rem;background:#ffffff30;border-color:#ffffff26;border-radius:1.125rem}.mini-brand{left:2.5rem;top:.375rem;height:2rem;gap:.5rem}.mini-logo{width:2rem;height:2rem;background:url(assets/mini-logo-border.png) center/100% 100%;border:0;border-radius:0}.mini-logo img{width:1.625rem}.mini-plus{width:1rem;height:1rem;right:-.4375rem;bottom:-.25rem;background:transparent;font-size:0}.mini-plus:before{content:"";position:absolute;inset:0;background:url(assets/mini-follow.png) center/contain no-repeat}.mini-info strong{line-height:1rem}.mini-info>img{height:.75rem;margin-top:.1875rem}.floating-live{background:#ffffff88}', '.official-banner{isolation:isolate}.official-banner img{position:relative;z-index:1}.slide img{user-select:none;-webkit-user-drag:none}']
# Use captured Android text bounds for line boxes, rather than browser font metrics.
ui=json.loads((ROOT/'source-evidence/captured-ui.json').read_text())
def captured_line_height(text):
 node=next(n for n in ui if n.get('text')==text)
 coords=list(map(int,re.findall(r'\d+',node['bounds'])))
 return (coords[3]-coords[1])/3
css += [f'.store-name{{line-height:{F(captured_line_height("CROCS童鞋官方旗舰店"))}}}',f'.benefit-copy strong{{line-height:{F(captured_line_height("直播中"))}}}',f'.benefit-copy small{{line-height:{F(captured_line_height("49件热卖商品"))}}}']
(ROOT/'dist/source-style.css').write_text('\n'.join(css)+'\n')
(ROOT/'dist/source-contract.js').write_text('/* Generated from original templates; no remote requests. */\nwindow.SOURCE_HEADER_CONTRACT = '+json.dumps(contract,ensure_ascii=False,indent=2)+';\n')
(ROOT/'source-evidence/compiled-contract.json').write_text(json.dumps(contract,ensure_ascii=False,indent=2))
print('Compiled original header parameters and',len(formulas),'opacity formulas')
