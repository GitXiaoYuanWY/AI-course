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
        }

        this.init();
    }

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

        const navItems = document.querySelectorAll('#page-course .nav-item');
        const navSubItems = document.querySelectorAll('#page-course .nav-item-sub');

        // 移除所有active状态
        navItems.forEach(item => item.classList.remove('active'));
        navSubItems.forEach(item => item.classList.remove('active'));

        // 根据section索引设置active状态
        if (index === 0) {
            // 课程概览
            if (navItems[0]) navItems[0].classList.add('active');
        } else if (index === 1) {
            // 一、MCP自动化生成 - （一）MCP是什么
            if (navItems[1]) navItems[1].classList.add('active');
            if (navSubItems[0]) navSubItems[0].classList.add('active');
        } else if (index === 2) {
            // 一、MCP自动化生成 - （二）应用场景
            if (navItems[1]) navItems[1].classList.add('active');
            if (navSubItems[1]) navSubItems[1].classList.add('active');
        } else if (index === 3) {
            // 一、MCP自动化生成 - （三）流程步骤
            if (navItems[1]) navItems[1].classList.add('active');
            if (navSubItems[2]) navSubItems[2].classList.add('active');
        } else if (index === 4) {
            // 二、自定义节点开发
            if (navItems[2]) navItems[2].classList.add('active');
        } else if (index === 5) {
            // 三、节点与经验分享 - （一）自动化工作流
            if (navItems[3]) navItems[3].classList.add('active');
            if (navSubItems[3]) navSubItems[3].classList.add('active');
        } else if (index === 6) {
            // 三、节点与经验分享 - （二）经验分享
            if (navItems[3]) navItems[3].classList.add('active');
            if (navSubItems[4]) navSubItems[4].classList.add('active');
        } else if (index === 7) {
            // 课程小结
            if (navItems[4]) navItems[4].classList.add('active');
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
                typeWriter(h1, '9.N8N 还有这些隐藏神器？最后一课带你全解锁', 100);
                typeWriter(subtitle, 'MCP自动化生成 | 自定义节点开发 | 经验分享', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '板块二：课程内容', 100);
                typeWriter(subtitle, 'MCP自动化 | 自定义节点 | 实践经验', 50);
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

        triggerPageAnimation(pageName);

        if (pageName === 'overview' || pageName === 'course') {
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
    const pageMap = { 'overview': 0, 'course': 1 };
    if (pageMap[pageName] !== undefined) {
        navItems[pageMap[pageName]].classList.add('active');
    }
}

// ========================================
// MCP流程步骤切换函数
// ========================================

function showMCPStep(stepIndex) {
    const section3 = document.querySelector('#page-course [data-section="3"]');
    if (!section3) return;

    const stepButtons = section3.querySelectorAll('.step-button');
    const stepContents = section3.querySelectorAll('.step-content-item');

    stepButtons.forEach(btn => btn.classList.remove('active'));
    stepContents.forEach(content => content.classList.remove('active'));

    if (stepButtons[stepIndex] && stepContents[stepIndex]) {
        stepButtons[stepIndex].classList.add('active');
        stepContents[stepIndex].classList.add('active');
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

    window.scrollTo(0, 0);

    sectionScroller = new SectionScroller('overview');
    triggerPageAnimation('overview');

    // 添加图片切换功能初始化
    setTimeout(() => {
        initImageNavigation();
    }, 200);
});

// ========================================
// 图片切换功能
// ========================================

/**
 * 初始化单个图片容器
 * @param {HTMLElement} container - 图片容器元素
 */
function initSingleImageContainer(container) {
    // 检查是否已初始化
    if (container.dataset.initialized === 'true') {
        console.log('✅ 容器已初始化，跳过重复初始化');
        return;
    }

    try {
        // 从data属性获取图片和描述
        const imagesData = container.getAttribute('data-images');
        const descriptionsData = container.getAttribute('data-descriptions');

        // 解析图片和描述数组
        const images = imagesData ? JSON.parse(imagesData) : [];
        const descriptions = descriptionsData ? JSON.parse(descriptionsData) : [];

        // 初始化状态
        container.currentIndex = 0;
        container.images = images;
        container.descriptions = descriptions;

        // 获取DOM元素引用
        const imageBox = container.querySelector('.step-image-placeholder');
        const prevBtn = container.querySelector('.image-nav-prev');
        const nextBtn = container.querySelector('.image-nav-next');
        const counter = container.querySelector('.image-counter');

        // 保存DOM元素引用
        container.imageBox = imageBox;
        container.prevBtn = prevBtn;
        container.nextBtn = nextBtn;
        container.counter = counter;

        // 确保所有必要元素都存在
        if (!imageBox || !prevBtn || !nextBtn) {
            console.error('缺少必要的DOM元素，无法初始化图片导航功能');
            return;
        }

        // 定义导航函数
        function goToPreviousImage() {
            if (!container.images || container.images.length === 0) return;
            container.currentIndex = (container.currentIndex - 1 + container.images.length) % container.images.length;
            container.updateImage();
        }

        function goToNextImage() {
            if (!container.images || container.images.length === 0) return;
            container.currentIndex = (container.currentIndex + 1) % container.images.length;
            container.updateImage();
        }

        // 绑定事件监听器
        prevBtn.addEventListener('click', goToPreviousImage);
        nextBtn.addEventListener('click', goToNextImage);

        // 确保按钮可点击
        prevBtn.style.cursor = 'pointer';
        nextBtn.style.cursor = 'pointer';
        prevBtn.style.zIndex = '10';
        nextBtn.style.zIndex = '10';

        // 标记为已初始化
        container.dataset.initialized = 'true';
        console.log('🎉 图片容器初始化成功，共', images.length, '张图片');
    } catch (error) {
        console.error('❌ 初始化图片容器时出错:', error);
    }

    // 定义更新图片显示的方法
    container.updateImage = function() {
        const currentIndex = container.currentIndex;
        const images = container.images || [];
        const descriptions = container.descriptions || [];

        // 更新步骤描述文字
        const descriptionElement = container.parentElement?.querySelector('.step-content-description');
        if (descriptionElement && descriptions && descriptions[currentIndex]) {
            descriptionElement.innerHTML = descriptions[currentIndex];
        }

        // 更新图片内容
        if (container.imageBox && images && images[currentIndex]) {
            let imgElement = container.imageBox.querySelector('img');
            if (imgElement) {
                imgElement.src = images[currentIndex];
            } else {
                container.imageBox.innerHTML = `
                    <img src="${images[currentIndex]}" alt="步骤图片" style="width: 100%; height: 100%; object-fit: contain;">
                `;
            }
        }

        // 更新计数器
        if (container.counter && images.length > 0) {
            container.counter.innerHTML = `<span class="current-image">${currentIndex + 1}</span> / <span class="total-images">${images.length}</span>`;
        }
    };

    // 初始化显示第一张图片
    container.updateImage();
}

/**
 * 初始化所有图片容器
 */
function initImageNavigation() {
    // 只处理具有data-images属性的容器
    const containers = document.querySelectorAll('.step-image-container[data-images]');
    console.log('🔍 找到', containers.length, '个图片容器');

    containers.forEach((container, index) => {
        console.log(`正在初始化第 ${index + 1} 个容器...`);
        initSingleImageContainer(container);
    });
}
