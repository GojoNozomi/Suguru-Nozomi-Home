/* 🌟 心愿清单 —— 想和他一起做的事 */
(function () {
    'use strict';

    var MODAL_ID = 'wishlist-modal';

    function storageKey() {
        try {
            if (typeof getStorageKey === 'function') return getStorageKey('wishlist');
        } catch (e) {}
        return 'wishlist';
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

    function ensureModal() {
        var existed = document.getElementById(MODAL_ID);
        if (existed) return existed;

        var wrap = document.createElement('div');
        wrap.className = 'modal';
        wrap.id = MODAL_ID;
        wrap.innerHTML = [
            '<div class="modal-content">',
            '  <div class="modal-title"><i class="fas fa-heart"></i><span>心愿清单</span></div>',
            '  <div style="display:flex;gap:8px;">',
            '    <input id="wish-input" type="text" placeholder="想和他一起做的事…" style="flex:1;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;">',
            '    <button class="modal-btn modal-btn-primary" id="wish-add" style="flex:0 0 auto;margin:0;padding:0 16px;"><i class="fas fa-plus"></i></button>',
            '  </div>',
            '  <div style="margin-top:18px;">',
            '    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-secondary);letter-spacing:1px;margin-bottom:10px;">',
            '      <span>还没做</span><span id="wish-open-count">0</span>',
            '    </div>',
            '    <div id="wish-open-list" style="display:flex;flex-direction:column;gap:8px;max-height:34vh;overflow-y:auto;padding-right:2px;"></div>',
            '  </div>',
            '  <div style="margin-top:16px;border-top:1px solid var(--border-color);padding-top:12px;">',
            '    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-secondary);letter-spacing:1px;margin-bottom:10px;">',
            '      <span>已完成</span><span id="wish-done-count">0</span>',
            '    </div>',
            '    <div id="wish-done-list" style="display:flex;flex-direction:column;gap:8px;max-height:26vh;overflow-y:auto;padding-right:2px;"></div>',
            '  </div>',
            '  <div class="modal-buttons">',
            '    <button class="modal-btn modal-btn-secondary" id="close-wishlist">关闭</button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(wrap);

        wrap.querySelector('#close-wishlist').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });

        var input = wrap.querySelector('#wish-input');
        function addItem() {
            var text = (input.value || '').trim();
            if (!text) return;
            var list = load();
            list.unshift({ id: Date.now(), text: text, done: false });
            persist(list);
            input.value = '';
            render();
            if (typeof showNotification === 'function') showNotification('已加入心愿 ✓', 'success');
        }
        wrap.querySelector('#wish-add').addEventListener('click', addItem);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); addItem(); }
        });

        return wrap;
    }

    function itemHTML(it) {
        var checked = !!it.done;
        return '<div style="display:flex;align-items:flex-start;gap:9px;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--secondary-bg);">' +
            '<button data-toggle="' + it.id + '" style="flex:0 0 auto;width:20px;height:20px;margin-top:1px;border:1.5px solid ' + (checked ? 'var(--accent-color)' : 'var(--border-color)') + ';border-radius:6px;background:' + (checked ? 'var(--accent-color)' : 'transparent') + ';color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;">' +
            (checked ? '<i class="fas fa-check" style="font-size:10px;"></i>' : '') +
            '</button>' +
            '<div style="flex:1;min-width:0;font-size:13px;line-height:1.65;word-break:break-word;' +
            (checked ? 'color:var(--text-secondary);text-decoration:line-through;opacity:.7;' : 'color:var(--text-primary);') + '">' +
            esc(it.text) + '</div>' +
            '<button data-del="' + it.id + '" title="删除" style="flex:0 0 auto;width:24px;height:24px;border:none;border-radius:8px;background:transparent;color:var(--text-secondary);cursor:pointer;line-height:1;"><i class="fas fa-trash-can" style="font-size:11px;"></i></button>' +
            '</div>';
    }

    function render() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;

        var list = load();
        var open = list.filter(function (x) { return !x.done; });
        var done = list.filter(function (x) { return x.done; });

        wrap.querySelector('#wish-open-count').textContent = String(open.length);
        wrap.querySelector('#wish-done-count').textContent = String(done.length);

        var openBox = wrap.querySelector('#wish-open-list');
        var doneBox = wrap.querySelector('#wish-done-list');

        openBox.innerHTML = open.length
            ? open.map(itemHTML).join('')
            : '<div style="text-align:center;padding:20px 0;color:var(--text-secondary);font-size:12px;line-height:1.9;">还没有心愿<br><span style="opacity:.6">写一件想和他一起做的事吧</span></div>';

        doneBox.innerHTML = done.length
            ? done.map(itemHTML).join('')
            : '<div style="text-align:center;padding:14px 0;color:var(--text-secondary);font-size:11px;opacity:.6;">还没有完成的心愿</div>';

        Array.prototype.forEach.call(wrap.querySelectorAll('[data-toggle]'), function (btn) {
            btn.addEventListener('click', function () {
                var id = Number(btn.getAttribute('data-toggle'));
                var arr = load();
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id === id) { arr[i].done = !arr[i].done; break; }
                }
                persist(arr);
                render();
            });
        });

        Array.prototype.forEach.call(wrap.querySelectorAll('[data-del]'), function (btn) {
            btn.addEventListener('click', function () {
                var id = Number(btn.getAttribute('data-del'));
                if (!confirm('删除这个心愿？')) return;
                persist(load().filter(function (x) { return x.id !== id; }));
                render();
            });
        });
    }

    window.openWishlist = function () {
        ensureModal();
        render();
        var adv = document.getElementById('advanced-modal');
        if (adv && typeof hideModal === 'function') hideModal(adv);
        setTimeout(function () {
            if (typeof showModal === 'function') showModal(document.getElementById(MODAL_ID));
        }, 150);
    };

    function bind() {
        var item = document.getElementById('wishlist-function');
        if (!item || item.dataset.wlBound === '1') return;
        item.dataset.wlBound = '1';
        item.addEventListener('click', function () { window.openWishlist(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2000);
})();
