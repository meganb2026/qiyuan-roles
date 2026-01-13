#!/usr/bin/env python3
# 自动更新所有对话页面和物品页面，添加背包改进功能脚本

import os
import re

# 要添加的脚本
scripts_to_add = [
    '<script src="../assets/js/item-details.js"></script>',
    '<script src="../assets/js/backpack-improvements.js"></script>'
]

def main():
    root_dir = os.getcwd()
    
    # 处理对话页面
    dialogues_dir = os.path.join(root_dir, 'dialogues')
    if os.path.exists(dialogues_dir):
        update_pages_in_dir(dialogues_dir)
    
    # 处理物品页面
    items_dir = os.path.join(root_dir, 'items')
    if os.path.exists(items_dir):
        update_pages_in_dir(items_dir)
    
    # 处理exchange页面
    exchange_dir = os.path.join(root_dir, 'exchanges')
    if os.path.exists(exchange_dir):
        update_pages_in_dir(exchange_dir)

def update_pages_in_dir(directory):
    for file in os.listdir(directory):
        if file.endswith('.html'):
            file_path = os.path.join(directory, file)
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
    script_pattern = r'<script[^>]+src="../assets/js/itemStories\.js"></script>'
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