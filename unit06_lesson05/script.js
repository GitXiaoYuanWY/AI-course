// ========================================
// 固定视窗滚动系统
// ========================================

class SectionScroller {
    constructor(pageName = 'overview') {
        this.currentSection = 0;
        this.isScrolling = false;
        this.sections = [];
        this.touchStartY = 0;
        this.duration = 1000;
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

        const navItems = document.querySelectorAll('#page-course .nav-item');

        // 新的导航映射关系（侧边栏从Section 1开始）
        // Section 0: Hero（无侧边导航）
        // Section 1: 一、AI能做什么 -> navItems[0]
        // Section 2: 二、网页三层结构 -> navItems[1]
        // Section 3: 三、读懂HTML -> navItems[2]
        // Section 4: 四、读懂CSS -> navItems[3]
        // Section 5: 五、读懂JavaScript -> navItems[4]
        // Section 6: 六、AI也会犯错 -> navItems[5]
        // Section 7: 七、AI的多样性 -> navItems[6]

        // 清除所有激活状态
        navItems.forEach(item => item.classList.remove('active'));

        // 设置对应的导航项为激活状态（Section 1-7 对应 navItems[0-6]）
        if (index >= 1 && index <= 7) {
            navItems[index - 1].classList.add('active');
        }
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

    // 将文本转换为数组以正确处理emoji等Unicode字符
    const chars = Array.from(text);
    let index = 0;

    function type() {
        if (index < chars.length) {
            element.textContent += chars[index];
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }

    type();
}

function triggerPageAnimation(pageName) {
    const animationMap = {
        'overview': () => {
            const h1 = document.querySelector('#page-overview .hero h1');
            const subtitle = document.querySelector('#page-overview .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '5.理解AI生成的网页逻辑', 100);
                typeWriter(subtitle, '掌握三层结构整合 | 提升AI代码阅读与修改能力', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '课程章节', 100);
                typeWriter(subtitle, '深入理解网页三层结构与AI代码生成', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '实践AI代码分析与优化', 50);
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

        // 初始化section滚动
        if (pageName === 'overview' || pageName === 'course' || pageName === 'homework') {
            setTimeout(() => {
                if (sectionScroller) {
                    sectionScroller = null;
                }
                sectionScroller = new SectionScroller(pageName);
            }, 100);
        }
    }

    // 更新顶部导航栏激活状态
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

    // 触发打字机动画
    triggerPageAnimation('overview');
});

// ========================================
// 互动演示功能
// ========================================

// 智能手表表带选择功能
function selectBand(bandType) {
    const siliconBand = document.getElementById('siliconBand');
    const leatherBand = document.getElementById('leatherBand');
    const priceDisplay = document.getElementById('watchPrice');

    if (!siliconBand || !leatherBand || !priceDisplay) return;

    const basePrice = 6499;
    const leatherPrice = 300;

    if (bandType === 'silicon') {
        // 选择硅胶表带
        siliconBand.classList.add('selected');
        leatherBand.classList.remove('selected');
        priceDisplay.innerHTML = '¥' + basePrice + ' <span style="font-size: 0.6em; font-weight: normal;">起</span>';
    } else if (bandType === 'leather') {
        // 选择皮质表带
        siliconBand.classList.remove('selected');
        leatherBand.classList.add('selected');
        priceDisplay.innerHTML = '¥' + (basePrice + leatherPrice) + ' <span style="font-size: 0.6em; font-weight: normal;">起</span>';
    }
}

// 应用品牌颜色
function applyBrandColor() {
    const colorPicker = document.getElementById('brandColorPicker');
    if (!colorPicker) return;

    const newColor = colorPicker.value;

    // 更新演示元素的颜色
    const demoButton = document.getElementById('demoButton');
    const demoLink = document.getElementById('demoLink');
    const demoBadge = document.getElementById('demoBadge');

    if (demoButton) {
        demoButton.style.background = newColor;
        demoButton.style.boxShadow = `0 4px 15px ${newColor}80`;
    }

    if (demoLink) {
        demoLink.style.color = newColor;
        demoLink.style.borderColor = newColor;
    }

    if (demoBadge) {
        demoBadge.style.background = newColor;
        demoBadge.style.boxShadow = `0 4px 15px ${newColor}80`;
    }

    // 添加视觉反馈
    [demoButton, demoLink, demoBadge].forEach(element => {
        if (element) {
            element.style.transition = 'all 0.5s ease';
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
    });
}

// 重置品牌颜色
function resetBrandColor() {
    const colorPicker = document.getElementById('brandColorPicker');
    const demoButton = document.getElementById('demoButton');
    const demoLink = document.getElementById('demoLink');
    const demoBadge = document.getElementById('demoBadge');

    const defaultColor = '#0a84ff';

    if (colorPicker) {
        colorPicker.value = defaultColor;
    }

    if (demoButton) {
        demoButton.style.background = defaultColor;
        demoButton.style.boxShadow = `0 4px 15px ${defaultColor}80`;
    }

    if (demoLink) {
        demoLink.style.color = defaultColor;
        demoLink.style.borderColor = defaultColor;
    }

    if (demoBadge) {
        demoBadge.style.background = defaultColor;
        demoBadge.style.boxShadow = `0 4px 15px ${defaultColor}80`;
    }

    // 添加视觉反馈
    [demoButton, demoLink, demoBadge].forEach(element => {
        if (element) {
            element.style.transition = 'all 0.5s ease';
            element.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'rotate(0deg) scale(1)';
            }, 500);
        }
    });
}