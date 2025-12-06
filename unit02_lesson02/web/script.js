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
        } else if (pageName === 'practice') {
            this.scrollIndicator = document.getElementById('scrollIndicatorPractice');
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
        const navSubItems = document.querySelectorAll('#page-course .nav-item-sub');

        // 映射section索引到主导航项和子导航项
        // Section 0: 课程概览
        // Section 1: 板块一 + （一）结构化语言的演进
        // Section 2: 板块一 + （二）Markdown与JSON的关系
        // Section 3: 板块二 + （一）JSON的定义与起源
        // Section 4: 板块二 + （二）JSON的核心特点
        // Section 5: 板块二 + （三）AI为什么离不开JSON
        // Section 6-7: 板块三
        // Section 8: 板块四
        // Section 9: 板块五 + （一）核心回顾

        let activeMainNavIndex = -1;
        let activeSubNavIndex = -1;

        if (index === 0) {
            activeMainNavIndex = 0; // 课程概览
        } else if (index === 1) {
            activeMainNavIndex = 1; // 板块一
            activeSubNavIndex = 0; // （一）结构化语言的演进
        } else if (index === 2) {
            activeMainNavIndex = 1; // 板块一
            activeSubNavIndex = 1; // （二）Markdown与JSON的关系
        } else if (index === 3) {
            activeMainNavIndex = 2; // 板块二
            activeSubNavIndex = 2; // （一）JSON的定义与起源
        } else if (index === 4) {
            activeMainNavIndex = 2; // 板块二
            activeSubNavIndex = 3; // （二）JSON的核心特点
        } else if (index === 5) {
            activeMainNavIndex = 2; // 板块二
            activeSubNavIndex = 4; // （三）AI为什么离不开JSON
        } else if (index >= 6 && index <= 7) {
            activeMainNavIndex = 3; // 板块三
        } else if (index === 8) {
            activeMainNavIndex = 4; // 板块四
        } else if (index === 9) {
            activeMainNavIndex = 5; // 板块五
            activeSubNavIndex = 5; // （一）核心回顾
        }

        // 更新主导航激活状态
        navItems.forEach((item, i) => {
            if (i === activeMainNavIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 更新子导航激活状态
        navSubItems.forEach((item, i) => {
            if (i === activeSubNavIndex) {
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
                typeWriter(h1, '2. AI时代的结构化沟通语言（二）', 100);
                typeWriter(subtitle, 'JSON入门教程 | 让AI听懂你的数据', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '课程章节', 100);
                typeWriter(subtitle, '深入学习 JSON 的核心知识', 50);
            }
        },
        'practice': () => {
            const h1 = document.querySelector('#page-practice .hero h1');
            const subtitle = document.querySelector('#page-practice .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '📝 课后实践', 100);
                typeWriter(subtitle, '动手练习 JSON，巩固所学知识', 50);
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

        // 如果是课程概述页、课程章节页或课后实践页，初始化section滚动
        if (pageName === 'overview' || pageName === 'course' || pageName === 'practice') {
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
    const pageMap = { 'overview': 0, 'course': 1, 'practice': 2 };
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
        '日', '本', '語', '愛', '雨', '桜', '心', '風', '光', '影',
        '{', '}', '[', ']', '"', ':', ',', '0', '1', '2'
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

    // 立即触发打字机动画，无延迟
    triggerPageAnimation('overview');
});
