"""从用户提供的参考 SVG 直接提取线框原素材；不重绘、取整或更改颜色。"""
from pathlib import Path
import copy,re,xml.etree.ElementTree as E
root=Path(__file__).resolve().parent.parent
source=root/'cankao/261105_ZBY_ZPJ_V2,0_内页_01.svg'
svg=E.parse(source).getroot();ns='http://www.w3.org/2000/svg'
E.register_namespace('',ns)
style=svg.find(f'{{{ns}}}defs/{{{ns}}}style').text
rules=[]
for selectors,body in re.findall(r'([^{}]+)\{([^{}]+)\}',style):
 props=dict(re.findall(r'([\w-]+)\s*:\s*([^;]+)',body))
 rules.append((set(re.findall(r'\.([\w-]+)',selectors)),props))
out=E.Element(f'{{{ns}}}svg',{'viewBox':'117 323 1696 298','fill':'none'})
for node in svg:
 if node.tag.split('}')[-1] not in ('line','circle'):continue
 item=copy.deepcopy(node);classes=set(item.attrib.pop('class','').split())
 for selectors,props in rules:
  if classes&selectors:
   for k,v in props.items():item.set(k,v.strip())
 out.append(item)
path=root/'public/decorations/portfolio-guides.svg'
path.parent.mkdir(parents=True,exist_ok=True)
E.indent(out)
E.ElementTree(out).write(path,encoding='unicode',xml_declaration=False)
print(f'{path.name}: {len(out)} source elements')
