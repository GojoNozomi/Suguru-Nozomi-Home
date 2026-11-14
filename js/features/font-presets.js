/* 🔤 我的字体 —— 预设 + 自存字体列表 */
(function () {
    'use strict';

    var LIST_ID = 'font-preset-list';

    var PRESETS = [
        { id: 'default', name: '默认（系统字体）', meta: '跟随系统默认', url: '' },
        { id: 'p975',    name: '975 圆体',   meta: '圆体 · 中细',   url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-975-maru-sc-regular@1.0.1/font.css' },
        { id: 'xiaolai', name: '小赖字体',   meta: '手写 · 细 · 活泼', url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-xiaolai-sc-regular@1.0.2/font.css' },
        { id: 'yozai',   name: '悠哉字体',   meta: '手写 · 细 · 轻快', url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-yozai-regular@1.0.9/font.css' },
        { id: 'wenkai',  name: '霞鹜文楷',   meta: '楷体 · 易读',   url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-lxgw-wen-kai-gb-screen@1.0.6/font.css' },
        { id: 'maoken',  name: '猫啃珠圆体', meta: '圆润 · 偏粗',   url: 'https://cdn.jsdelivr.net/npm/cn-fontsource-maoken-zhuyuan-ti-regular@1.0.1/font.css' }
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
        var m = u.match(/cn-fontsource-([^@\/]+)/);
        if (m) return m[1].replace(/-/g, ' ');
        var last = u.split('/').pop().split('?')[0];
        return last || '自定义字体';
    }

    function all() {
        return PRESETS.concat(loadFavs());
    }

    function applyFontObject(p) {
        var inp = document.getElementById('custom-font-url');
        var btn = document.getElementById('apply-font-btn');
        if (!inp || !btn) return;
        inp.value = p.url || '';
        btn.click();
        render();
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
