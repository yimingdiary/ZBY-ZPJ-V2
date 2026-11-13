# coding: utf-8
"""从原导出目录导入静态作品；每件作品统一存入 public/images/works/{id}。"""
from pathlib import Path
import json, shutil
from importlib.util import spec_from_file_location, module_from_spec
_spec=spec_from_file_location("work_directories",Path(__file__).with_name("work-directories.py"));_names=module_from_spec(_spec);_spec.loader.exec_module(_names)
ROOT=Path(__file__).resolve().parent.parent
SOURCE=Path('/Volumes/ZhuBaoyu/设计/ZPJ/1.2.1/img')
PROJECTS=[('ice-cream','260605_贴片_主号_哈根达斯&梦龙'),('crocs','260531_贴片_主号_crocs'),('junlebao','260521_贴片_主号_君乐宝小小鲁班'),('auldey','260522_贴片_主号_奥迪双钻')]
path=ROOT/'public/images/works/catalog.json'
catalog=json.loads(path.read_text())
for key,name in PROJECTS:
    source=SOURCE/name
    layout=json.loads((source/(name+'_layout.json')).read_text())
    folder=_names.source_directory(path.parent,catalog,key,name)
    dest=path.parent/folder;layers_dir=dest/'分层素材';layers_dir.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source/'贴片预览.jpg',dest/'贴片预览.jpg')
    layers,assets=[],{}
    for index,item in enumerate(reversed(list(layout['items'].values()))):
        if item['name']=='贴片预览':continue
        file=source/Path(item['image']).name
        if not file.exists():raise FileNotFoundError(file)
        shutil.copy2(file,layers_dir/file.name)
        url=f'/images/works/{folder}/分层素材/{file.name}'
        assets[file.name]={'kind':'positioned','left':item['x'],'top':item['y'],'width':item['width'],'height':item['height'],'sourceWidth':layout['canvas']['width'],'sourceHeight':layout['canvas']['height'],'optimized':url}
        layers.append({'file':file.name,'src':url,'x':item['x'],'y':item['y'],'width':item['width'],'height':item['height'],'z':index})
    catalog[key]={'name':name,'cover':f'/images/works/{folder}/贴片预览.jpg','sourceName':name,'folderName':folder,'aliases':list(dict.fromkeys([*catalog.get(key,{}).get('aliases',[]),f'/images/overlay/{key}.jpg'])),'canvas':layout['canvas'],'canAnimate':False,'directory':f'/images/works/{folder}/分层素材','files':[l['file'] for l in layers],'assets':assets,'layers':layers}
path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
print('已更新四件静态作品的统一目录，未修改画廊配置。')
