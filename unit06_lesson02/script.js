// === 打字机特效 ===
function typeWriter(element, text, speed = 100) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// === 赛博朋克背景特效（增强版） ===
// 生成数据雨效果 - 优化版本
function createDataRain() {
    const container = document.getElementById('dataRainContainer');
    if (!container) return;

    // 生成15列数据雨（优化性能，减少DOM元素）
    for (let i = 0; i < 15; i++) {
        const column = document.createElement('div');
        column.className = 'data-rain-column';
        column.style.left = `${i * 6.66}%`; // 调整分布
        column.style.animationDelay = `${i * 0.3}s`;
        column.style.opacity = `${0.3 + Math.random() * 0.4}`;
        column.style.animationDuration = `${2.5 + Math.random() * 2.5}s`;
        container.appendChild(column);
    }
}

// 页面加载后初始化背景特效
window.addEventListener('DOMContentLoaded', () => {
    createDataRain();

    // 初始化打字机效果
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        const text = heroTitle.getAttribute('data-text');
        typeWriter(heroTitle, text, 100);
    }
});

// === 工具函数：节流 ===
function throttle(func, wait) {
    let timeout = null;
    let previous = 0;

    return function() {
        const now = Date.now();
        const remaining = wait - (now - previous);
        const context = this;
        const args = arguments;

        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(context, args);
            }, remaining);
        }
    };
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// 导航栏激活状态（使用节流优化）
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const updateNavigation = throttle(() => {
    let current = '';
    const scrollPosition = window.scrollY + 150;

    // 检查是否在某个章节内容中
    const chapterContents = document.querySelectorAll('.chapter-content');
    let inChapterContent = false;

    chapterContents.forEach(chapter => {
        const chapterTop = chapter.offsetTop;
        const chapterBottom = chapterTop + chapter.offsetHeight;
        if (scrollPosition >= chapterTop && scrollPosition < chapterBottom) {
            current = 'content'; // 如果在任何chapter-content中，高亮"课程内容"
            inChapterContent = true;
        }
    });

    // 如果不在章节内容中，检查其他section
    if (!inChapterContent) {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollPosition >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        // 特殊处理课程内容链接，它指向#chapter1但应该匹配'content'
        if (href && (href.slice(1) === current || (href === '#chapter1' && current === 'content'))) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', updateNavigation);

// ===== 图片预览功能 =====
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightboxBtn = document.getElementById('closeLightbox');

// ===== 整屏导航功能（重构版 - 修复跳页问题） =====
// 按照用户期望的顺序构建滚动目标数组
// 顺序：首页 → 课程回顾 → 学习目标 → 课程章节 → 第一章 → 第二章 → 第三章 → 课后作业
const allSections = [
    document.querySelector('#home'),        // 0: 首页
    document.querySelector('#review'),      // 1: 课程回顾
    document.querySelector('#objectives'),  // 2: 学习目标
    document.querySelector('#chapters'),    // 3: 课程章节
    document.querySelector('#chapter1'),    // 4: 第一章
    document.querySelector('#chapter2'),    // 5: 第二章
    document.querySelector('#chapter3'),    // 6: 第三章
    document.querySelector('#homework')     // 7: 课后作业
].filter(Boolean); // 过滤掉null值

console.log('滚动目标数量:', allSections.length);
console.log('滚动目标列表:', allSections.map((s, i) => `${i}: ${s.id || s.className}`));

const prevBtn = document.getElementById('prevSectionBtn');
const nextBtn = document.getElementById('nextSectionBtn');

// 滚动状态管理
let isScrolling = false; // 滚动锁，防止滚动过程中重复触发
let currentSectionIndex = 0; // 当前所在的section索引

// 获取导航栏高度
function getNavHeight() {
    const navBar = document.querySelector('.nav-bar');
    return navBar ? navBar.offsetHeight : 70;
}

// 获取当前所在的section索引（改进版 - 使用getBoundingClientRect）
function getCurrentSectionIndex() {
    // 如果正在滚动，返回当前记录的索引
    if (isScrolling) {
        return currentSectionIndex;
    }

    const navHeight = getNavHeight();
    const triggerPoint = navHeight + 10; // 导航栏下方10px作为触发点

    // 找到最接近触发点的section
    let bestIndex = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < allSections.length; i++) {
        const section = allSections[i];
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;

        // 计算section顶部到触发点的距离（绝对值）
        const distance = Math.abs(sectionTop - triggerPoint);

        // 如果section顶部在触发点附近（视口上方或稍微下方）
        if (sectionTop <= triggerPoint + 100 && distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
        }
    }

    console.log(`getCurrentSectionIndex: 检测到 section ${bestIndex} [${allSections[bestIndex].id}], 距离: ${bestDistance.toFixed(0)}px`);
    return bestIndex;
}

// 更新按钮状态
function updateButtonStates() {
    const index = getCurrentSectionIndex();
    currentSectionIndex = index; // 更新当前索引

    // 更新上一页按钮
    if (index === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }

    // 更新下一页按钮
    if (index === allSections.length - 1) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }

    console.log(`updateButtonStates: 当前 section ${index} [${allSections[index].id}]`);
}

// 滚动到指定section（使用scrollIntoView，与导航栏相同的方法）
function scrollToSection(index) {
    if (index < 0 || index >= allSections.length) {
        return;
    }

    // 如果正在滚动，忽略
    if (isScrolling) {
        console.log('滚动中，忽略点击');
        return;
    }

    isScrolling = true; // 设置滚动锁

    const oldIndex = currentSectionIndex;
    currentSectionIndex = index; // 更新当前索引

    const targetSection = allSections[index];

    console.log(`========================================`);
    console.log(`点击翻页: ${oldIndex} [${allSections[oldIndex].id}] → ${index} [${targetSection.id}]`);
    console.log(`========================================`);

    // 立即更新按钮状态
    updateButtonStates();

    // 使用 scrollIntoView 方法，与导航栏链接相同的方式
    targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'  // 将元素顶部对齐到视口顶部
    });

    // 监听滚动结束
    let scrollEndTimer;
    const onScrollEnd = () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            isScrolling = false; // 解除滚动锁
            console.log(`滚动结束: 停留在 section ${currentSectionIndex} [${allSections[currentSectionIndex].id}]`);
            window.removeEventListener('scroll', onScrollEnd);
        }, 200); // 滚动停止200ms后认为滚动结束
    };

    window.addEventListener('scroll', onScrollEnd);
    onScrollEnd(); // 立即执行一次
}

