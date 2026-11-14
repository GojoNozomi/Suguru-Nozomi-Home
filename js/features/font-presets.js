/* 🔤 我的字体 —— 预设 + 自存字体列表 */
(function () {
    'use strict';

    var LIST_ID = 'font-preset-list';
    var FB_LINK_ID = 'font-fallback-link';

    // 兜底字体：缺字时用它补，保持圆润风格一致
    var FB_URL = 'https://cdn.jsdelivr.net/npm/cn-fontsource-975-maru-sc-medium-regular@1.0.1/font.css';
    var FB_FAMILY = '975Maru SC Medium';

    var PRESETS = [
        { id: 'default',  name: '默认（系统字体）', meta: '跟随系统默认', url: '' },

        { id: 'p975m',    name: '975 圆体（中细）', meta: '圆体 · 细 · 推荐',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-975-maru-sc-medium-regular@1.0.1/font.css' },
        { id: 'yozail',   name: '悠哉字体（细）', meta: '手写 · 很细 · 轻快',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-yozai-light-regular@1.0.9/font.css' },
        { id: 'xiaolaim', name: '小赖字体（等宽）', meta: '手写等宽 · 细',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-xiaolai-mono-sc-regular@1.0.3/font.css' },
        { id: 'marker',   name: '霞鹜漫黑', meta: '马克笔漫画感',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-marker-gothic-regular@1.0.1/font.css' },
        { id: 'popkaku',  name: '梨沙POP体', meta: 'POP 可爱 · 缺字自动补 975圆体',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-rii-popkaku-r-regular@1.0.3/font.css',
          fbUrl: FB_URL, fb: FB_FAMILY },

        { id: 'p975',     name: '975 圆体', meta: '圆体 · 中细',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-975-maru-sc-regular@1.0.1/font.css' },
        { id: 'xiaolai',  name: '小赖字体', meta: '手写 · 细 · 活泼',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-xiaolai-sc-regular@1.0.2/font.css' },
        { id: 'yozai',    name: '悠哉字体', meta: '手写 · 细 · 轻快',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-yozai-regular@1.0.9/font.css' },
        { id: 'wenkai',   name: '霞鹜文楷', meta: '楷体 · 易读',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-wen-kai-gb-screen@1.0.6/font.css' },
        { id: 'maoken',   name: '猫啃珠圆体', meta: '圆润 · 偏粗',
          url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-maoken-zhuyuan-ti-regular@1.0.1/font.css' }
    ];

    function key() {
        try {
            if (typeof getStorageKey === 'function') return getStorageKey('fontFavorites');
        } catch (e) {}
        return 'fontFavorites';
    }

    function loadFavs() {
        try {
            var arr = JSON.parse(localStorage.getItem(key()) || '[]');
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    function saveFavs(list) {
        try { localStorage.setItem(key(), JSON.stringify(list)); } catch (e) {}
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function currentUrl() {
        try {
            if (typeof settings !== 'undefined' && settings && settings.customFontUrl) return settings.customFontUrl;
        } catch (e) {}
        return '';
    }

    function nameFromUrl(u) {
        if (!u) return '默认（系统字体）';
        var preset = PRESETS.filter(function (x) { return x.url && x.url === u; })[0];
        if (preset) return preset.name;
        var m = u.match(/cn-fontsource-([^@\/]+)/);
        if (m) return m[1].replace(/-/g, ' ');
        var last = u.split('/').pop().split('?')[0];
        return last || '自定义字体';
    }

    function all() {
        return PRESETS.concat(loadFavs());
    }

    function injectFallback(url) {
        return new Promise(function (resolve) {
            var link = document.getElementById(FB_LINK_ID);
            if (!link) {
                link = document.createElement('link');
                link.id = FB_LINK_ID;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
            link.href = url;
            setTimeout(resolve, 500);
        });
    }

    async function applyFontObject(p) {
        var inp = document.getElementById('custom-font-url');
        if (inp) inp.value = p.url || '';

        try {
            if (typeof settings !== 'undefined' && settings) {
                settings.customFontUrl = p.url || '';
                settings.customFontFallback = p.fb ? [p.fb] : null;
            }
        } catch (e) {}

        if (p.fbUrl) await injectFallback(p.fbUrl);

        if (typeof applyCustomFont === 'function') {
            await applyCustomFont(p.url, p.fb ? [p.fb] : null);
        }
        if (typeof throttledSaveData === 'function') throttledSaveData();

        render();
        if (typeof showNotification === 'function') {
            showNotification(p.url ? ('已应用：' + p.name) : '已恢复默认字体', 'success');
        }
    }

    function removeFav(id) {
        var favs = loadFavs().filter(function (x) { return x.id !== id; });
        saveFavs(favs);
        render();
        if (typeof showNotification === 'function') showNotification('已从我的字体移除', 'success');
    }

    function itemHTML(p) {
        var active = (p.url || '') === currentUrl();
        var isCustom = String(p.id).indexOf('u-') === 0;
        return '<div class="theme-scheme-item" data-font-id="' + esc(p.id) + '">' +
            '<div class="scheme-info">' +
            '<div class="scheme-name">' + esc(p.name) + (active ? ' <span style="font-size:10px;color:var(--accent-color);">使用中</span>' : '') + '</div>' +
            '<div class="scheme-meta">' + esc(p.meta || '自定义') + '</div>' +
            '</div>' +
            '<div class="scheme-actions">' +
            '<button class="scheme-action-btn" data-apply="' + esc(p.id) + '" title="应用这个字体" style="' + (active ? 'color:var(--accent-color);' : '') + '"><i class="fas fa-check"></i></button>' +
            (isCustom ? '<button class="scheme-action-btn delete" data-del="' + esc(p.id) + '" title="从列表移除"><i class="fas fa-times"></i></button>' : '') +
            '</div>' +
            '</div>';
    }

    function render() {
        var box = document.getElementById(LIST_ID);
        if (!box) return;
        box.innerHTML = all().map(itemHTML).join('');

        Array.prototype.forEach.call(box.querySelectorAll('[data-apply]'), function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = btn.getAttribute('data-apply');
                var p = all().filter(function (x) { return x.id === id; })[0];
                if (p) applyFontObject(p);
            });
        });

        Array.prototype.forEach.call(box.querySelectorAll('[data-del]'), function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = btn.getAttribute('data-del');
                if (!confirm('从"我的字体"里移除这个字体？')) return;
                removeFav(id);
            });
        });

        Array.prototype.forEach.call(box.querySelectorAll('.theme-scheme-item'), function (el) {
            el.addEventListener('click', function (e) {
                if (e.target.closest('button')) return;
                var id = el.getAttribute('data-font-id');
                var p = all().filter(function (x) { return x.id === id; })[0];
                if (p) applyFontObject(p);
            });
        });
    }

    function saveCurrent() {
        var inp = document.getElementById('custom-font-url');
        var url = inp ? (inp.value || '').trim() : '';
        if (!url) {
            if (typeof showNotification === 'function') showNotification('请先在输入框里粘贴字体链接', 'info');
            return;
        }
        var favs = loadFavs();
        if (favs.some(function (x) { return x.url === url; })) {
            if (typeof showNotification === 'function') showNotification('这个字体已经在列表里了', 'info');
            return;
        }
        favs.unshift({ id: 'u-' + Date.now(), name: nameFromUrl(url), meta: '我保存的', url: url });
        saveFavs(favs);
        render();
        if (typeof showNotification === 'function') showNotification('已保存到「我的字体」 ✓', 'success');
    }

    // 页面加载时如果当前用的是带兜底的字体，补注入兜底字体
    function restoreFallback() {
        var cur = currentUrl();
        if (!cur) return;
        var p = PRESETS.filter(function (x) { return x.url && x.url === cur; })[0];
        if (p && p.fbUrl) injectFallback(p.fbUrl);
    }

    function bind() {
        var btn = document.getElementById('save-font-favorite-btn');
        if (btn && btn.dataset.fpBound !== '1') {
            btn.dataset.fpBound = '1';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                saveCurrent();
            });
        }
        render();
        restoreFallback();
    }

    window.renderFontPresets = render;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2000);
})();
