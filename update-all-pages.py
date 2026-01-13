#!/usr/bin/env python3
# 自动更新所有HTML页面，添加背包改进功能脚本

import os
import re

# 要添加的脚本
scripts_to_add = [
    '<script src="assets/js/item-details.js"></script>',
    '<script src="assets/js/backpack-improvements.js"></script>'
]

def main():
    root_dir = os.getcwd()
    
    # 遍历所有HTML文件
    for root, dirs, files in os.walk(root_dir):
        # 跳过node_modules和.git目录
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
        
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                update_html_file(file_path)

def update_html_file(file_path):
    print(f'正在更新文件: {file_path}')
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经添加了脚本
    has_item_details = 'item-details.js' in content
    has_backpack_improvements = 'backpack-improvements.js' in content
    
    if has_item_details and has_backpack_improvements:
        print(f'文件 {file_path} 已包含所有脚本，跳过。')
        return
    
    # 找到脚本加载位置
    script_pattern = r'<script[^>]+src="assets/js/itemStories\.js"></script>'
    match = re.search(script_pattern, content)
    
    if match:
        # 在itemStories.js脚本后添加新脚本
        new_content = content
        for script in scripts_to_add:
            if script not in content:
                new_content = new_content.replace(match.group(0), match.group(0) + '\n    ' + script)
        
        # 写入更新后的内容
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'文件 {file_path} 已更新。')
    else:
        print(f'文件 {file_path} 未找到itemStories.js脚本，跳过。')

if __name__ == '__main__':
    main()
    print('所有页面更新完成！')