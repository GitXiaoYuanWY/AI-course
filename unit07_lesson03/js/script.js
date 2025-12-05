// ========================================
// 固定视窗滚动系统（来自ai-course）
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

        const dataSectionValue = currentSection.getAttribute('data-section');

        const navItems = document.querySelectorAll('#page-course .nav-item');
        const navSubItems = document.querySelectorAll('#page-course .nav-item-sub');

        // 转换data-section为数字索引
        const numericIndex = parseInt(dataSectionValue) || 0;

        // 主导航项激活逻辑
        let activeMainNavIndex = -1;
        if (numericIndex === 0) {
            activeMainNavIndex = 0; // 课程概览
        } else if (numericIndex >= 1 && numericIndex <= 2) {
            activeMainNavIndex = 1; // 一、链接应用之API
        } else if (numericIndex >= 3 && numericIndex <= 6) {
            activeMainNavIndex = 2; // 二、HTTP请求
        } else if (numericIndex >= 7 && numericIndex <= 8) {
            activeMainNavIndex = 3; // 四、社区节点
        } else if (numericIndex === 9) {
            activeMainNavIndex = 4; // 五、实战工作流
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
            1: 0, // API的原理
            2: 1, // 配置deepseek API
            3: 2, // HTTP请求是什么
            4: 3, // HTTP请求节点组成
            5: 4, // 配置HTTP请求
            6: 5, // Webhook节点
            7: 6, // 社区节点在哪里找到？
            8: 7  // 推荐的实用社区节点
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
                typeWriter(h1, '3.API + HTTP 请求这么用，N8N 直接起飞', 100);
                typeWriter(subtitle, 'N8N自动化工作流 | 第三单元课程', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '板块二：课程章节', 100);
                typeWriter(subtitle, '深入学习 API、HTTP请求及社区节点', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '实践所学，巩固知识', 50);
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

// 显示指定步骤的内容（DeepSeek步骤区域）
function showStepDeepSeek(stepIndex) {
    // 1. 先获取当前活跃页面
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        console.error('No active page found');
        return;
    }

    // 2. 在活跃页面内查找section
    const section = activePage.querySelector('[data-section="2"]');
    if (!section) {
        console.error('DeepSeek section not found in active page');
        return;
    }

    const stepsContent = section.querySelector('#deepseek-steps-content');
    if (!stepsContent) {
        console.error('DeepSeek steps content not found');
        return;
    }

    const stepButtons = section.querySelectorAll('.steps-sidebar .step-button');
    const stepContents = stepsContent.querySelectorAll('.step-content-item');

    // 3. 增加防御性检查
    if (stepButtons.length === 0 || stepContents.length === 0) {
        console.warn('DeepSeek - No buttons or contents found. Buttons:', stepButtons.length, 'Contents:', stepContents.length);
        return;
    }

    console.log('DeepSeek - Buttons:', stepButtons.length, 'Contents:', stepContents.length, 'Index:', stepIndex);

    // 移除所有active类
    stepButtons.forEach(btn => btn.classList.remove('active'));
    stepContents.forEach(content => content.classList.remove('active'));

    // 添加active类到当前选中的步骤
    if (stepButtons[stepIndex]) {
        stepButtons[stepIndex].classList.add('active');
    }
    if (stepContents[stepIndex]) {
        stepContents[stepIndex].classList.add('active');
    }
}

// 显示指定步骤的内容（HTTP步骤区域）
function showStepHTTP(stepIndex) {
    // 1. 先获取当前活跃页面
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        console.error('No active page found');
        return;
    }

    // 2. 在活跃页面内查找section
    const section = activePage.querySelector('[data-section="5"]');
    if (!section) {
        console.error('HTTP section not found in active page');
        return;
    }

    const stepsContent = section.querySelector('#http-steps-content');
    if (!stepsContent) {
        console.error('HTTP steps content not found');
        return;
    }

    const stepButtons = section.querySelectorAll('.steps-sidebar .step-button');
    const stepContents = stepsContent.querySelectorAll('.step-content-item');

    // 3. 增加防御性检查
    if (stepButtons.length === 0 || stepContents.length === 0) {
        console.warn('HTTP - No buttons or contents found. Buttons:', stepButtons.length, 'Contents:', stepContents.length);
        return;
    }

    console.log('HTTP - Buttons:', stepButtons.length, 'Contents:', stepContents.length, 'Index:', stepIndex);

    // 移除所有active类
    stepButtons.forEach(btn => btn.classList.remove('active'));
    stepContents.forEach(content => content.classList.remove('active'));

    // 添加active类到当前选中的步骤
    if (stepButtons[stepIndex]) {
        stepButtons[stepIndex].classList.add('active');
    }
    if (stepContents[stepIndex]) {
        stepContents[stepIndex].classList.add('active');
    }
}

// 显示指定步骤的内容（社区节点步骤区域）
function showStepCommunity(stepIndex) {
    // 1. 先获取当前活跃页面
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        console.error('No active page found');
        return;
    }

    // 2. 在活跃页面内查找section
    const section = activePage.querySelector('[data-section="7"]');
    if (!section) {
        console.error('Community section not found in active page');
        return;
    }

    const stepsContent = section.querySelector('#community-steps-content');
    if (!stepsContent) {
        console.error('Community steps content not found');
        return;
    }

    const stepButtons = section.querySelectorAll('.steps-sidebar .step-button');
    const stepContents = stepsContent.querySelectorAll('.step-content-item');

    // 3. 增加防御性检查
    if (stepButtons.length === 0 || stepContents.length === 0) {
        console.warn('Community - No buttons or contents found. Buttons:', stepButtons.length, 'Contents:', stepContents.length);
        return;
    }

    console.log('Community - Buttons:', stepButtons.length, 'Contents:', stepContents.length, 'Index:', stepIndex);

    // 移除所有active类
    stepButtons.forEach(btn => btn.classList.remove('active'));
    stepContents.forEach(content => content.classList.remove('active'));

    // 添加active类到当前选中的步骤
    if (stepButtons[stepIndex]) {
        stepButtons[stepIndex].classList.add('active');
    }
    if (stepContents[stepIndex]) {
        stepContents[stepIndex].classList.add('active');
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

    // 确保步骤切换函数在全局作用域可用
    window.showStepDeepSeek = showStepDeepSeek;
    window.showStepHTTP = showStepHTTP;
    window.showStepCommunity = showStepCommunity;

    console.log('Step functions registered:', {
        showStepDeepSeek: typeof window.showStepDeepSeek,
        showStepHTTP: typeof window.showStepHTTP,
        showStepCommunity: typeof window.showStepCommunity
    });
});
