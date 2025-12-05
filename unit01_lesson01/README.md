# AI生态课件项目 - 重构说明

## 项目概述

本项目已从单一HTML文件重构为模块化的项目结构,实现了CSS、JavaScript和HTML的分离,便于后期维护和管理。

## 当前项目结构

```
1.现阶段的AI生态与AI工具介绍/
├── ai-ecosystem-guide.html     # 原始HTML文件(备份)
├── index.html                   # 新的主HTML文件
├── css/
│   ├── style.css               # 主样式文件(37KB)
│   └── fonts/                  # 本地字体文件夹(待添加)
│       ├── orbitron/
│       └── rajdhani/
├── js/
│   └── main.js                 # 主脚本文件(21KB)
├── images/                      # 所有图片资源(30个文件)
│   ├── 2.语言理解与生成.jpeg
│   ├── 3.图像理解与生成.png
│   ├── 4.音视频内容创作.png
│   ├── 5.数据与逻辑处理.jpeg
│   ├── 应用层/
│   ├── 图像创作工具/
│   ├── 音视频生成工具/
│   ├── 编程类工具/
│   ├── 自动化类工具/
│   └── 文本创作类工具/
└── lib/                         # 第三方库(待添加)
    └── fontawesome/
```

## 已完成的工作

✅ **目录结构创建** - 所有必需的文件夹已创建完成
✅ **图片资源整合** - 30个图片文件已复制到images文件夹,路径已更新
✅ **CSS代码拆分** - 1683行CSS代码已提取到css/style.css
✅ **JavaScript代码拆分** - 659行JavaScript代码已提取到js/main.js
✅ **HTML文件重构** - index.html已创建,引用外部CSS和JS文件

## 待完成的工作

### 1. 下载Font Awesome到本地 (可选但推荐)

当前使用CDN链接,建议下载到本地以实现完全离线:

**下载步骤:**
1. 访问 https://fontawesome.com/download
2. 下载 Font Awesome Free 6.4.0版本
3. 解压并复制以下文件到 `lib/fontawesome/`:
   - `css/all.min.css`
   - `webfonts/` 文件夹(所有字体文件)

**修改index.html:**
```html
<!-- 取消下面注释并删除CDN链接 -->
<link rel="stylesheet" href="lib/fontawesome/css/all.min.css">
```

### 2. 下载Google Fonts到本地 (可选但推荐)

当前在css/style.css中使用CDN链接,建议本地化:

**需要的字体:**
- **Orbitron** (字重: 400, 500, 600, 700, 800, 900)
- **Rajdhani** (字重: 300, 400, 500, 600, 700)

**下载方式:**
1. 访问 https://fonts.google.com/
2. 搜索并下载 Orbitron 和 Rajdhani 字体
3. 将字体文件(.woff2格式优先)放入对应的 `css/fonts/` 子目录

**修改css/style.css:**
```css
/* 删除或注释掉第21行的@import语句 */
/* @import url('https://fonts.googleapis.com/...'); */

/* 添加@font-face规则 */
@font-face {
    font-family: 'Orbitron';
    src: url('fonts/orbitron/orbitron-v31-latin-regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}
/* ... 其他字重省略 ... */
```

## 技术特性

- **响应式设计** - 支持桌面、平板和移动设备
- **赛博朋克风格** - 霓虹灯效果、渐变色、动画特效
- **背景特效** - 日文字符数据雨、粒子场、故障效果
- **页面切换** - 打字机效果、平滑过渡动画
- **滚动控制** - Section Scroll实现,磁吸式滚动体验
- **侧边导航** - 课程内容页面的快捷导航栏

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 开发说明

### 修改样式
所有样式都在 `css/style.css` 中,使用CSS变量定义颜色主题:
```css
:root {
    --cyber-pink: #f43f5e;
    --neon-purple: #a855f7;
    --neon-cyan: #06b6d4;
    ...
}
```

### 修改脚本
所有JavaScript功能都在 `js/main.js` 中,主要功能包括:
- `showPage()` - 页面切换
- `createMatrixRain()` - 数据雨效果
- `SectionScroller` - 滚动控制类

### 添加图片
将新图片放入 `images/` 相应子文件夹,然后在HTML中使用:
```html
<img src="images/你的图片.jpg" alt="描述">
```

## 文件大小对比

| 文件 | 原始大小 | 重构后 |
|------|---------|--------|
| HTML | 138KB | 64KB (-54%) |
| CSS | (内嵌) | 37KB |
| JS | (内嵌) | 21KB |
| **总计** | **138KB** | **122KB** (+ 更好的可维护性) |

## 优势

1. **可维护性提升** - CSS、JavaScript和HTML分离,便于独立修改
2. **代码复用** - 外部CSS和JS可被其他页面引用
3. **浏览器缓存** - 静态资源可被缓存,提升加载速度
4. **团队协作** - 不同开发者可同时修改不同文件
5. **版本控制友好** - Git能更好地追踪文件变更

## 注意事项

⚠️ **图片路径** - 确保图片文件在 `images/` 文件夹中,否则会显示失败
⚠️ **文件编码** - 所有文件使用 UTF-8 编码
⚠️ **网络依赖** - 当前Font Awesome和字体依赖CDN,建议按上述步骤本地化

## 更新日志

**2024-11-27**
- ✅ 项目结构创建
- ✅ CSS/JS代码拆分
- ✅ 图片资源整合
- ✅ HTML文件重构
- ⏳ 待本地化Font Awesome和Google Fonts

---

**提示**: 要实现完全离线访问,请完成"待完成的工作"中的两项任务。
