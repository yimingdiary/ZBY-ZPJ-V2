# coding: utf-8
"""按 V1 第一张动态作品页的热区顺序导入；源目录始终只读。"""
from pathlib import Path
import json, shutil, subprocess
from importlib.util import spec_from_file_location, module_from_spec
_spec=spec_from_file_location("work_directories",Path(__file__).with_name("work-directories.py"));_names=module_from_spec(_spec);_spec.loader.exec_module(_names)
ROOT=Path(__file__).resolve().parent.parent
V1=ROOT.parent/'v1.0/ZBY-ZPJ'
manifest=json.loads((V1/'preview-manifest.json').read_text())
optimized=json.loads((V1/'preview-optimized-manifest.json').read_text())
hotspots=json.loads((V1/'hotspots.json').read_text())
page=hotspots['images'][0]
(ROOT/'src/modules/OverlayGallery/hotspots.json').write_text(json.dumps({'baseSize':hotspots['baseSize'],'areas':[{k:a[k] for k in ['x','y','width','height']} for a in page['areas']]},indent=2)+'\n')
keys=['pet-life','cat-litter','pet-expo','alfie-buddy']
catalog_path=ROOT/'public/images/works/catalog.json'
catalog=json.loads(catalog_path.read_text())
items=[]
for key,area in zip(keys,page['areas']):
    directory=area['preview']; files=manifest[directory]
    source_name=Path(directory).name
    folder=_names.source_directory(catalog_path.parent,catalog,key,source_name)
    target=catalog_path.parent/folder/'动态预览';target.mkdir(parents=True,exist_ok=True)
    for name in files:shutil.copy2(V1/directory.lstrip('/')/name,target/name)
    assets={}
    for name,asset in optimized[directory].items():
        source=V1/asset['optimized'].lstrip('/')
        layers_dir=target.parent/'分层素材';layers_dir.mkdir(exist_ok=True)
        shutil.copy2(source,layers_dir/source.name)
        assets[name]={**asset,'optimized':f'/images/works/{folder}/分层素材/{source.name}'}
    def order(name):
        if name.endswith('.mp4'):return 1
        if name.startswith('背景.'):return 2
        if name.startswith('底部挂件-背'):return 3
        if name.startswith('底部挂件-文'):return 4
        if name.startswith('顶部挂件-背'):return 8
        if name.startswith('顶部挂件-文'):return 9
        return 5
    layers=[{'src':f'/images/works/{folder}/动态预览/{name}','file':name,'x':0,'y':0,'width':1290,'height':2791,'z':order(name)} for name in sorted(files,key=order)]
    catalog[key]={'name':area['label'],'cover':f'/images/works/{folder}/贴片预览.jpg','sourceName':source_name,'folderName':folder,'aliases':list(dict.fromkeys([*catalog.get(key,{}).get('aliases',[]),f'/images/overlay/{key}.jpg'])),'canAnimate':True,'canvas':{'width':1290,'height':2791},'showHost':area.get('showHost',False),'showUi':True,'directory':f'/images/works/{folder}/动态预览','files':files,'assets':assets,'layers':layers}
    # 静态封面直接按 V1 热区坐标裁切原页；不会抓取动画中的随机一帧。
    cover=target.parent/'贴片预览.jpg';scale=4000/1920
    subprocess.run(['sips','-c',str(round(area['height']*scale)),str(round(area['width']*scale)),'--cropOffset',str(round(area['y']*scale)),str(round(area['x']*scale)),'-s','format','jpeg',str(V1/'images'/page['image']),'--out',str(cover)],check=True,capture_output=True)
    items.append({'src':f'/images/works/{folder}/贴片预览.jpg','alt':area['label'],'dynamic':True})
common=ROOT/'public/images/works/shared';common.mkdir(exist_ok=True)
for name in ['douyin-ui.webp','zhubo.webm','zhubo-apple.mov']:
    shutil.copy2(V1/'assets/overlays'/name,common/name)
catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
for relative in ['content/published/home.json','content/draft/home.json','src/modules/OverlayGallery/defaults.json']:
    path=ROOT/relative;data=json.loads(path.read_text())
    props=next(m['props'] for m in data['content'] if m['type']=='OverlayGallery') if 'content' in data else data
    props['items']=items
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('导入 V1 原顺序：毛孩子、猫王猫砂、亚宠展、阿飞和巴弟。')
