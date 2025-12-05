import re

# 读取原HTML文件
with open(r'D:\课件\project1\完整版课件\第一单元\1.现阶段的AI生态与AI工具介绍\ai-ecosystem-guide.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 1. 替换head部分 - 移除style标签,添加外部CSS引用
head_pattern = r'(<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/6\.4\.0/css/all\.min\.css">)\s*<style>.*?</style>'
new_head = r'\1\n    <!-- 本地Font Awesome (TODO: 下载后取消下面注释) -->\n    <!-- <link rel="stylesheet" href="lib/fontawesome/css/all.min.css"> -->\n    \n    <!-- 主样式表 -->\n    <link rel="stylesheet" href="css/style.css">'

html_content = re.sub(head_pattern, new_head, html_content, flags=re.DOTALL)

# 2. 替换script标签为外部JS引用
script_pattern = r'<script>.*?</script>\s*</body>'
new_script = r'<!-- 主脚本文件 -->\n    <script src="js/main.js"></script>\n</body>'

html_content = re.sub(script_pattern, new_script, html_content, flags=re.DOTALL)

# 3. 更新图片路径
# 替换根目录图片路径
html_content = html_content.replace('src="2.语言理解与生成.jpeg"', 'src="images/2.语言理解与生成.jpeg"')
html_content = html_content.replace('src="3.图像理解与生成.png"', 'src="images/3.图像理解与生成.png"')
html_content = html_content.replace('src="4.音视频内容创作.png"', 'src="images/4.音视频内容创作.png"')
html_content = html_content.replace('src="5.数据与逻辑处理.jpeg"', 'src="images/5.数据与逻辑处理.jpeg"')

# 替换图片文件夹路径
html_content = html_content.replace('src="图片/3.应用层/', 'src="images/应用层/')
html_content = html_content.replace('src="图片/4.图像创作工具/', 'src="images/图像创作工具/')
html_content = html_content.replace('src="图片/5.音视频生成工具/', 'src="images/音视频生成工具/')
html_content = html_content.replace('src="图片/6.编程类工具/', 'src="images/编程类工具/')
html_content = html_content.replace('src="图片/7.自动化类工具/', 'src="images/自动化类工具/')
html_content = html_content.replace('src="图片/8.文本创作类工具/', 'src="images/文本创作类工具/')

# 4. 保存新的index.html文件
with open(r'D:\课件\project1\完整版课件\第一单元\1.现阶段的AI生态与AI工具介绍\index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("HTML文件重构完成!")
print("- 已移除内嵌CSS,引用外部css/style.css")
print("- 已移除内嵌JavaScript,引用外部js/main.js")
print("- 已更新所有图片路径到images/文件夹")
