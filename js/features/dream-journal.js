/* 🌙 入梦记录 —— 记录每次入梦的小日记本 */
(function () {
    'use strict';

    var MODAL_ID = 'dream-journal-modal';
    var selId = null;

    function storageKey() {
        try {
            if (typeof getStorageKey === 'function') return getStorageKey('dreamJournal');
        } catch (e) {}
        return 'dreamJournal';
    }
    function load() {
        try {
            var arr = JSON.parse(localStorage.getItem(storageKey()) || '[]');
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }
    function persist(list) {
        try { localStorage.setItem(storageKey(), JSON.stringify(list)); } catch (e) {}
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function todayStr() {
        var d = new Date();
        var p = function (n) { return n < 10 ? '0' + n : n; };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    }
    function partnerName() {
        try {
            if (typeof settings !== 'undefined' && settings && settings.partnerName) return settings.partnerName;
        } catch (e) {}
        return '梦角';
    }

    var BTN_PRIMARY = 'flex:1;padding:12px;background:var(--accent-color);color:#fff;border:none;border-radius:12px;font-size:13px;font-weight:600;font-family:var(--font-family);cursor:pointer;letter-spacing:.5px;box-shadow:0 4px 16px rgba(var(--accent-color-rgb),0.3);';
    var BTN_CLOSE = 'flex:0 0 auto;padding:12px 22px;background:transparent;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-secondary);cursor:pointer;font-family:var(--font-family);';
    var CARD = 'background:rgba(var(--accent-color-rgb,197,164,126),0.06);border:1px solid rgba(var(--accent-color-rgb,197,164,126),0.18);border-radius:12px;padding:12px 13px;cursor:pointer;transition:all .2s;';

    function ensureModal() {
        var existed = document.getElementById(MODAL_ID);
        if (existed) return existed;

        var wrap = document.createElement('div');
        wrap.className = 'modal';
        wrap.id = MODAL_ID;
        wrap.innerHTML = [
            '<div class="modal-content" style="height:560px;max-height:80vh;padding-bottom:22px;">',
            '  <div class="modal-title"><i class="fas fa-moon"></i><span>入梦记录</span></div>',
            '  <div style="display:flex;gap:6px;margin-bottom:14px;flex-shrink:0;">',
            '    <button class="env-tab-btn active" id="dream-tab-write">记录梦境</button>',
            '    <button class="env-tab-btn" id="dream-tab-history">过往梦境</button>',
            '  </div>',

            '  <div id="dream-page-write" style="flex:1;display:flex;flex-direction:column;min-height:0;">',
            '    <input id="dream-date" type="date" style="width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:12px;font-family:inherit;outline:none;margin-bottom:10px;flex-shrink:0;">',
            '    <textarea id="dream-text" placeholder="记录这次入梦的场景、对话、心情……" style="flex:1;min-height:0;width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;line-height:1.75;font-family:inherit;resize:none;outline:none;"></textarea>',
            '    <div style="display:flex;gap:8px;margin-top:12px;flex-shrink:0;">',
            '      <button id="dream-save" style="' + BTN_PRIMARY + '"><i class="fas fa-feather"></i> 提笔记录</button>',
            '      <button id="dream-close-1" style="' + BTN_CLOSE + '">关闭</button>',
            '    </div>',
            '  </div>',

            '  <div id="dream-page-history" style="display:none;flex:1;flex-direction:column;min-height:0;">',
            '    <div id="dream-list" style="flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;overflow-y:auto;padding-right:2px;"></div>',
            '    <div style="display:flex;gap:8px;margin-top:12px;flex-shrink:0;">',
            '      <button id="dream-share" style="' + BTN_PRIMARY + '"><i class="fas fa-paper-plane"></i> 分享给 ' + esc(partnerName()) + '</button>',
            '      <button id="dream-close-2" style="' + BTN_CLOSE + '">关闭</button>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(wrap);

        // tab 切换
        wrap.querySelector('#dream-tab-write').addEventListener('click', function () {
            setTab('write');
        });
        wrap.querySelector('#dream-tab-history').addEventListener('click', function () {
            setTab('history');
        });

        // 关闭
        wrap.querySelector('#dream-close-1').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });
        wrap.querySelector('#dream-close-2').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });

        // 保存
        wrap.querySelector('#dream-save').addEventListener('click', function () {
            var ta = wrap.querySelector('#dream-text');
            var dt = wrap.querySelector('#dream-date');
            var text = (ta.value || '').trim();
            if (!text) {
                if (typeof showNotification === 'function') showNotification('先写点什么吧～', 'info');
                return;
            }
            var list = load();
            var item = { id: Date.now(), date: (dt.value || todayStr()), text: text };
            list.unshift(item);
            persist(list);
            selId = item.id;
            ta.value = '';
            setTab('history');
            if (typeof showNotification === 'function') showNotification('已收进梦里 ✓', 'success');
        });

        // 分享
        wrap.querySelector('#dream-share').addEventListener('click', function () {
            var list = load();
            if (!list.length) return;
            var it = null;
            for (var i = 0; i < list.length; i++) { if (list[i].id === selId) { it = list[i]; break; } }
            if (!it) it = list[0];
            sendToChat(it);
        });

        wrap.querySelector('#dream-date').value = todayStr();
        return wrap;
    }

    function setTab(which) {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var tw = wrap.querySelector('#dream-tab-write');
        var th = wrap.querySelector('#dream-tab-history');
        var pw = wrap.querySelector('#dream-page-write');
        var ph = wrap.querySelector('#dream-page-history');
        var isWrite = which === 'write';
        tw.classList.toggle('active', isWrite);
        th.classList.toggle('active', !isWrite);
        pw.style.display = isWrite ? 'flex' : 'none';
        ph.style.display = isWrite ? 'none' : 'flex';
        if (!isWrite) render();
    }

    function sendToChat(it) {
        if (typeof addMessage !== 'function') {
            if (typeof showNotification === 'function') showNotification('聊天还没准备好', 'error');
            return;
        }
        try {
            addMessage({
                id: Date.now(),
                sender: 'user',
                text: '🌙 入梦 · ' + it.date + '\n' + it.text,
                timestamp: new Date(),
                status: 'sent',
                favorited: false,
                type: 'normal'
            });
            var wrap = document.getElementById(MODAL_ID);
            if (wrap && typeof hideModal === 'function') hideModal(wrap);
            if (typeof showNotification === 'function') showNotification('已分享给 ' + partnerName() + ' ✓', 'success');
        } catch (e) {
            if (typeof showNotification === 'function') showNotification('发送失败', 'error');
        }
    }

    function render() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;

        var list = load();
        var box = wrap.querySelector('#dream-list');

        if (!selId && list.length) selId = list[0].id;

        if (!list.length) {
            box.innerHTML = '<div style="text-align:center;padding:30px 0;color:var(--text-secondary);font-size:12px;line-height:1.9;">还没有记录<br><span style="opacity:.6">切到「记录梦境」写第一句吧</span></div>';
            return;
        }

        box.innerHTML = list.map(function (it) {
            var on = it.id === selId;
            return '<div data-sel="' + it.id + '" style="' + CARD +
                (on ? 'border-color:var(--accent-color);box-shadow:0 0 0 1px var(--accent-color) inset;' : '') + '">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">' +
                '<span style="font-size:10px;letter-spacing:1.2px;color:var(--text-secondary);">' + esc(it.date) + '</span>' +
                '<button data-del="' + it.id + '" title="删除" style="width:24px;height:24px;border:none;border-radius:7px;background:transparent;color:var(--text-secondary);cursor:pointer;line-height:1;"><i class="fas fa-trash-can" style="font-size:10px;"></i></button>' +
                '</div>' +
                '<div style="font-size:13px;line-height:1.75;color:var(--text-primary);white-space:pre-wrap;word-break:break-word;">' + esc(it.text) + '</div>' +
                '</div>';
        }).join('');

        Array.prototype.forEach.call(box.querySelectorAll('[data-sel]'), function (el) {
            el.addEventListener('click', function (e) {
                if (e.target.closest('[data-del]')) return;
                selId = Number(el.getAttribute('data-sel'));
                render();
            });
        });

        Array.prototype.forEach.call(box.querySelectorAll('[data-del]'), function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var id = Number(btn.getAttribute('data-del'));
                if (!confirm('删除这条入梦记录？')) return;
                persist(load().filter(function (x) { return x.id !== id; }));
                if (selId === id) selId = null;
                render();
            });
        });
    }

    window.openDreamJournal = function () {
        ensureModal();
        var wrap = document.getElementById(MODAL_ID);
        var btn = wrap.querySelector('#dream-share');
        if (btn) btn.innerHTML = '<i class="fas fa-paper-plane"></i> 分享给 ' + esc(partnerName());
        setTab('write');
        var adv = document.getElementById('advanced-modal');
        if (adv && typeof hideModal === 'function') hideModal(adv);
        setTimeout(function () {
            if (typeof showModal === 'function') showModal(wrap);
        }, 150);
    };

    function bind() {
        var item = document.getElementById('dream-journal-function');
        if (!item || item.dataset.djBound === '1') return;
        item.dataset.djBound = '1';
        item.addEventListener('click', function () { window.openDreamJournal(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2000);
})();
