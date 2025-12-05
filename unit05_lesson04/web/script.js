// ========================================
// 固定视窗滚动系统
// ========================================

class SectionScroller {
    constructor(pageName = 'overview') {
        this.currentSection = 0;
        this.isScrolling = false;
        this.sections = [];
        this.touchStartY = 0;
        this.duration = 1000; // 滚动持续时间
        this.pageName = pageName;

        // 根据不同页面获取不同的滚动指示器
        if (pageName === 'overview') {
            this.scrollIndicator = document.getElementById('scrollIndicator');
        } else if (pageName === 'course') {
            this.scrollIndicator = document.getElementById('scrollIndicatorCourse');
        } else if (pageName === 'homework') {
            this.scrollIndicator = document.getElementById('scrollIndicatorHomework');
        }

        this.init();
    }

    init() {
        // 获取当前页面的所有section
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (currentPage) {
            this.sections = Array.from(currentPage.querySelectorAll('.section-scroll-item'));
        }

        // 绑定事件
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) {
            return;
        }

        this.isScrolling = true;
        const targetSection = this.sections[index];

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            this.currentSection = index;

            // 更新导航栏激活状态
            this.updateNavigation(index);

            // 隐藏滚动指示器
            if (index > 0 && this.scrollIndicator) {
                this.scrollIndicator.classList.add('hidden');
            } else if (index === 0 && this.scrollIndicator) {
                this.scrollIndicator.classList.remove('hidden');
            }

