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
            activeMainNavIndex = 1; // 一、AI视频创作概念
        } else if (numericIndex >= 3 && numericIndex <= 4) {
            activeMainNavIndex = 2; // 二、AI视频工具类型
        } else if (numericIndex === 5) {
            activeMainNavIndex = 3; // 三、使用前的准备
        } else if (numericIndex === 6) {
            activeMainNavIndex = 4; // 四、Sora 2界面初识
        } else if (numericIndex === 7) {
            activeMainNavIndex = 5; // 五、实操演练
        } else if (numericIndex === 8) {
            activeMainNavIndex = 6; // 六、进阶功能
        }

        // 更新主导航激活状态
        navItems.forEach((item, i) => {
            if (i === activeMainNavIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 子导航项激活逻辑（只有前4个section有子导航）
        const sectionToSubNavMap = {
            1: 0, 2: 1,  // 一、AI视频创作概念
            3: 2, 4: 3   // 二、AI视频工具类型
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
                typeWriter(h1, '1. 今年最火的AI视频，到底能干啥？', 100);
                typeWriter(subtitle, 'AI视频创作入门 | 从零开始学Sora 2', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                // 并行执行大标题和副标题动画
                typeWriter(h1, '板块二：课程章节', 100);
                typeWriter(subtitle, '深入学习 AI视频创作的核心知识', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                // 并行执行大标题和副标题动画
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '自己生成一个AI视频', 50);
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

    // 立即触发打字机动画，无延迟
    triggerPageAnimation('overview');
});

// ========================================
// 轮播/翻页功能
// ========================================

// 存储每个轮播的当前索引
const carouselStates = {};

// 切换到指定页面
function changeSlide(direction, carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');

    // 初始化状态
    if (!carouselStates[carouselId]) {
        carouselStates[carouselId] = 0;
    }

    // 移除当前激活状态
    slides[carouselStates[carouselId]].classList.remove('active');
    indicators[carouselStates[carouselId]].classList.remove('active');

    // 计算新索引
    carouselStates[carouselId] += direction;

    // 循环处理
    if (carouselStates[carouselId] >= slides.length) {
        carouselStates[carouselId] = 0;
    } else if (carouselStates[carouselId] < 0) {
        carouselStates[carouselId] = slides.length - 1;
    }

    // 激活新页面
    slides[carouselStates[carouselId]].classList.add('active');
    indicators[carouselStates[carouselId]].classList.add('active');
}

// 直接跳转到指定页面
function goToSlide(index, carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');

    // 初始化状态
    if (!carouselStates[carouselId]) {
        carouselStates[carouselId] = 0;
    }

    // 移除当前激活状态
    slides[carouselStates[carouselId]].classList.remove('active');
    indicators[carouselStates[carouselId]].classList.remove('active');

    // 设置新索引
    carouselStates[carouselId] = index;

    // 激活新页面
    slides[carouselStates[carouselId]].classList.add('active');
    indicators[carouselStates[carouselId]].classList.add('active');
}

// 初始化所有轮播
function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const id = carousel.id;
        if (id) {
            carouselStates[id] = 0;
        }
    });
}

// 页面加载时初始化轮播
window.addEventListener('load', () => {
    initCarousels();
});

// ========================================
// 图片放大模态框功能
// ========================================

// 打开图片放大模态框
function openImageModal(container) {
    const img = container.querySelector('img');
    if (!img) return;

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    modalImg.src = img.src;
    modal.classList.add('active');

    // 阻止body滚动
    document.body.style.overflow = 'hidden';
}

// 关闭图片放大模态框
function closeImageModal(event) {
    // 如果点击的是图片本身，不关闭
    if (event.target.tagName === 'IMG') {
        return;
    }

    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');

    // 恢复body滚动
    document.body.style.overflow = '';
}

// ESC键关闭模态框
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
