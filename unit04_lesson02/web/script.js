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

        // 添加滚动监听，实现磁吸效果
        if (this.pageName === 'overview') {
            this.addScrollListener();
        }
    }

    // 添加滚动监听，检测当前可见的section
    addScrollListener() {
        const container = document.querySelector('#page-overview .section-scroll-container');
        if (!container) return;

        let scrollTimeout;
        const checkVisibleSection = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (this.isScrolling) return;

                const currentItem = this.sections[this.currentSection];
                if (!currentItem) return;

                const rect = currentItem.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // 如果当前section不可见，更新导航
                if (rect.top > viewportHeight || rect.bottom < 0) {
                    // 查找最接近视口中心的section
                    let closestIndex = 0;
                    let closestDistance = Infinity;

                    this.sections.forEach((section, index) => {
                        const sectionRect = section.getBoundingClientRect();
                        const sectionCenter = sectionRect.top + sectionRect.height / 2;
                        const distance = Math.abs(sectionCenter - viewportHeight / 2);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = index;
                        }
                    });

                    if (closestIndex !== this.currentSection) {
                        this.currentSection = closestIndex;
                        this.updateNavigation(closestIndex);
                    }
                }
            }, 100);
        };

        // 监听每个section的滚动
        this.sections.forEach(section => {
            section.addEventListener('scroll', checkVisibleSection, { passive: true });
        });
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

        // 对于课程概述页面，初始化时激活第一个导航项
        if (this.pageName === 'overview' && index === 0) {
            const navItems = document.querySelectorAll('#page-overview .nav-item');
            navItems.forEach(item => item.classList.remove('active'));
        }
    }

    updateNavigation(index) {
        // 只在课程页面更新导航
        if (this.pageName === 'course') {
            this.updateCourseNavigation(index);
        } else if (this.pageName === 'overview') {
            this.updateOverviewNavigation(index);
        }
    }

    updateOverviewNavigation(index) {
        // 获取当前section的data-section值
        const currentSection = this.sections[index];
        if (!currentSection) return;

        const dataSectionValue = currentSection.getAttribute('data-section');
        const navItems = document.querySelectorAll('#page-overview .nav-item');

        // 转换data-section为数字索引
        const numericIndex = parseInt(dataSectionValue) || 0;

        // 磁吸效果：根据当前section激活对应的导航项
        // section 0 (Hero) 不激活任何导航
        // section 1 -> 第1个导航项 (一、课程回顾)
        // section 2 -> 第2个导航项 (二、学习目标)
        // section 3 -> 第3个导航项 (三、课程目录)

        navItems.forEach((item, i) => {
            item.classList.remove('active');
            // 当在section 1,2,3时，激活对应的导航项（索引为numericIndex-1）
            if (numericIndex > 0 && i === numericIndex - 1) {
                item.classList.add('active');
                // 添加磁吸动画效果
                item.style.transform = 'translateX(-8px) scale(1.05)';
                setTimeout(() => {
                    item.style.transform = 'translateX(-5px)';
                }, 200);
            } else {
                item.style.transform = '';
            }
        });
    }

    updateCourseNavigation(index) {

        // 获取当前section的data-section值
        const currentSection = this.sections[index];
        if (!currentSection) return;

        const dataSectionValue = currentSection.getAttribute('data-section');
        const navItems = document.querySelectorAll('#page-course .nav-item');
        const navSubItems = document.querySelectorAll('#page-course .nav-item-sub');

        // 转换data-section为数字索引（用于映射）
        const numericIndex = parseInt(dataSectionValue) || 0;

        // 主导航项激活逻辑
        let activeMainNavIndex = -1;
        if (numericIndex === 0) {
            activeMainNavIndex = 0; // 课程概览
        } else if (numericIndex === 1) {
            activeMainNavIndex = 1; // 一、提示词的作用
        } else if (numericIndex >= 2 && numericIndex <= 8) {
            activeMainNavIndex = 2; // 二、提示词基本结构
        } else if (numericIndex >= 9) {
            activeMainNavIndex = 3; // 三、AI视频脚本编写
        }

        // 更新主导航激活状态
        navItems.forEach((item, i) => {
            if (i === activeMainNavIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 子导航项激活逻辑（映射关系）
        const sectionToSubNavMap = {
            3: 0,  // （一）主体
            4: 1,  // （二）主体动作
            5: 2,  // （三）场景
            6: 3,  // （四）镜头语言
            7: 4,  // （五）光影
            8: 5,  // （六）氛围
            10: 6, // AI脚本的写作结构
            11: 7, // AI脚本的故事结构
            12: 8, // 关键技巧
            13: 9  // 示例
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
                // 并行执行大标题和副标题动画
                typeWriter(h1, '2. AI视频创作提示词攻略', 100);
                typeWriter(subtitle, '掌握AI视频创作的核心技能', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                // 并行执行大标题和副标题动画
                typeWriter(h1, '板块二：课程章节', 100);
                typeWriter(subtitle, '深入学习 AI 视频创作提示词的核心知识', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                // 并行执行大标题和副标题动画
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '练习提示词写作与脚本编写', 50);
            }
        }
    };

    if (animationMap[pageName]) {
        // 立即执行，无延迟
        animationMap[pageName]();
    }
}

// ========================================
// 页面切换功能
// ========================================

let sectionScroller = null;

// 课程概述页面导航栏跳转函数
function overviewScrollToSection(index) {
    if (sectionScroller && sectionScroller.pageName === 'overview') {
        sectionScroller.scrollToSection(index);
    }
}

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
    // 创建背景效果
    createDataRain();
    createParticles();

    // 设置初始激活的导航项
    const navItems = document.querySelectorAll('.navbar-item');
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
    }

    // 初始化课程概述页面的section滚动
    sectionScroller = new SectionScroller('overview');

    // 立即触发打字机动画，无延迟
    triggerPageAnimation('overview');
});

// ========================================
// 性能优化：使用节流函数
// ========================================

function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// ========================================
// 性能优化：使用防抖函数
// ========================================

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}
