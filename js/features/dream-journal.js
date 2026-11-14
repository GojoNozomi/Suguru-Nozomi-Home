/* 🌙 入梦记录 —— 记录每次入梦的小日记本 */
(function () {
    'use strict';

    var MODAL_ID = 'dream-journal-modal';

    function storageKey() {
        try {
            if (typeof getStorageKey === 'function') return getStorageKey('dreamJournal');
        } catch (e) {}
        return 'dreamJournal';
    }

    function load() {
        try {
            var raw = localStorage.getItem(storageKey());
            var arr = JSON.parse(raw || '[]');
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

    function ensureModal() {
        var existed = document.getElementById(MODAL_ID);
        if (existed) return existed;

        var wrap = document.createElement('div');
        wrap.className = 'modal';
        wrap.id = MODAL_ID;
        wrap.innerHTML = [
            '<div class="modal-content">',
            '  <div class="modal-title"><i class="fas fa-moon"></i><span>入梦记录</span></div>',
            '  <div style="display:flex;flex-direction:column;gap:10px;">',
            '    <input id="dream-date" type="date" style="width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:12px;font-family:inherit;outline:none;">',
            '    <textarea id="dream-text" rows="4" placeholder="记录这次入梦的场景、对话、心情……" style="width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;line-height:1.75;font-family:inherit;resize:vertical;outline:none;"></textarea>',
            '    <button class="modal-btn modal-btn-primary" id="dream-save"><i class="fas fa-feather"></i> 记下来</button>',
            '  </div>',
            '  <div style="margin-top:18px;border-top:1px solid var(--border-color);padding-top:12px;">',
            '    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-secondary);letter-spacing:1px;margin-bottom:10px;">',
            '      <span>过往的梦</span><span id="dream-count">0</span>',
            '    </div>',
            '    <div id="dream-list" style="display:flex;flex-direction:column;gap:8px;max-height:42vh;overflow-y:auto;padding-right:2px;"></div>',
            '  </div>',
            '  <div class="modal-buttons">',
            '    <button class="modal-btn modal-btn-secondary" id="close-dream-journal">关闭</button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(wrap);

        wrap.querySelector('#close-dream-journal').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });

        wrap.querySelector('#dream-save').addEventListener('click', function () {
            var ta = wrap.querySelector('#dream-text');
            var dt = wrap.querySelector('#dream-date');
            var text = (ta.value || '').trim();
            if (!text) {
                if (typeof showNotification === 'function') showNotification('先写点什么吧～', 'info');
                return;
            }
            var list = load();
            list.unshift({ id: Date.now(), date: (dt.value || todayStr()), text: text });
            persist(list);
            ta.value = '';
            render();
            if (typeof showNotification === 'function') showNotification('已收进梦里 ✓', 'success');
        });

        wrap.querySelector('#dream-date').value = todayStr();
        return wrap;
    }

    function render() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;

        var list = load();
        var box = wrap.querySelector('#dream-list');
        var cnt = wrap.querySelector('#dream-count');
        if (cnt) cnt.textContent = String(list.length);

        if (!list.length) {
            box.innerHTML = '<div style="text-align:center;padding:26px 0;color:var(--text-secondary);font-size:12px;line-height:1.9;">还没有记录<br><span style="opacity:.6">今晚入梦后，来写第一句吧</span></div>';
            return;
        }

        box.innerHTML = list.map(function (it) {
            return '<div style="position:relative;padding:11px 36px 11px 13px;border:1px solid var(--border-color);border-radius:12px;background:var(--secondary-bg);">' +
                '<div style="font-size:10px;letter-spacing:1.2px;color:var(--text-secondary);margin-bottom:5px;">' + esc(it.date) + '</div>' +
                '<div style="font-size:13px;line-height:1.75;color:var(--text-primary);white-space:pre-wrap;word-break:break-word;">' + esc(it.text) + '</div>' +
                '<button data-del="' + it.id + '" title="删除" style="position:absolute;top:8px;right:6px;width:26px;height:26px;border:none;border-radius:8px;background:transparent;color:var(--text-secondary);cursor:pointer;line-height:1;"><i class="fas fa-trash-can" style="font-size:11px;"></i></button>' +
                '</div>';
        }).join('');

        Array.prototype.forEach.call(box.querySelectorAll('[data-del]'), function (btn) {
            btn.addEventListener('click', function () {
                var id = Number(btn.getAttribute('data-del'));
                if (!confirm('删除这条入梦记录？')) return;
                persist(load().filter(function (x) { return x.id !== id; }));
                render();
            });
        });
    }

    window.openDreamJournal = function () {
        ensureModal();
        render();
        var adv = document.getElementById('advanced-modal');
        if (adv && typeof hideModal === 'function') hideModal(adv);
        setTimeout(function () {
            if (typeof showModal === 'function') showModal(document.getElementById(MODAL_ID));
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
