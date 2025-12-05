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

                // 处理1b的特殊情况
                if (dataSectionValue === '1b') {
                    navItems.forEach((item, i) => {
                        if (i === 1) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    navSubItems.forEach((item, i) => {
                        if (i === 1) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                    return;
                }

                // 处理4a、4b、4c的特殊情况（AI节点的三个子页面）
                if (dataSectionValue === '4a' || dataSectionValue === '4b' || dataSectionValue === '4c') {
                    navItems.forEach((item, i) => {
                        if (i === 2) { // 二、基础节点介绍
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    navSubItems.forEach((item, i) => {
                        if (i === 3) { // (二)AI节点
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                    return;
                }

                // 处理6a和6b的特殊情况（工作流实战的两个子页面）
                if (dataSectionValue === '6a') {
                    navItems.forEach((item, i) => {
                        if (i === 3) { // 三、制作简单工作流
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    navSubItems.forEach((item, i) => {
                        if (i === 5) { // (二)工作流逻辑分析
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                    return;
                }

                if (dataSectionValue === '6b') {
                    navItems.forEach((item, i) => {
                        if (i === 3) { // 三、制作简单工作流
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    navSubItems.forEach((item, i) => {
                        if (i === 7) { // (三)工作流技术选型
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    });
                    return;
                }

                const numericIndex = parseInt(dataSectionValue) || 0;
                let activeMainNavIndex = -1;

                // 主导航映射
                // 0: 课程概览, 1: 一、认识N8N界面, 2: 二、基础节点介绍, 3: 三、制作简单工作流, 4: 课程小结
                if (numericIndex === 0) {
                    activeMainNavIndex = 0; // 课程概览
                } else if (numericIndex === 1) {
                    activeMainNavIndex = 1; // 一、认识N8N界面 (section 1主标题，1a和1b已在前面处理)
                } else if (numericIndex >= 2 && numericIndex <= 5) {
                    activeMainNavIndex = 2; // 二、基础节点介绍 (section 2,3,4,5)
                } else if (numericIndex >= 6 && numericIndex <= 8) {
                    activeMainNavIndex = 3; // 三、制作简单工作流 (section 6,8)
                } else if (numericIndex === 9) {
                    activeMainNavIndex = 4; // 课程小结
                }

                navItems.forEach((item, i) => {
                    if (i === activeMainNavIndex) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });

                // 子导航映射
                // sub-items: 0:(一)初始界面, 1:(二)内部工作区, 2:(一)触发节点, 3:(二)AI节点, 4:(三)应用节点, 5:(一)实战案例, 6:(二)工作流逻辑分析, 7:(三)工作流技术选型, 8:(四)操作步骤
                const sectionToSubNavMap = {
                    1: 0,   // section 1: 一、认识N8N界面 → 高亮子导航[0] (一)初始界面
                    2: -1,  // section 2: 二、基础节点介绍 (主标题，不高亮子导航)
                    3: 2,   // section 3: (一)触发节点详解 → 高亮子导航[2]
                    4: -1,  // section 4: (二)AI节点 (主标题，有4a/4b/4c特殊处理)
                    5: 4,   // section 5: (三)应用节点 → 高亮子导航[4]
                    6: 5,   // section 6: (一)实战案例 → 高亮子导航[5]
                    8: 8,   // section 8: (四)操作步骤 → 高亮子导航[8]
                    9: -1   // section 9: 课程小结 (主标题，不高亮子导航)
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
                        typeWriter(h1, '2.第一次用 N8N？用这套节点做个简单工作流', 100);
                        typeWriter(subtitle, '掌握N8N节点基础 | 创建你的第一个自动化工作流', 50);
                    }
                },
                'course': () => {
                    const h1 = document.querySelector('#page-course .hero h1');
                    const subtitle = document.querySelector('#page-course .hero .subtitle');

                    if (h1 && subtitle) {
                        typeWriter(h1, '板块二：课程章节', 100);
                        typeWriter(subtitle, '深入了解 N8N 节点 | 构建自动化工作流', 50);
                    }
                },
                'homework': () => {
                    const h1 = document.querySelector('#page-homework .hero h1');
                    const subtitle = document.querySelector('#page-homework .hero .subtitle');

                    if (h1 && subtitle) {
                        typeWriter(h1, '📝 课后作业', 100);
                        typeWriter(subtitle, '实践出真知 | 创建属于你的自动化工作流', 50);
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
        // Section 1 初始界面步骤切换函数
        // ========================================

        function showStepSection1(stepIndex) {
            console.log('=== showStepSection1 被调用 ===');
            console.log('参数 stepIndex:', stepIndex);

            // 使用ID选择器获取正确的section
            const section1 = document.getElementById('section-n8n-interface');
            console.log('找到 section1:', section1);

            if (!section1) {
                console.error('未找到 section-n8n-interface!');
                return;
            }

            // 获取该section内的所有按钮和内容项
            const stepButtons = section1.querySelectorAll('.step-button');
            const stepContents = section1.querySelectorAll('.step-content-item');

            console.log('找到按钮数量:', stepButtons.length);
            console.log('找到内容项数量:', stepContents.length);

            // 移除所有激活状态
            stepButtons.forEach((btn, index) => {
                console.log(`移除按钮 ${index} 的 active 类`);
                btn.classList.remove('active');
            });
            stepContents.forEach((content, index) => {
                console.log(`移除内容 ${index} 的 active 类`);
                content.classList.remove('active');
            });

            // 激活选中的按钮和内容
            if (stepButtons[stepIndex] && stepContents[stepIndex]) {
                console.log(`激活索引 ${stepIndex} 的按钮和内容`);
                stepButtons[stepIndex].classList.add('active');
                stepContents[stepIndex].classList.add('active');
                console.log('按钮类名:', stepButtons[stepIndex].className);
                console.log('内容类名:', stepContents[stepIndex].className);
            } else {
                console.error(`索引 ${stepIndex} 的按钮或内容不存在!`);
            }

            console.log('=== showStepSection1 执行完成 ===');
        }

        // ========================================
        // Section 1b 内部工作区步骤切换函数
        // ========================================

        function showStepSection1b(stepIndex) {
            console.log('=== showStepSection1b 被调用 ===');
            console.log('参数 stepIndex:', stepIndex);

            // 使用ID选择器获取正确的section
            const section1b = document.getElementById('section-n8n-workspace');
            console.log('找到 section1b:', section1b);

            if (!section1b) {
                console.error('未找到 section-n8n-workspace!');
                return;
            }

            // 获取该section内的所有按钮和内容项
            const stepButtons = section1b.querySelectorAll('.step-button');
            const stepContents = section1b.querySelectorAll('.step-content-item');

            console.log('找到按钮数量:', stepButtons.length);
            console.log('找到内容项数量:', stepContents.length);

            // 移除所有激活状态
            stepButtons.forEach((btn, index) => {
                console.log(`移除按钮 ${index} 的 active 类`);
                btn.classList.remove('active');
            });
            stepContents.forEach((content, index) => {
                console.log(`移除内容 ${index} 的 active 类`);
                content.classList.remove('active');
            });

            // 激活选中的按钮和内容
            if (stepButtons[stepIndex] && stepContents[stepIndex]) {
                console.log(`激活索引 ${stepIndex} 的按钮和内容`);
                stepButtons[stepIndex].classList.add('active');
                stepContents[stepIndex].classList.add('active');
                console.log('按钮类名:', stepButtons[stepIndex].className);
                console.log('内容类名:', stepContents[stepIndex].className);
            } else {
                console.error(`索引 ${stepIndex} 的按钮或内容不存在!`);
            }

            console.log('=== showStepSection1b 执行完成 ===');
        }

        // ========================================
        // Section 8 实操演示步骤切换函数
        // ========================================

        function showStepSection8(stepIndex) {
            console.log('=== showStepSection8 被调用 ===');
            console.log('参数 stepIndex:', stepIndex);

            // 使用ID选择器获取正确的section
            const section8 = document.getElementById('section-demo-practice');
            console.log('找到 section8:', section8);

            if (!section8) {
                console.error('未找到 section-demo-practice!');
                return;
            }

            // 获取该section内的所有按钮和内容项
            const stepButtons = section8.querySelectorAll('.step-button');
            const stepContents = section8.querySelectorAll('.step-content-item');

            console.log('找到按钮数量:', stepButtons.length);
            console.log('找到内容项数量:', stepContents.length);

            // 移除所有激活状态
            stepButtons.forEach((btn, index) => {
                console.log(`移除按钮 ${index} 的 active 类`);
                btn.classList.remove('active');
            });
            stepContents.forEach((content, index) => {
                console.log(`移除内容 ${index} 的 active 类`);
                content.classList.remove('active');
            });

            // 激活选中的按钮和内容
            if (stepButtons[stepIndex] && stepContents[stepIndex]) {
                console.log(`激活索引 ${stepIndex} 的按钮和内容`);
                stepButtons[stepIndex].classList.add('active');
                stepContents[stepIndex].classList.add('active');

                // ✅ 特殊处理：步骤4（send email节点设置，索引为3）
                // ❌ 临时禁用以修复页面JavaScript错误
                /*
                if (stepIndex === 3) {
                    console.log('📧 步骤4（send email）使用专用初始化');
                    // 使用requestAnimationFrame确保DOM已渲染
                    requestAnimationFrame(() => {
                        initSendEmailImageNavigation();
                    });
                } else {
                */
                    // 所有步骤都使用原有的通用初始化逻辑
                    const imageContainer = stepContents[stepIndex].querySelector('.step-image-container[data-images]');
                    if (imageContainer) {
                        requestAnimationFrame(() => {
                            if (imageContainer.dataset.initialized !== 'true') {
                                console.log('🔄 首次激活，初始化图片容器');
                                initSingleImageContainer(imageContainer);
                            } else {
                                console.log('✨ 容器已初始化，直接显示');
                                if (typeof imageContainer.updateImage === 'function') {
                                    imageContainer.updateImage();
                                }
                            }
                        });
                    }
                // }  // ❌ 注释掉这个闭合
            } else {
                console.error(`索引 ${stepIndex} 的按钮或内容不存在!`);
            }

            console.log('=== showStepSection8 执行完成 ===');
        }

        // ========================================

        window.addEventListener('load', () => {
            createDataRain();
            createParticles();

            const navItems = document.querySelectorAll('.navbar-item');
            if (navItems.length > 0) {
                navItems[0].classList.add('active');
            }

            // 滚动到顶部
            window.scrollTo(0, 0);

            sectionScroller = new SectionScroller('overview');
            triggerPageAnimation('overview');

            // 延迟初始化图片切换功能
            setTimeout(() => {
                initImageNavigation();
            }, 200);
        });

        // ========================================
        // 图片切换功能
        // ========================================

        // 初始化单个图片容器
        function initSingleImageContainer(container) {
            // 检查是否已初始化，避免重复初始化
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
                
                // 初始化当前索引和数组引用
                container.currentIndex = 0;
                container.images = images;
                container.descriptions = descriptions;
                
                // 获取已存在的DOM元素引用
                const imageBox = container.querySelector('.step-image-placeholder');
                const prevBtn = container.querySelector('.image-nav-prev');
                const nextBtn = container.querySelector('.image-nav-next');
                const counter = container.querySelector('.image-counter');
                
                // 保存DOM元素引用
                container.imageBox = imageBox;
                container.prevBtn = prevBtn;
                container.nextBtn = nextBtn;
                container.counter = counter;
                
                // 确保所有必要的元素都存在
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

                // 直接绑定事件监听器（只绑定一次）
                prevBtn.addEventListener('click', goToPreviousImage);
                nextBtn.addEventListener('click', goToNextImage);

                // 确保按钮可点击
                prevBtn.style.cursor = 'pointer';
                nextBtn.style.cursor = 'pointer';

                // 为按钮添加样式，确保它们可见
                prevBtn.style.zIndex = '10';
                nextBtn.style.zIndex = '10';

                // 标记容器为已初始化
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
                
                // 检查是否是AI agent节点配置的第三张图片（索引为2）
                const isAIAgentStep = container.parentElement?.querySelector('.step-content-title')?.textContent?.includes('AI agent节点配置');
                const isCodeBlockImage = isAIAgentStep && currentIndex === 2;
                
                // 更新步骤描述文字
                const descriptionElement = container.parentElement?.querySelector('.step-content-description');
                if (descriptionElement && descriptions && descriptions[currentIndex]) {
                    descriptionElement.innerHTML = descriptions[currentIndex];
                }
                
                // 更新图片/代码块内容
                if (container.imageBox) {
                    if (isCodeBlockImage) {
                        // 创建代码块内容
                        container.imageBox.innerHTML = `
                            <div class="code-block-container" style="width: 100%; height: 100%; overflow: auto; background-color: #1a1a1a; border-radius: 8px; padding: 20px; box-sizing: border-box; margin: 0; display: flex; flex-direction: column; justify-content: flex-start; position: relative;">
                                <button class="copy-code-btn" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; z-index: 10;">复制代码</button>
                                <pre style="margin: 0; white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.6; color: #ffffff; align-self: flex-start;"><code># Role: 音乐推荐专家

## Profile
- author: 用户
- version: 1.0
- language: 中文
- description: 一位专业的音乐推荐专家，能够根据用户的时间、心情和场景推荐合适的音乐

## Skills
- 深厚的音乐知识和广泛的音乐类型了解
- 能够根据时间和场景推荐合适的音乐
- 考虑用户心情和偏好的个性化推荐能力
- 熟悉各种音乐流派、艺术家和时代特色

## Rules
1. 推荐音乐时要考虑当前时间（上午、下午、晚上）
2. 根据用户可能的心情状态推荐相应风格的音乐
3. 提供简短的推荐理由，增强用户体验
4. 推荐内容应包含歌曲名、艺术家和简短描述
5. 保持推荐内容的多样性和新鲜感

## Workflows
1. 接收用户的时间和场景信息
2. 分析当前时间段适合的音乐类型
3. 考虑用户可能的心情状态
4. 从音乐库中筛选合适的歌曲
5. 生成个性化推荐内容
6. 提供推荐理由和简短描述

## Init
你好，我是你的专属音乐推荐专家。无论什么时间，什么心情，我都能为你推荐最合适的音乐。请告诉我你现在的情况，让我为你带来美妙的音乐体验！</code></pre>
                            </div>
                        `;
                        
                        // 添加复制功能
                        const copyBtn = container.imageBox.querySelector('.copy-code-btn');
                        const codeContent = container.imageBox.querySelector('code').textContent;
                        
                        copyBtn.addEventListener('click', function() {
                            navigator.clipboard.writeText(codeContent).then(() => {
                                const originalText = copyBtn.textContent;
                                copyBtn.textContent = '已复制!';
                                copyBtn.style.background = 'rgba(0, 255, 0, 0.3)';
                                
                                setTimeout(() => {
                                    copyBtn.textContent = originalText;
                                    copyBtn.style.background = 'rgba(255,255,255,0.2)';
                                }, 2000);
                            }).catch(err => {
                                copyBtn.textContent = '复制失败';
                                setTimeout(() => {
                                    copyBtn.textContent = '复制代码';
                                }, 2000);
                            });
                        });
                    } else {
                        // 更新普通图片内容
                        if (images && images[currentIndex]) {
                            // 检查是否已有img元素，有则更新src，无则创建
                            let imgElement = container.imageBox.querySelector('img');
                            if (imgElement) {
                                imgElement.src = images[currentIndex];
                            } else {
                                container.imageBox.innerHTML = `
                                    <img src="${images[currentIndex]}" alt="步骤图片" style="width: 100%; height: 100%; object-fit: contain;">
                                `;
                            }
                        }
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

        // 复制提示词代码
        function copyPromptCode() {
            const codeBlock = document.querySelector('.prompt-code-block code');
            if (!codeBlock) {
                console.error('❌ 未找到代码块');
                return;
            }

            const textToCopy = codeBlock.textContent;

            // 使用现代Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showCopyFeedback();
                }).catch(err => {
                    console.error('复制失败:', err);
                    fallbackCopyMethod(textToCopy);
                });
            } else {
                // 降级方案
                fallbackCopyMethod(textToCopy);
            }
        }

        // 降级复制方法（兼容旧浏览器）
        function fallbackCopyMethod(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showCopyFeedback();
                } else {
                    console.error('复制命令执行失败');
                }
            } catch (err) {
                console.error('复制失败:', err);
            }

            document.body.removeChild(textarea);
        }

        // 显示复制成功提示
        function showCopyFeedback() {
            const btn = document.querySelector('.copy-prompt-btn');
            if (!btn) return;

            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
            btn.style.background = 'rgba(16, 185, 129, 0.9)';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = 'rgba(6, 182, 212, 0.8)';
            }, 2000);
        }

        // 初始化图片切换功能
        function initImageNavigation() {
            // 只处理具有data-images属性的容器
            const containers = document.querySelectorAll('.step-image-container[data-images]');
            containers.forEach((container, index) => {
                // ❌ 临时禁用send email检测以修复页面JavaScript错误
                /*
                const isSendEmailStep = container.closest('.step-content-item')?.querySelector('.step-content-title')?.textContent?.includes('send email节点设置');

                if (!isSendEmailStep) {
                    initSingleImageContainer(container);
                } else {
                    console.log('⏭️ 跳过send email步骤，将由专用函数initSendEmailImageNavigation处理');
                }
                */

                // 所有容器都用通用初始化
                initSingleImageContainer(container);
            });
        }
