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

                // 跳过data-section为"1a", "1b", "1c"的section（不在导航栏中显示）
                // 这些section滚动时，保持Section 1的导航高亮
                if (dataSectionValue === '1a' || dataSectionValue === '1b' || dataSectionValue === '1c') {
                    // 主导航：高亮"一、自动化工作流"
                    navItems.forEach((item, i) => {
                        if (i === 1) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    // 子导航：高亮"（一）什么是自动化"
                    navSubItems.forEach((item, i) => {
                        if (i === 0) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                    return;
                }

                // 新增：处理Section 2的子section（2a, 2b, 2c1, 2c2, 2c3, 2c4, 2d）
                if (dataSectionValue === '2a' || dataSectionValue === '2b' ||
                    dataSectionValue === '2c1' || dataSectionValue === '2c2' ||
                    dataSectionValue === '2c3' || dataSectionValue === '2c4' ||
                    dataSectionValue === '2d') {
                    // 主导航：高亮"一、自动化工作流"
                    navItems.forEach((item, i) => {
                        if (i === 1) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    // 子导航：高亮"（二）什么是工作流"（索引1）
                    navSubItems.forEach((item, i) => {
                        if (i === 1) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                    return;
                }

                // 转换data-section为数字索引（用于映射）
                const numericIndex = parseInt(dataSectionValue) || 0;

                // 主导航项激活逻辑（只有Section 0, 1, 4, 8显示主标题）
                let activeMainNavIndex = -1;
                if (numericIndex === 0) {
                    activeMainNavIndex = 0; // 课程概览
                } else if (numericIndex >= 1 && numericIndex <= 3) {
                    activeMainNavIndex = 1; // 一、自动化工作流
                } else if (numericIndex >= 4 && numericIndex <= 7) {
                    activeMainNavIndex = 2; // 二、工具介绍
                } else if (numericIndex >= 8) {
                    activeMainNavIndex = 3; // 三、本地部署
                }

                // 更新主导航激活状态
                navItems.forEach((item, i) => {
                    if (i === activeMainNavIndex) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });

                // 子导航项激活逻辑（一对一映射section索引）
                // navSubItems索引对应：
                // 0 -> Section 1: （一）什么是自动化
                // 1 -> Section 2: （二）什么是工作流
                // 2 -> Section 3: （三）自动化工作流
                // 3 -> Section 4: （一）什么是N8N
                // 4 -> Section 5: （二）N8N能为我做些什么
                // 5 -> Section 6: （三）与其他工具对比
                // 6 -> Section 7: （四）选择N8N的原因
                // 7 -> Section 8: （一）本地部署N8N
                // 8 -> Section 9: （二）后续会用到的软件与工具

                const sectionToSubNavMap = {
                    1: 0, 2: 1, 3: 2,
                    4: 3, 5: 4, 6: 5, 7: 6,
                    8: 7, 9: 8
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
                        typeWriter(h1, 'N8N的安装与部署', 100);
                        typeWriter(subtitle, '软件的介绍及部署 | 自动化工作流入门课程', 50);
                    }
                },
                'course': () => {
                    const h1 = document.querySelector('#page-course .hero h1');
                    const subtitle = document.querySelector('#page-course .hero .subtitle');

                    if (h1 && subtitle) {
                        // 并行执行大标题和副标题动画
                        typeWriter(h1, '板块二：课程章节', 100);
                        typeWriter(subtitle, '深入学习 N8N 自动化工作流的核心知识', 50);
                    }
                },
                'homework': () => {
                    const h1 = document.querySelector('#page-homework .hero h1');
                    const subtitle = document.querySelector('#page-homework .hero .subtitle');

                    if (h1 && subtitle) {
                        // 并行执行大标题和副标题动画
                        typeWriter(h1, '📝 课后作业', 100);
                        typeWriter(subtitle, '完成N8N本地部署验证', 50);
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

        // 显示指定步骤的内容（Section 8 - N8N本地部署）
        function showStep(stepIndex) {
            // 获取Section 8内的所有步骤按钮和内容
            const section8 = document.querySelector('[data-section="8"]');
            if (!section8) return;

            const stepButtons = section8.querySelectorAll('.step-button');
            const stepContents = section8.querySelectorAll('.step-content-item');

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
        // 图片切换功能
        // ========================================

        // 初始化图片切换功能
        function initImageNavigation() {
            const containers = document.querySelectorAll('.step-image-container');

            containers.forEach(container => {
                let currentIndex = 0;
                const images = JSON.parse(container.dataset.images || '[]');

                if (images.length <= 1) {
                    // 如果只有一张或零张图片，隐藏导航按钮
                    const navBtns = container.querySelectorAll('.image-nav-btn');
                    const counter = container.querySelector('.image-counter');
                    navBtns.forEach(btn => btn.style.display = 'none');
                    if (counter) counter.style.display = 'none';

                    // 如果有一张图片，显示它
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

                    // 更新描述文字（如果有描述数组）
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

            // 立即触发打字机动画，无延迟
            triggerPageAnimation('overview');

            // 初始化图片切换功能
            initImageNavigation();
        });
