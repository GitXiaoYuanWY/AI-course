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
            // 重置section内部的滚动位置到顶部
            targetSection.scrollTop = 0;
            
            // 将平滑滚动改为直接滚动，确保立即定位到顶部
            targetSection.scrollIntoView({
                behavior: 'auto',
                block: 'start'
            });

            this.currentSection = index;
            this.updateNavigation(index);

            if (index > 0 && this.scrollIndicator) {
                this.scrollIndicator.classList.add('hidden');
            } else if (index === 0 && this.scrollIndicator) {
                this.scrollIndicator.classList.remove('hidden');
            }

            // 减少延迟时间，提高响应速度
            setTimeout(() => {
                this.isScrolling = false;
            }, 300);
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

        // 主导航项映射
        let activeMainNavIndex = -1;
        if (numericIndex === 0) {
            activeMainNavIndex = 0; // 课程概览
        } else if (numericIndex >= 1 && numericIndex <= 2) {
            activeMainNavIndex = 1; // 一、确定创作需求
        } else if (numericIndex >= 3 && numericIndex <= 4) {
            activeMainNavIndex = 2; // 二、选择主题
        } else if (numericIndex >= 5 && numericIndex <= 14) {
            activeMainNavIndex = 3; // 三、设定情感基调
        } else if (numericIndex === 15) {
            activeMainNavIndex = 4; // 四、分析听众
        } else if (numericIndex >= 16) {
            activeMainNavIndex = 5; // 五、创作方向确定
        }

        // 更新主导航高亮
        navItems.forEach((item, i) => {
            if (i === activeMainNavIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 子导航项映射 (section编号 -> 子导航索引)
        const sectionToSubNavMap = {
            1: 0,   // （一）四个维度
            2: 1,   // （二）案例分析
            3: 2,   // （一）常见主题类型
            4: [3, 4],  // （二）主题与情绪 和 （三）案例说明
            6: 5,   // （一）流派
            9: 6,   // （二）节奏
            10: 7,  // （三）旋律
            11: 8,  // （四）和声
            12: 9,  // （五）音色
            13: 10, // （六）五维度配合
            14: 11, // （七）常见情感类型
            15: 12  // （一）听众群体特征
        };

        // 更新子导航高亮
        navSubItems.forEach((item, i) => {
            const mappedIndices = sectionToSubNavMap[numericIndex];
            if (Array.isArray(mappedIndices)) {
                if (mappedIndices.includes(i)) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            } else if (mappedIndices === i) {
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
                typeWriter(h1, '2. 想让AI写好歌？先想清这一步', 100);
                typeWriter(subtitle, 'AI音乐创作提示词攻略 | 创作逻辑训练课程', 50);
            }
        },
        'course': () => {
            const h1 = document.querySelector('#page-course .hero h1');
            const subtitle = document.querySelector('#page-course .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '板块二：课程章节', 100);
                typeWriter(subtitle, '深入学习 AI 音乐创作的核心逻辑', 50);
            }
        },
        'homework': () => {
            const h1 = document.querySelector('#page-homework .hero h1');
            const subtitle = document.querySelector('#page-homework .hero .subtitle');

            if (h1 && subtitle) {
                typeWriter(h1, '📝 课后作业', 100);
                typeWriter(subtitle, '检验学习成果 | 单选题与判断题', 50);
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
    // 首先移除所有页面的active类
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 直接滚动到顶部，不使用平滑滚动
    window.scrollTo({ top: 0, behavior: 'auto' });

    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        // 先重置页面内部的滚动位置
        const sectionContainers = targetPage.querySelectorAll('.section-scroll-container');
        sectionContainers.forEach(container => {
            container.scrollTop = 0;
        });
        
        // 然后添加active类显示页面
        targetPage.classList.add('active');

        triggerPageAnimation(pageName);

        if (pageName === 'overview' || pageName === 'course' || pageName === 'homework') {
            // 重置SectionScroller实例
            if (sectionScroller) {
                sectionScroller = null;
            }
            // 立即创建新的SectionScroller实例
            sectionScroller = new SectionScroller(pageName);
        }
    }

    // 更新导航栏active状态
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

    sectionScroller = new SectionScroller('overview');
    triggerPageAnimation('overview');
});

// ========================================
// 答题系统
// ========================================

function submitQuiz() {
    // 正确答案
    const correctAnswers = {
        q1: 'B',
        q2: 'B',
        q3: 'C',
        q4: 'B',
        q5: 'B',
        q6: 'D',
        q7: 'true',
        q8: 'true'
    };

    let score = 0;
    let totalQuestions = 8;
    const pointsPerQuestion = 12.5;
    let allAnswered = true;

    // 检查所有题目是否都已回答
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = 'q' + i;
        const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);

        if (!selectedAnswer) {
            allAnswered = false;
            break;
        }
    }

    // 如果有未回答的题目，提示用户
    if (!allAnswered) {
        alert('请完成所有题目后再提交！');
        return;
    }

    // 评分并标记答案
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = 'q' + i;
        const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
        const userAnswer = selectedAnswer.value;
        const correctAnswer = correctAnswers[questionName];

        // 获取当前题目的所有选项
        const questionCard = selectedAnswer.closest('.question-card');
        const allOptions = questionCard.querySelectorAll('.quiz-option');

        // 禁用所有选项，防止再次修改
        questionCard.querySelectorAll('input[type="radio"]').forEach(input => {
            input.disabled = true;
        });

        // 标记正确答案和错误答案
        allOptions.forEach(option => {
            const input = option.querySelector('input[type="radio"]');
            if (input.value === correctAnswer) {
                option.classList.add('correct');
            }
            if (input.checked && input.value !== correctAnswer) {
                option.classList.add('wrong');
            }
        });

        // 显示答案解析
        const explanation = questionCard.querySelector('.answer-explanation');
        if (explanation) {
            explanation.style.display = 'block';
        }

        // 计算分数
        if (userAnswer === correctAnswer) {
            score += pointsPerQuestion;
        }
    }

    // 显示成绩
    const resultDiv = document.getElementById('quiz-result');
    const scoreDisplay = document.getElementById('score-display');
    const resultMessage = document.getElementById('result-message');

    let message = '';
    let color = '';

    if (score === 100) {
        message = '🎉 完美！全部正确！';
        color = 'var(--neon-cyan)';
    } else if (score >= 87.5) {
        message = '👏 优秀！你掌握得很好！';
        color = 'var(--neon-cyan)';
    } else if (score >= 75) {
        message = '👍 良好！继续努力！';
        color = 'var(--neon-purple)';
    } else if (score >= 62.5) {
        message = '📚 及格！还需要多复习哦！';
        color = 'var(--neon-yellow)';
    } else {
        message = '💪 加油！建议重新学习课程内容！';
        color = 'var(--cyber-pink)';
    }

    scoreDisplay.innerHTML = `<span style="color: ${color};">${score} 分</span>`;
    resultMessage.textContent = message;
    resultMessage.style.color = color;

    resultDiv.style.display = 'block';

    // 禁用提交按钮
    const submitBtn = document.querySelector('.submit-quiz-btn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    submitBtn.innerHTML = '<i class="fas fa-check"></i> 已提交';

    // 滚动到成绩显示区域
    setTimeout(() => {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

