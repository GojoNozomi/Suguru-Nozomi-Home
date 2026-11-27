/* 🖼 聊天背景：显示方式 + 位置 */
(function () {
    'use strict';

    var FITS = ['cover', 'contain', '100% 100%', 'auto'];
    var POS = { top: 'center top', center: 'center center', bottom: 'center bottom' };

    function getFit() {
        try {
            var v = settings && settings.bgFit;
            return FITS.indexOf(v) > -1 ? v : 'cover';
        } catch (e) { return 'cover'; }
    }

    function getPos() {
        try {
            var v = settings && settings.bgPosition;
            return POS[v] ? v : 'center';
        } catch (e) { return 'center'; }
    }

    function syncUI() {
        var fit = getFit(), pos = getPos();
        Array.prototype.forEach.call(document.querySelectorAll('[data-bg-fit]'), function (el) {
            el.classList.toggle('active', el.getAttribute('data-bg-fit') === fit);
        });
        Array.prototype.forEach.call(document.querySelectorAll('[data-bg-pos]'), function (el) {
            el.classList.toggle('active', el.getAttribute('data-bg-pos') === pos);
        });
    }

    function apply() {
        var root = document.documentElement;
        root.style.setProperty('--chat-bg-size', getFit());
        root.style.setProperty('--chat-bg-position', POS[getPos()]);
        syncUI();
    }

    function save(partial) {
        try { if (typeof settings !== 'undefined' && settings) Object.assign(settings, partial); } catch (e) {}
        apply();
        if (typeof throttledSaveData === 'function') throttledSaveData();
    }

    function bind() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-bg-fit]'), function (el) {
            if (el.dataset.bgBound === '1') return;
            el.dataset.bgBound = '1';
            el.addEventListener('click', function () {
                save({ bgFit: el.getAttribute('data-bg-fit') });
                var sp = el.querySelector('span');
                if (typeof showNotification === 'function' && sp) {
                    showNotification('背景显示：' + sp.textContent, 'success', 1500);
                }
                apply();
            });
        });
        Array.prototype.forEach.call(document.querySelectorAll('[data-bg-pos]'), function (el) {
            if (el.dataset.bgBound === '1') return;
            el.dataset.bgBound = '1';
            el.addEventListener('click', function () {
                save({ bgPosition: el.getAttribute('data-bg-pos') });
                apply();
            });
        });
        apply();
    }

    window.applyBgFit = apply;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2200);
})();
