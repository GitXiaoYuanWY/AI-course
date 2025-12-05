/* ==========================================================================
   AI生态与工具介绍 - 主脚本文件
   ========================================================================== */

// 触发打字机效果
function triggerTypewriterEffect(page) {
    const typewriter = page.querySelector('.typewriter');
    const subtitle = page.querySelector('.typewriter-subtitle');

    if (typewriter) {
        // 重置动画
        typewriter.classList.remove('active');
        typewriter.style.borderRight = '3px solid transparent';

        // 强制重绘
        void typewriter.offsetWidth;

        // 立即启动动画(减少延迟)
        setTimeout(() => {
            typewriter.classList.add('active');
        }, 50);

        // 动画结束后移除光标
        setTimeout(() => {
            typewriter.style.borderRight = 'none';
        }, 2200);
    }

    // 副标题动画(在主标题动画0.5秒后启动)
    if (subtitle) {
        subtitle.classList.remove('active');
        void subtitle.offsetWidth;

        setTimeout(() => {
            subtitle.classList.add('active');
        }, 550);
    }
}

// 页面切换功能
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');

        // 滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // 重置滚动状态,显示滚动提示(仅课程概述页面有滚动提示)
        scrolled = false;
        homeworkScrolled = false;  // 也重置课后作业页面的滚动状态
        const scrollIndicator = targetPage.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.display = 'block';
        }

        // 如果是课程概述页面,重置其内部滚动位置
        if (pageName === 'overview') {
            targetPage.scrollTop = 0;
        }

        // 如果是课后作业页面,重置其内部滚动位置
        if (pageName === 'homework') {
            targetPage.scrollTop = 0;
        }

        // 如果是课程内容页面,重置SectionScroller到第一个section
        if (pageName === 'course') {
            setTimeout(() => {
                if (courseScroller) {
                    courseScroller.scrollToSection(0);
                }
            }, 100);
        }

        // 如果是课程概述页面,重置SectionScroller到第一个section
        if (pageName === 'overview') {
            setTimeout(() => {
                if (overviewScroller) {
                    overviewScroller.scrollToSection(0);
                }
            }, 100);
        }

        // 触发打字机效果
        setTimeout(() => {
            triggerTypewriterEffect(targetPage);
        }, 0);
    }

    // 更新导航栏active状态
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
    });

    // 根据页面名称添加active类
    const navItems = document.querySelectorAll('.navbar-item');
    const pageMap = {
        'overview': 0,
        'course': 1,
        'homework': 2
    };
    if (pageMap[pageName] !== undefined) {
        navItems[pageMap[pageName]].classList.add('active');
    }

    // 关闭移动端菜单
    closeMobileMenu();
}

// 移动端菜单切换
function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    menu.classList.toggle('active');
}

// 关闭移动端菜单
function closeMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    menu.classList.remove('active');
}

// ==================== AI-Course 背景特效生成器 ====================

// 日文字符数据雨效果
function createMatrixRain() {
    // 为所有三个页面的matrix-rain元素生成数据雨
    const matrixRainElements = ['matrixRain', 'matrixRain2', 'matrixRain3'];

    matrixRainElements.forEach(id => {
        const matrixRain = document.getElementById(id);
        if (!matrixRain) return;

        // 日文字符集合(片假名、平假名和汉字)
        const japaneseChars = [
            'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
            'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
            'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
            'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
            'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', '日', '本', '語', '愛',
            '雨', '桜', '心', '風', '光', '影', '夢', '星', '月', '雲',
            '龍', '侍', '忍', '者', '武', '士', '道', '禅', '気', '力',
            '火', '水', '土', '空', '時', '無', '有', '生', '死', '闇',
        ];

        const columns = 15; // 列数
        const charCount = 15; // 每列字符数

        // 创建列
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${(i / columns) * 100}%`;
            column.style.animationDuration = `${12 + Math.random() * 6}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;

            // 创建字符
            for (let j = 0; j < charCount; j++) {
                const charDiv = document.createElement('div');
                charDiv.className = 'matrix-char';
                charDiv.textContent = japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
                column.appendChild(charDiv);
            }

            matrixRain.appendChild(column);
        }
    });

    // 定期随机更新所有字符
    setInterval(() => {
        const japaneseChars = [
            'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
            'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
            'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
            'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
            'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', '日', '本', '語', '愛',
            '雨', '桜', '心', '風', '光', '影', '夢', '星', '月', '雲',
            '龍', '侍', '忍', '者', '武', '士', '道', '禅', '気', '力',
            '火', '水', '土', '空', '時', '無', '有', '生', '死', '闇',
        ];
        const allChars = document.querySelectorAll('.matrix-char');
        allChars.forEach(char => {
            if (Math.random() < 0.1) {
                char.textContent = japaneseChars[Math.floor(Math.random() * japaneseChars.length)];
            }
        });
    }, 50);
}

// 粒子场效果
function createParticleField() {
    // 为所有三个页面的particle-field元素生成粒子
    const particleFieldElements = ['particleField', 'particleField2', 'particleField3'];

    particleFieldElements.forEach(id => {
        const particleField = document.getElementById(id);
        if (!particleField) return;

        const particleCount = 50;
        const colors = ['#f43f5e', '#a855f7', '#06b6d4'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = colors[i % 3];
            const duration = 3 + size;
            const delay = Math.random() * 5;

            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;

            particleField.appendChild(particle);
        }
    });
}