// 上一页按钮点击事件
prevBtn.addEventListener('click', () => {
    if (isScrolling) {
        console.log('滚动中，忽略点击');
        return;
    }

    const currentIndex = getCurrentSectionIndex();
    const targetIndex = currentIndex - 1;

    console.log(`点击上一页: 当前 ${currentIndex} → 目标 ${targetIndex}`);

    if (targetIndex >= 0) {
        scrollToSection(targetIndex);
    }
});

// 下一页按钮点击事件
nextBtn.addEventListener('click', () => {
    if (isScrolling) {
        console.log('滚动中，忽略点击');
        return;
    }

    const currentIndex = getCurrentSectionIndex();
    const targetIndex = currentIndex + 1;

    console.log(`点击下一页: 当前 ${currentIndex} → 目标 ${targetIndex}`);

    if (targetIndex < allSections.length) {
        scrollToSection(targetIndex);
    }
});

// 监听滚动事件，更新按钮状态（使用节流优化）
const updateButtonStatesThrottled = throttle(() => {
    // 如果正在执行滚动动画，不更新状态
    if (!isScrolling) {
        updateButtonStates();
    }
}, 150);

window.addEventListener('scroll', updateButtonStatesThrottled);

// 初始化按钮状态
updateButtonStates();

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // 如果lightbox打开，不触发页面导航
    if (lightbox && lightbox.classList.contains('active')) {
        return;
    }

    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevBtn.click();
    } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        nextBtn.click();
    }
});

// 为所有内容图片添加点击事件
function initImageLightbox() {
    const contentImages = document.querySelectorAll('.content-body img');

    contentImages.forEach(img => {
        img.addEventListener('click', function() {
            // 设置lightbox图片源和alt
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightboxCaption.textContent = this.alt || '图片预览';

            // 显示lightbox
            lightbox.classList.add('active');

            // 禁止body滚动
            document.body.style.overflow = 'hidden';
        });
    });
}

// 关闭lightbox函数
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// 点击关闭按钮
closeLightboxBtn.addEventListener('click', closeLightbox);

// 点击背景关闭
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// ESC键关闭
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// 初始化图片预览
initImageLightbox();

// ===== 按钮点击波纹反馈效果 =====
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');

    // 计算波纹的位置
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    // 设置波纹样式
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    // 添加到按钮中
    button.appendChild(ripple);

    // 动画结束后移除波纹元素
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 为所有按钮添加波纹效果（排除导航栏菜单）
const rippleButtons = document.querySelectorAll('.cyber-btn, .section-nav-btn, .back-to-top');
rippleButtons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// ===== 图片懒加载功能 =====
function lazyLoadImages() {
    const images = document.querySelectorAll('.content-body img');

    // 创建 Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // 添加加载中状态
                img.classList.add('loading');

                // 创建新的图片对象来预加载
                const tempImg = new Image();
                tempImg.onload = () => {
                    // 图片加载完成后，移除加载状态，添加加载完成状态
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                };

                tempImg.onerror = () => {
                    // 加载失败也移除loading状态
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    console.warn('图片加载失败:', img.src);
                };

                // 开始加载图片
                tempImg.src = img.src;

                // 停止观察该图片
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.01
    });

    // 观察所有图片
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// 初始化图片懒加载
lazyLoadImages();

// ===== 返回顶部按钮功能 =====
const backToTopBtn = document.getElementById('backToTop');

// 点击按钮返回顶部
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== 页面加载动画控制 =====
window.addEventListener('load', function() {
    const pageLoader = document.getElementById('pageLoader');

    // 延迟150ms后开始淡出
    setTimeout(function() {
        pageLoader.classList.add('fade-out');

        // 500ms后完全移除加载器元素
        setTimeout(function() {
            pageLoader.remove();
        }, 500);
    }, 150);
});
