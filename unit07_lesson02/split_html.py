#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML文件拆分脚本
将单文件HTML拆分成独立的CSS、HTML和JavaScript文件
"""

import os
import sys

# 文件路径
base_dir = r"D:\课件\project1\完整版课件\第一单元\2.认识节点并做一个简单的工作流"
html_file = os.path.join(base_dir, "index.html")
css_dir = os.path.join(base_dir, "css")
js_dir = os.path.join(base_dir, "js")
css_file = os.path.join(css_dir, "styles.css")
js_file = os.path.join(js_dir, "main.js")

print("开始读取HTML文件...")
with open(html_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"文件总行数: {len(lines)}")

# 提取CSS (第11-1350行，跳过第10行的@import)
print("\n提取CSS代码...")
css_content = ''.join(lines[11:1350])  # Python索引从0开始，所以11对应第12行
print(f"CSS行数: {len(lines[11:1350])}")

# 提取JavaScript (第2318-3232行)
print("\n提取JavaScript代码...")
js_content = ''.join(lines[2317:3232])  # 第2318-3232行
print(f"JavaScript行数: {len(lines[2317:3232])}")

# 写入CSS文件
print("\n写入CSS文件...")
with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css_content)
print(f"CSS文件已保存: {css_file}")

# 写入JavaScript文件
print("\n写入JavaScript文件...")
with open(js_file, 'w', encoding='utf-8') as f:
    f.write(js_content)
print(f"JavaScript文件已保存: {js_file}")

# 重构HTML文件
print("\n重构HTML文件...")
new_html_lines = []

# 添加HTML头部 (第1-8行)
new_html_lines.extend(lines[0:8])

# 添加CSS引用
new_html_lines.append('    <link rel="stylesheet" href="css/styles.css">\n')

# 添加HTML主体 (第1352-2316行)
new_html_lines.append('</head>\n')  # 第9行的</head>标签
new_html_lines.extend(lines[1351:2316])

# 添加JavaScript引用
new_html_lines.append('    <script src="js/main.js"></script>\n')

# 添加HTML闭合标签
new_html_lines.extend(lines[3233:3235])

# 写入新的HTML文件
print("写入新的HTML文件...")
with open(html_file, 'w', encoding='utf-8') as f:
    f.writelines(new_html_lines)

print(f"\n新HTML文件行数: {len(new_html_lines)}")
print("\n文件拆分完成！")
print(f"✓ CSS文件: {css_file}")
print(f"✓ JavaScript文件: {js_file}")
print(f"✓ HTML文件已重构: {html_file}")
