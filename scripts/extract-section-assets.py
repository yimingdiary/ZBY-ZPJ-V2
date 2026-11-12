# coding: utf-8
from pathlib import Path
import re,copy,json,xml.etree.ElementTree as E
import os
os.chdir(Path(__file__).resolve().parent.parent)
ns='http://www.w3.org/2000/svg';E.register_namespace('',ns)
def load(n):
 root=E.parse(f'cankao/261105_ZBY_ZPJ_V2,0_内页_{n}.svg').getroot();style=root.find(f'{{{ns}}}defs/{{{ns}}}style').text;rules=[]
 for sel,body in re.findall(r'([^{}]+)\{([^{}]+)\}',style):rules.append((set(re.findall(r'\.([\w-]+)',sel)),dict(re.findall(r'([\w-]+)\s*:\s*([^;]+)',body))))
 return root,rules
r,rules=load('20')
def styled(n):
 el=copy.deepcopy(n)
 for item in el.iter():
  classes=set(item.attrib.pop('class','').split())
  for sels,props in rules:
   if classes&sels:
    for k,v in props.items(): item.set(k,v.strip())
 return el
out=E.Element(f'{{{ns}}}svg',{'viewBox':'117 323 1696 298','fill':'none'})
# Only title guides, not Photoshop chrome.
g=next(g for g in r if any(t.tag.endswith('text') and ''.join(t.itertext())=='T' for t in g.iter()))
for item in g:
 if item.tag.split('}')[-1] in ('line','circle'):out.append(styled(item))
E.indent(out);E.ElementTree(out).write('public/decorations/closing-guides.svg',encoding='unicode')
flower=E.Element(f'{{{ns}}}svg',{'viewBox':'1070 400 135 150'})
flower.append(styled(next(n for n in g if n.tag.endswith('path'))));E.indent(flower);E.ElementTree(flower).write('public/decorations/closing-flower.svg',encoding='unicode')
layouts=[]
for char in 'THANKYOU':
 text=next(t for t in r.iter(f'{{{ns}}}text') if ''.join(t.itertext())==char)
 st=styled(text);layouts.append({'char':char,'transform':text.get('transform'),'size':float(st.get('font-size').replace('px','')),'font':'accent' if 'GEYSTER' in st.get('font-family','').upper() else 'display'})
Path('src/modules/Closing/letters.json').write_text(json.dumps(layouts,indent=2)+'\n')
r,rules=load('03')
# Extract source guide geometry grouped by category center (all are in the central region).
shapes=[]
for t in r.iter():
 tag=t.tag.split('}')[-1]
 if tag=='line':
  x=float(t.get('x1',0));y=float(t.get('y1',0))
  if 250<x<1660 and 450<y<670: shapes.append(t)
 elif tag=='circle':
  x=float(t.get('cx',0));y=float(t.get('cy',0))
  if 250<x<1660 and 450<y<670: shapes.append(t)
for i,center in enumerate([371,755,1145,1535]):
 out=E.Element(f'{{{ns}}}svg',{'viewBox':f'{center-110} 450 220 220','fill':'none','preserveAspectRatio':'none'})
 for t in shapes:
  x=float(t.get('x1',t.get('cx',0)))
  if abs(x-center)<110:out.append(styled(t))
 E.indent(out);E.ElementTree(out).write(f'public/decorations/contents-{i+1}-guides.svg',encoding='unicode')
 print('category',i+1,'shapes',len(out))