// 故障效果
function initGlitchEffect() {
    // 为所有三个页面的glitch-overlay元素添加故障效果
    const glitchOverlayElements = ['glitchOverlay', 'glitchOverlay2', 'glitchOverlay3'];

    glitchOverlayElements.forEach(id => {
        const glitchOverlay = document.getElementById(id);
        if (!glitchOverlay) return;

        setInterval(() => {
            glitchOverlay.classList.add('active');
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
            }, 200);
        }, 5000);
    });
}

// ==================== 背景特效生成器结束 ====================

// 滚动提示功能(仅用于课程概述页面)
let scrolled = false;
let homeworkScrolled = false;  // 课后作业页面的滚动状态

// 监听课程概述页面的滚动
const overviewPage = document.getElementById('page-overview');
if (overviewPage) {
    overviewPage.addEventListener('scroll', () => {
        const scrollIndicator = overviewPage.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        if (overviewPage.scrollTop <= 50) {
            // 在顶部,显示指示器
            if (scrolled) {
                scrolled = false;
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.display = 'block';
            }
        } else {
            // 不在顶部,隐藏指示器
            if (!scrolled) {
                scrolled = true;
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    scrollIndicator.style.display = 'none';
                }, 300);
            }
        }
    });
}

// 监听课后作业页面的滚动
const homeworkPage = document.getElementById('page-homework');
if (homeworkPage) {
    homeworkPage.addEventListener('scroll', () => {
        const scrollIndicator = homeworkPage.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        if (homeworkPage.scrollTop <= 50) {
            // 在顶部,显示指示器
            if (homeworkScrolled) {
                homeworkScrolled = false;
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.display = 'block';
            }
        } else {
            // 不在顶部,隐藏指示器
            if (!homeworkScrolled) {
                homeworkScrolled = true;
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    scrollIndicator.style.display = 'none';
                }, 300);
            }
        }
    });
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    // 初始化 AI-Course 背景特效
    createMatrixRain();
    createParticleField();
    initGlitchEffect();

    // 初始化滚动提示
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.display = 'block';
    }

    // 默认高亮"课程概述"按钮
    const navItems = document.querySelectorAll('.navbar-item');
    if (navItems.length > 0) {
        navItems[0].classList.add('active');
    }

    // 触发初始页面的打字机效果
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        setTimeout(() => {
            triggerTypewriterEffect(activePage);
        }, 100);
    }
});

// 卡片悬停效果增强
document.querySelectorAll('.cyber-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ==================== 课程内容页面滚动控制 ====================

// ==================== SectionScroller 类 ====================

class SectionScroller {
    constructor(pageName = 'overview') {
        this.currentSection = 0;
        this.isScrolling = false;
        this.sections = [];
        this.navButtons = [];
        this.touchStartY = 0;
        this.duration = 1000; // 滚动持续时间
        this.pageName = pageName;

        // 根据不同页面获取不同的滚动指示器
        if (pageName === 'overview') {
            this.scrollIndicator = document.querySelector('#page-overview .scroll-indicator');
        } else if (pageName === 'course') {
            this.scrollIndicator = document.getElementById('scrollIndicatorCourse');
        }

        this.init();
    }

    init() {
        // 获取当前页面的所有section
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (currentPage) {
            this.sections = Array.from(currentPage.querySelectorAll('.section-scroll-item'));

            // 获取导航按钮(仅课程页面有侧边导航栏)
            if (this.pageName === 'course') {
                this.navButtons = Array.from(currentPage.querySelectorAll('.course-nav button[data-section]'));

                // 绑定导航按钮点击事件
                this.navButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const sectionIndex = parseInt(button.getAttribute('data-section'));
                        this.scrollToSection(sectionIndex);
                    });
                });
            }
        }

        // 为page-course的第一个section添加内部滚动监听
        if (this.pageName === 'course' && this.sections.length > 0) {
            const firstSection = this.sections[0];
            firstSection.addEventListener('scroll', () => {
                if (this.currentSection === 0 && this.scrollIndicator) {
                    if (firstSection.scrollTop > 50) {
                        this.scrollIndicator.classList.add('hidden');
                    } else {
                        this.scrollIndicator.classList.remove('hidden');
                    }
                }
            });
        }

        // 绑定事件
        window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    updateNavigation(index) {
        // 更新导航栏高亮状态
        this.navButtons.forEach(button => {
            const btnSection = parseInt(button.getAttribute('data-section'));
            if (btnSection === index) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
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

            // 更新导航栏高亮
            if (this.pageName === 'course') {
                this.updateNavigation(index);
            }

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

    handleWheel(e) {
        // 只处理当前激活的页面
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (!currentPage || !currentPage.classList.contains('active')) return;

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
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (!currentPage || !currentPage.classList.contains('active')) return;

        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (!currentPage || !currentPage.classList.contains('active')) return;

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
        const currentPage = document.getElementById(`page-${this.pageName}`);
        if (!currentPage || !currentPage.classList.contains('active')) return;

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

// 初始化各个页面的滚动控制
let overviewScroller = null;
let courseScroller = null;

function initSectionScrollers() {
    overviewScroller = new SectionScroller('overview');
    courseScroller = new SectionScroller('course');
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionScrollers);
} else {
    initSectionScrollers();
}

// ==================== SectionScroller 类结束 ====================
