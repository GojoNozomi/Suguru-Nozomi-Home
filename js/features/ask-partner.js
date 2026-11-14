/* 💬 问梦角 —— 让 TA 在选项里做选择 */
(function () {
    'use strict';

    var MODAL_ID = 'ask-partner-modal';
    var DEFAULT_OPTS = ['是', '否', '听你的'];

    function storageKey() {
        try {
            if (typeof getStorageKey === 'function') return getStorageKey('askPartnerLog');
        } catch (e) {}
        return 'askPartnerLog';
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

    function partnerName() {
        try {
            if (typeof settings !== 'undefined' && settings && settings.partnerName) return settings.partnerName;
        } catch (e) {}
        return '对方';
    }

    function pickOne(opts) {
        return opts[Math.floor(Math.random() * opts.length)];
    }

    function optRowHTML(val) {
        return '<div class="ask-opt-row" style="display:flex;gap:6px;align-items:center;">' +
            '<input type="text" class="ask-opt-input" value="' + esc(val) + '" style="flex:1;box-sizing:border-box;padding:8px 10px;border:1px solid var(--border-color);border-radius:9px;background:var(--primary-bg);color:var(--text-primary);font-size:12.5px;font-family:inherit;outline:none;">' +
            '<button class="ask-opt-del" title="移除" style="flex:0 0 auto;width:28px;height:28px;border:1px solid var(--border-color);border-radius:9px;background:transparent;color:var(--text-secondary);cursor:pointer;line-height:1;"><i class="fas fa-xmark" style="font-size:11px;"></i></button>' +
            '</div>';
    }

    function ensureModal() {
        var existed = document.getElementById(MODAL_ID);
        if (existed) return existed;

        var wrap = document.createElement('div');
        wrap.className = 'modal';
        wrap.id = MODAL_ID;
        wrap.innerHTML = [
            '<div class="modal-content">',
            '  <div class="modal-title"><i class="fas fa-circle-question"></i><span>问梦角</span></div>',
            '  <div style="display:flex;flex-direction:column;gap:10px;">',
            '    <input id="ask-question" type="text" placeholder="想问 TA 什么？例如：你喜欢我吗？" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;">',
            '    <div style="font-size:11px;color:var(--text-secondary);letter-spacing:1px;">选项</div>',
            '    <div id="ask-opt-list" style="display:flex;flex-direction:column;gap:6px;"></div>',
            '    <button class="modal-btn modal-btn-secondary" id="ask-add-opt" style="margin:0;"><i class="fas fa-plus"></i> 添加选项</button>',
            '    <button class="modal-btn modal-btn-primary" id="ask-submit"><i class="fas fa-paper-plane"></i> 问 TA</button>',
            '  </div>',
            '  <div style="margin-top:18px;border-top:1px solid var(--border-color);padding-top:12px;">',
            '    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-secondary);letter-spacing:1px;margin-bottom:10px;">',
            '      <span>过往问答</span><span id="ask-log-count">0</span>',
            '    </div>',
            '    <div id="ask-log-list" style="display:flex;flex-direction:column;gap:8px;max-height:34vh;overflow-y:auto;padding-right:2px;"></div>',
            '  </div>',
            '  <div class="modal-buttons">',
            '    <button class="modal-btn modal-btn-secondary" id="close-ask-partner">关闭</button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(wrap);

        wrap.querySelector('#close-ask-partner').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });

        wrap.querySelector('#ask-add-opt').addEventListener('click', function () {
            var list = wrap.querySelector('#ask-opt-list');
            var div = document.createElement('div');
            div.innerHTML = optRowHTML('');
            var row = div.firstElementChild;
            list.appendChild(row);
            bindRow(row);
            var input = row.querySelector('.ask-opt-input');
            if (input) input.focus();
        });

        wrap.querySelector('#ask-submit').addEventListener('click', submitAsk);

        var listBox = wrap.querySelector('#ask-opt-list');
        DEFAULT_OPTS.forEach(function (o) {
            var div = document.createElement('div');
            div.innerHTML = optRowHTML(o);
            var row = div.firstElementChild;
            listBox.appendChild(row);
            bindRow(row);
        });

        return wrap;
    }

    function bindRow(row) {
        var del = row.querySelector('.ask-opt-del');
        if (del && del.dataset.bound !== '1') {
            del.dataset.bound = '1';
            del.addEventListener('click', function () {
                var list = row.parentNode;
                if (list.querySelectorAll('.ask-opt-row').length <= 2) {
                    if (typeof showNotification === 'function') showNotification('至少保留两个选项', 'info');
                    return;
                }
                row.remove();
            });
        }
    }

    function readOptions() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return [];
        var inputs = wrap.querySelectorAll('.ask-opt-input');
        var opts = [];
        Array.prototype.forEach.call(inputs, function (inp) {
            var v = (inp.value || '').trim();
            if (v) opts.push(v);
        });
        return opts;
    }

    function postToChat(question, picked) {
        if (typeof addMessage !== 'function') return;
        try {
            addMessage({
                id: Date.now(),
                sender: 'user',
                text: question,
                timestamp: new Date(),
                status: 'sent',
                favorited: false,
                type: 'normal'
            });
        } catch (e) {}
        setTimeout(function () {
            try {
                addMessage({
                    id: Date.now() + Math.random(),
                    sender: partnerName(),
                    text: picked,
                    timestamp: new Date(),
                    status: 'received',
                    favorited: false,
                    type: 'normal'
                });
            } catch (e) {}
        }, 700);
    }

    function submitAsk() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var q = (wrap.querySelector('#ask-question').value || '').trim();
        if (!q) {
            if (typeof showNotification === 'function') showNotification('先写下问题吧～', 'info');
            return;
        }
        var opts = readOptions();
        if (opts.length < 2) {
            if (typeof showNotification === 'function') showNotification('至少要有两个选项', 'info');
            return;
        }

        var picked = pickOne(opts);
        var logs = load();
        logs.unshift({ id: Date.now(), q: q, opts: opts.slice(), pick: picked, time: new Date().toISOString() });
        persist(logs);

        renderLog();
        postToChat(q, picked);

        wrap.querySelector('#ask-question').value = '';
        if (typeof showNotification === 'function') showNotification(partnerName() + ' 选了：' + picked, 'success', 2200);
    }

    function renderLog() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var logs = load();
        var box = wrap.querySelector('#ask-log-list');
        var cnt = wrap.querySelector('#ask-log-count');
        if (cnt) cnt.textContent = String(logs.length);

        if (!logs.length) {
            box.innerHTML = '<div style="text-align:center;padding:20px 0;color:var(--text-secondary);font-size:12px;line-height:1.9;">还没有问过<br><span style="opacity:.6">问他一个问题试试</span></div>';
            return;
        }

        box.innerHTML = logs.map(function (it) {
            return '<div style="padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--secondary-bg);">' +
                '<div style="font-size:13px;line-height:1.6;color:var(--text-primary);word-break:break-word;">' + esc(it.q) + '</div>' +
                '<div style="margin-top:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
                '<span style="font-size:12px;font-weight:600;color:var(--accent-color);">→ ' + esc(it.pick) + '</span>' +
                '<span style="flex:1"></span>' +
                '<button data-repick="' + it.id + '" style="font-size:11px;padding:3px 9px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:var(--text-secondary);cursor:pointer;">重新选择</button>' +
                '<button data-remove="' + it.id + '" style="font-size:11px;padding:3px 9px;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:var(--text-secondary);cursor:pointer;">删除</button>' +
                '</div></div>';
        }).join('');

        Array.prototype.forEach.call(box.querySelectorAll('[data-repick]'), function (btn) {
            btn.addEventListener('click', function () {
                var id = Number(btn.getAttribute('data-repick'));
                var arr = load();
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id === id) {
                        var opts = (arr[i].opts && arr[i].opts.length >= 2) ? arr[i].opts : DEFAULT_OPTS;
                        arr[i].pick = pickOne(opts);
                        break;
                    }
                }
                persist(arr);
                renderLog();
            });
        });

        Array.prototype.forEach.call(box.querySelectorAll('[data-remove]'), function (btn) {
            btn.addEventListener('click', function () {
                var id = Number(btn.getAttribute('data-remove'));
                if (!confirm('删除这条问答记录？')) return;
                persist(load().filter(function (x) { return x.id !== id; }));
                renderLog();
            });
        });
    }

    window.openAskPartner = function () {
        ensureModal();
        renderLog();
        setTimeout(function () {
            if (typeof showModal === 'function') showModal(document.getElementById(MODAL_ID));
        }, 60);
    };

    function bind() {
        var btn = document.getElementById('ask-partner-btn');
        if (!btn || btn.dataset.askBound === '1') return;
        btn.dataset.askBound = '1';
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.openAskPartner();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2000);
})();
