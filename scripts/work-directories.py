# coding: utf-8
"""作品目录命名：保留源名；同名不同作品仅追加稳定区分后缀。"""
from pathlib import Path
from hashlib import sha256

def source_directory(root, catalog, work_id, source_name):
    if not source_name or Path(source_name).name != source_name or source_name in ('.', '..'):
        raise ValueError('源项目名称无效')
    known = catalog.get(work_id, {})
    owners = {w.get('folderName'): key for key,w in catalog.items() if w.get('folderName')}
    if known.get('sourceName') == source_name and known.get('folderName'):
        folder = known['folderName']
        if Path(folder).name != folder or owners.get(folder) != work_id:
            raise ValueError('作品目录归属冲突')
        return folder
    if source_name not in owners and not (root / source_name).exists():
        return source_name
    digest = sha256(work_id.encode('utf-8')).hexdigest()
    for length in (8,16,32,64):
        folder = source_name + '__' + digest[:length]
        if owners.get(folder) == work_id or (folder not in owners and not (root / folder).exists()):
            return folder
    raise FileExistsError('同名作品无法安全创建，请检查目录归属')