            setTimeout(() => {
                this.isScrolling = false;
            }, this.duration);
        }
    }

    updateNavigation(index) {
        // 只在课程页面更新导航
        if (this.pageName !== 'course') return;

        // 获取当前section的data-section值
        const currentSection = this.sections[index];
        if (!currentSection) return;

        const navItems = document.querySelectorAll('#page-course .nav-item');
        const navSubItems = document.querySelectorAll('#page-course .nav-item-sub');

        // 转换data-section为数字索引
        const numericIndex = index;

        // 主导航项激活逻辑
        let activeMainNavIndex = -1;
        if (numericIndex === 0) {
            activeMainNavIndex = 0; // 课程概览
        } else if (numericIndex >= 1 && numericIndex <= 4) {
            activeMainNavIndex = 1; // 一、登录与账号
        } else if (numericIndex >= 5 && numericIndex <= 6) {
            activeMainNavIndex = 2; // 二、主页认识
        } else if (numericIndex >= 7 && numericIndex <= 9) {
            activeMainNavIndex = 3; // 三、创作页面
        } else if (numericIndex >= 10 && numericIndex <= 14) {
            activeMainNavIndex = 4; // 四、自定义模式
        } else if (numericIndex >= 15 && numericIndex <= 16) {
            activeMainNavIndex = 5; // 五、续写功能
        } else if (numericIndex >= 17 && numericIndex <= 19) {
            activeMainNavIndex = 6; // 六、局部编辑
        } else if (numericIndex >= 20) {
            activeMainNavIndex = 7; // 七、角色功能
        }

        // 更新主导航激活状态
        navItems.forEach((item, i) => {
            if (i === activeMainNavIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 子导航项激活逻辑
        const sectionToSubNavMap = {
            1: 0,  // 访问与登录
            2: 1,  // 登录问题
            3: 2,  // 积分机制
            4: 3,  // 版权概念
            5: 4,  // 主页区域
            6: 5,  // 教学用途
            7: 6,  // 进入创作页
            8: 7,  // 两种模式
            9: 8,  // 简单模式
            10: 9,  // 模式结构
            11: 10, // 写歌词方式
            12: 11, // By line改词
            13: 12, // 风格标签
            14: 13, // 复用提示词
            15: 14, // 功能用途
            16: 15, // 操作思路
            17: 16, // 功能定位
            18: 17, // 进入方式
            19: 18, // 核心操作
            20: 19, // 角色介绍
            21: 20, // 创建流程
            22: 21  // 使用创作
        };

        navSubItems.forEach((item, i) => {
            if (sectionToSubNavMap[numericIndex] === i) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    handleWheel(e) {
        if (this.isScrolling) {
            e.preventDefault();
            return;
        }

        const currentSectionElement = this.sections[this.currentSection];
        if (!currentSectionElement) return;

        const target = e.target;
        if (!currentSectionElement.contains(target)) return;

        const { scrollTop, scrollHeight, clientHeight } = currentSectionElement;
        const isAtTop = scrollTop === 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

        // 向下滚动
        if (e.deltaY > 0) {
            if (isAtBottom && this.currentSection < this.sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
            }
        }
        // 向上滚动
        else if (e.deltaY < 0) {
            if (isAtTop && this.currentSection > 0) {
                e.preventDefault();
                this.scrollToSection(this.currentSection - 1);
            }
        }
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        if (this.isScrolling) {
            e.preventDefault();
            return;
        }

        const currentSectionElement = this.sections[this.currentSection];
        if (!currentSectionElement) return;

        const touchEndY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchEndY;

        const { scrollTop, scrollHeight, clientHeight } = currentSectionElement;
        const isAtTop = scrollTop === 0;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

        // 向上滑动
        if (deltaY > 50) {
            if (isAtBottom && this.currentSection < this.sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
                this.touchStartY = touchEndY;
            }
        }
        // 向下滑动
        else if (deltaY < -50) {
            if (isAtTop && this.currentSection > 0) {
                e.preventDefault();
                this.scrollToSection(this.currentSection - 1);
                this.touchStartY = touchEndY;
            }
        }
    }

    handleKeyDown(e) {
        if (this.isScrolling) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                if (this.currentSection < this.sections.length - 1) {
                    e.preventDefault();
                    this.scrollToSection(this.currentSection + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                if (this.currentSection > 0) {
                    e.preventDefault();
                    this.scrollToSection(this.currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                this.scrollToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.scrollToSection(this.sections.length - 1);
                break;
        }
    }
}

// ========================================
// 打字机动画效果
// ========================================

function typeWriter(element, text, speed = 80, callback) {
    if (!element) return;

    element.textContent = '';
    element.style.opacity = '1';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }

    type();
}

function triggerPageAnimation(pageName) {
    // 为不同页面触发不同的打字机动画
    const animationMap = {
        'overview': () => {
            const h1 = document.querySelector('#page-overview .hero h1');
            const subtitle = document.querySelector('#page-overview .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '4. Suno新手必看！7区快速搞懂', 100);
                typeWriter(subtitle, 'AI音乐创作完整教学 | 从入门到精通', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '板块二:课程章节', 100);
                typeWriter(subtitle, '深入学习 Suno AI 音乐创作的核心知识', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '完成 Suno AI 音乐创作实践', 50);
            }
        }
    };

    if (animationMap[pageName]) {
        animationMap[pageName]();
    }
}

// ========================================
// 页面切换功能
// ========================================

let sectionScroller = null;

// 课程页面导航栏跳转函数
function courseScrollToSection(index) {
    if (sectionScroller && sectionScroller.pageName === 'course') {
        sectionScroller.scrollToSection(index);
    }
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 触发打字机动画
        triggerPageAnimation(pageName);

        // 如果是课程概述页、课程章节页或课后作业页，初始化section滚动
        if (pageName === 'overview' || pageName === 'course' || pageName === 'homework') {
            setTimeout(() => {
                if (sectionScroller) {
                    sectionScroller = null;
                }
                sectionScroller = new SectionScroller(pageName);
            }, 100);
        }
    }

    document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
    });

    const navItems = document.querySelectorAll('.navbar-item');
    const pageMap = { 'overview': 0, 'course': 1, 'homework': 2 };
    if (pageMap[pageName] !== undefined) {
        navItems[pageMap[pageName]].classList.add('active');
    }
}

// ========================================
// 数据雨效果
// ========================================

function createDataRain() {
    const dataRain = document.getElementById('dataRain');
    const columns = 15;
    const japaneseChars = [
        'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
        'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
        '日', '本', '語', '愛', '雨', '桜', '心', '風', '光', '影'
    ];

    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.className = 'data-rain-column';
        column.style.left = `${(i / columns) * 100}%`;
        column.style.animationDuration = `${12 + Math.random() * 6}s`;
        column.style.animationDelay = `${Math.random() * 5}s`;

        let chars = '';
        for (let j = 0; j < 15; j++) {
            const char = japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
            const opacity = Math.max(0.05, 1 - (j / 15) * 0.95);
            chars += `<div style="opacity: ${opacity}">${char}</div>`;
        }
        column.innerHTML = chars;

        dataRain.appendChild(column);
    }
}

// ========================================
// 粒子效果
// ========================================

function createParticles() {
    const particleField = document.getElementById('particleField');
    const particleCount = 50;
    const colors = ['#f43f5e', '#a855f7', '#06b6d4'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = colors[i % 3];
        particle.style.boxShadow = `0 0 ${parseInt(particle.style.width) * 2}px currentColor`;
        particle.style.animationDuration = `${3 + Math.random() * 2}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particleField.appendChild(particle);
    }
}

// ========================================
// 页面加载初始化
// ========================================

window.addEventListener('load', () => {
    createDataRain();
    createParticles();

    const navItems = document.querySelectorAll('.navbar-item');
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
    }

    // 初始化课程概述页面的section滚动
    sectionScroller = new SectionScroller('overview');

    // 立即触发打字机动画
    triggerPageAnimation('overview');

    // 初始化图片灯箱功能
    initLightbox();
});

// ========================================
// 图片灯箱功能
// ========================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxContent = document.getElementById('lightboxContent');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const zoomReset = document.getElementById('zoomReset');

    // 缩放和位置状态
    let scale = 1;
    let posX = 0;
    let posY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // 获取所有可点击的图片
    const clickableImages = document.querySelectorAll(
        '.image-container-16-9-content img, ' +
        '.image-container-vertical-content img, ' +
        '.image-container-horizontal-content img, ' +
        '.image-container-wide-content img'
    );

    // 为每张图片添加点击事件
    clickableImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src, img.alt);
        });
    });

    // 打开灯箱
    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetTransform();
    }

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImage.src = '';
            resetTransform();
        }, 300);
    }

    // 重置变换
    function resetTransform() {
        scale = 1;
        posX = 0;
        posY = 0;
        updateTransform();
    }

    // 更新变换
    function updateTransform() {
        lightboxImage.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    }

    // 放大
    function zoomInImage() {
        scale = Math.min(scale + 0.5, 10); // 最大放大10倍
        updateTransform();
    }

    // 缩小
    function zoomOutImage() {
        scale = Math.max(scale - 0.5, 0.5); // 最小缩小到0.5倍
        if (scale === 1) {
            posX = 0;
            posY = 0;
        }
        updateTransform();
    }

    // 鼠标滚轮缩放
    lightboxContent.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        scale = Math.max(0.5, Math.min(10, scale + delta));

        if (scale === 1) {
            posX = 0;
            posY = 0;
        }
        updateTransform();
    });

    // 拖动功能
    lightboxContent.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            lightboxContent.style.cursor = 'grabbing';
        }
    });

    lightboxContent.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateTransform();
        }
    });

    lightboxContent.addEventListener('mouseup', () => {
        isDragging = false;
        if (scale > 1) {
            lightboxContent.style.cursor = 'grab';
        }
    });

    lightboxContent.addEventListener('mouseleave', () => {
        isDragging = false;
        if (scale > 1) {
            lightboxContent.style.cursor = 'grab';
        }
    });

    // 触摸拖动支持（移动端）
    let touchStartX = 0;
    let touchStartY = 0;

    lightboxContent.addEventListener('touchstart', (e) => {
        if (scale > 1 && e.touches.length === 1) {
            touchStartX = e.touches[0].clientX - posX;
            touchStartY = e.touches[0].clientY - posY;
        }
    });

    lightboxContent.addEventListener('touchmove', (e) => {
        if (scale > 1 && e.touches.length === 1) {
            e.preventDefault();
            posX = e.touches[0].clientX - touchStartX;
            posY = e.touches[0].clientY - touchStartY;
            updateTransform();
        }
    });

    // 按钮事件
    lightboxClose.addEventListener('click', closeLightbox);
    zoomIn.addEventListener('click', zoomInImage);
    zoomOut.addEventListener('click', zoomOutImage);
    zoomReset.addEventListener('click', resetTransform);

    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
