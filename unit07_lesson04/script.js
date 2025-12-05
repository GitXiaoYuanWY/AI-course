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

        if (pageName === 'overview') {
            this.scrollIndicator = document.getElementById('scrollIndicator');
        } else if (pageName === 'course') {
            this.scrollIndicator = document.getElementById('scrollIndicatorCourse');
        } else if (pageName === 'homework') {
            this.scrollIndicator = document.getElementById('scrollIndicatorHomework');
        }

        // 不在构造函数中立即调用init，而是延迟调用
        // this.init();
    }

    // 添加一个单独的初始化方法
    init() {
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (currentPage) {
            this.sections = Array.from(currentPage.querySelectorAll('.section-scroll-item'));
        }

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
            this.updateNavigation(index);

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
        if (this.pageName !== 'course') return;

        const currentSection = this.sections[index];
        if (!currentSection) return;

        const dataSectionValue = currentSection.getAttribute('data-section');
        const navItems = document.querySelectorAll('#page-course .nav-item');
        const navSubItems = document.querySelectorAll('#page-course .nav-item-sub');

        const numericIndex = parseInt(dataSectionValue) || 0;
        let activeMainNavIndex = -1;

        // 主导航映射
        // 0: 课程概览, 1: 一、JSON数据格式, 2: 二、数据处理节点, 3: 三、判断与代码, 4: 四、格式转换, 5: 课程小结
        if (numericIndex === 0) {
            activeMainNavIndex = 0; // 课程概览
        } else if (numericIndex >= 1 && numericIndex <= 4) {
            activeMainNavIndex = 1; // 一、JSON数据格式 (section 1,2,3,4)
        } else if (numericIndex >= 5 && numericIndex <= 8) {
            activeMainNavIndex = 2; // 二、数据处理节点 (section 5,6,7,8)
        } else if (numericIndex >= 9 && numericIndex <= 10) {
            activeMainNavIndex = 3; // 三、判断与代码 (section 9,10)
        } else if (numericIndex === 11) {
            activeMainNavIndex = 4; // 四、格式转换
        } else if (numericIndex === 12) {
            activeMainNavIndex = 5; // 课程小结
        }

        navItems.forEach((item, i) => {
            if (i === activeMainNavIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 子导航映射
        // sub-items: 0:(一)JSON作用, 1:(二)List列表, 2:(三)显示方式, 3:(四)数据读取, 4:(一)常规节点, 5:(二)增删节点, 6:(三)合并节点, 7:(一)Code节点
        const sectionToSubNavMap = {
            1: 0,   // section 1: (一)JSON作用
            2: 1,   // section 2: (二)List列表
            3: 2,   // section 3: (三)显示方式
            4: 3,   // section 4: (四)数据读取
            5: -1,  // section 5: 主标题，不高亮子导航
            6: 4,   // section 6: (一)常规节点
            7: 5,   // section 7: (二)增删节点
            8: 6,   // section 8: (三)合并节点
            9: -1,  // section 9: 三、判断与代码 主标题
            10: 7,  // section 10: (一)Code节点
            11: -1, // section 11: 四、格式转换，不高亮子导航
            12: -1  // section 12: 课程小结，不高亮子导航
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

        if (e.deltaY > 0) {
            if (isAtBottom && this.currentSection < this.sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
            }
        } else if (e.deltaY < 0) {
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

        if (deltaY > 50) {
            if (isAtBottom && this.currentSection < this.sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(this.currentSection + 1);
                this.touchStartY = touchEndY;
            }
        } else if (deltaY < -50) {
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
    const animationMap = {
        'overview': () => {
            const h1 = document.querySelector('#page-overview .hero h1');
            const subtitle = document.querySelector('#page-overview .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '4.数据结构太难？这节课帮你搞定进阶节点', 100);
                typeWriter(subtitle, '掌握JSON数据格式 | 精通N8N数据处理节点', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '板块二：课程章节', 100);
                typeWriter(subtitle, '深入理解数据结构 | 掌握数据处理技巧', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '实践数据处理 | 巩固所学知识', 50);
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

function courseScrollToSection(sectionId) {
    if (sectionScroller && sectionScroller.pageName === 'course') {
        // 将section标识符转换为数组索引
        let targetIndex = 0;

        // 统一处理所有类型的section标识符
        const sections = sectionScroller.sections;
        for (let i = 0; i < sections.length; i++) {
            const dataSection = sections[i].getAttribute('data-section');
            if (dataSection === sectionId.toString()) {
                targetIndex = i;
                break;
            }
        }

        sectionScroller.scrollToSection(targetIndex);
    }
}

// 专门处理滚动到顶部的函数
function scrollToTop() {
    // 立即执行常规页面滚动（不使用平滑滚动，避免干扰）
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 延迟处理section-scroll-container和section-scroll-item的滚动位置
    setTimeout(() => {
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            const scrollContainer = activePage.querySelector('.section-scroll-container');
            if (scrollContainer) {
                // 重置容器滚动位置
                scrollContainer.scrollTop = 0;

                // 只重置当前活动的section-scroll-item的滚动位置
                const activeSection = scrollContainer.querySelector('.section-scroll-item.active') ||
                                     scrollContainer.querySelector('.section-scroll-item');
                if (activeSection) {
                    activeSection.scrollTop = 0;
                }
            }
        }
    }, 50);
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');

        // 立即滚动到顶部
        scrollToTop();

        triggerPageAnimation(pageName);

        if (pageName === 'overview' || pageName === 'course' || pageName === 'homework') {
            setTimeout(() => {
                if (sectionScroller) {
                    sectionScroller = null;
                }
                sectionScroller = new SectionScroller(pageName);

                // 强制滚动到顶部
                scrollToTop();

                // 在确保滚动到顶部后，再初始化SectionScroller
                setTimeout(() => {
                    sectionScroller.init();
                }, 100);
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

    // 确保页面加载时滚动到顶部
    scrollToTop();

    sectionScroller = new SectionScroller('overview');
    triggerPageAnimation('overview');

    // 再次确保页面加载后滚动到顶部
    setTimeout(() => {
        scrollToTop();
    }, 200);
});
