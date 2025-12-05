// ========================================
// 固定视窗滚动系统(来自ai-course)
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

        const numericIndex = parseInt(currentSection.getAttribute('data-section')) || 0;
        const allNavItems = document.querySelectorAll('#page-course .nav-item, #page-course .nav-item-sub');

        // 移除所有active类
        allNavItems.forEach(item => item.classList.remove('active'));

        // 导航项索引映射
        if (numericIndex === 0) {
            allNavItems[0].classList.add('active');
        } else if (numericIndex === 1) {
            allNavItems[1].classList.add('active');
        } else if (numericIndex === 2) {
            allNavItems[2].classList.add('active');
            allNavItems[3].classList.add('active');
        } else if (numericIndex === 3) {
            allNavItems[2].classList.add('active');
            allNavItems[4].classList.add('active');
        } else if (numericIndex === 4) {
            allNavItems[5].classList.add('active');
            allNavItems[6].classList.add('active');
        } else if (numericIndex === 5) {
            allNavItems[5].classList.add('active');
            allNavItems[7].classList.add('active');
        } else if (numericIndex === 6) {
            allNavItems[5].classList.add('active');
            allNavItems[8].classList.add('active');
        } else if (numericIndex === 7) {
            allNavItems[5].classList.add('active');
            allNavItems[9].classList.add('active');
        } else if (numericIndex === 8) {
            allNavItems[5].classList.add('active');
            allNavItems[10].classList.add('active');
        } else if (numericIndex === 9) {
            allNavItems[5].classList.add('active');
            allNavItems[11].classList.add('active');
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
                typeWriter(h1, '8.实战课：文案自动化创作工作流', 100);
                typeWriter(subtitle, '实战案例 | 案例分析 | 案例实现步骤', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '板块二:课程内容', 100);
                typeWriter(subtitle, '实战案例 | 案例分析 | 案例实现步骤', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '课后作业', 100);
                typeWriter(subtitle, '动手实践,巩固知识', 50);
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

// 显示指定Section中指定步骤的内容
function showStepInSection(sectionId, stepIndex) {
    // 根据sectionId获取对应的section元素
    const sectionNumber = sectionId.replace('section', '');
    const section = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (!section) return;

    const stepButtons = section.querySelectorAll('.step-button');
    const stepContents = section.querySelectorAll('.step-content-item');

    // 移除所有active类
    stepButtons.forEach(btn => btn.classList.remove('active'));
    stepContents.forEach(content => content.classList.remove('active'));

    // 添加active类到当前选中的步骤
    if (stepButtons[stepIndex] && stepContents[stepIndex]) {
        stepButtons[stepIndex].classList.add('active');
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

        // 如果是课程概述页、课程章节页或课后作业页,初始化section滚动
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
// 图片切换功能
// ========================================

// 初始化图片切换功能
function initImageNavigation() {
    const containers = document.querySelectorAll('.step-image-container');

    containers.forEach(container => {
        let currentIndex = 0;
        const images = JSON.parse(container.dataset.images || '[]');

        if (images.length <= 1) {
            // 如果只有一张或零张图片,隐藏导航按钮
            const navBtns = container.querySelectorAll('.image-nav-btn');
            const counter = container.querySelector('.image-counter');
            navBtns.forEach(btn => btn.style.display = 'none');
            if (counter) counter.style.display = 'none';

            // 如果有一张图片,显示它
            if (images.length === 1) {
                const placeholder = container.querySelector('.step-image-placeholder');
                placeholder.innerHTML = `<img src="${images[0]}" alt="步骤图片" style="width: 100%; height: 100%; object-fit: contain;">`;
            }
            return;
        }

        const prevBtn = container.querySelector('.image-nav-prev');
        const nextBtn = container.querySelector('.image-nav-next');
        const currentSpan = container.querySelector('.current-image');
        const totalSpan = container.querySelector('.total-images');
        const placeholder = container.querySelector('.step-image-placeholder');

        // 检查是否有描述数组
        const descriptions = container.dataset.descriptions ? JSON.parse(container.dataset.descriptions) : null;
        const descriptionElement = descriptions ? container.parentElement.querySelector('.step-content-description') : null;

        // 更新总图片数
        totalSpan.textContent = images.length;

        // 更新图片显示
        function updateImage() {
            currentSpan.textContent = currentIndex + 1;
            // 显示真实图片
            placeholder.innerHTML = `<img src="${images[currentIndex]}" alt="步骤图片" style="width: 100%; height: 100%; object-fit: contain;">`;

            // 更新描述文字(如果有描述数组)
            if (descriptions && descriptionElement && descriptions[currentIndex]) {
                descriptionElement.innerHTML = descriptions[currentIndex];
            }
        }

        // 上一张
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        });

        // 下一张
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        });

        // 初始化
        updateImage();
    });
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

    // 立即触发打字机动画,无延迟
    triggerPageAnimation('overview');

    // 初始化图片切换功能
    initImageNavigation();
});
