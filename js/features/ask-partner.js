/* 💬 问梦角 —— 让 TA 在选项里做选择（问卷卡片进聊天） */
(function () {
    'use strict';

    var MODAL_ID = 'ask-partner-modal';
    var DEFAULT_OPTS = ['是', '否', '听你的'];
    var lastAsk = null; // { q, opts, mode }
    var currentMode = 'single';

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
        return '梦角';
    }
    function pickForPoll(mode, opts) {
        var n = opts.length;
        if (n === 0) return [];
        if (mode === 'multi') {
            var max = Math.min(3, n);
            var count = 1 + Math.floor(Math.random() * max);
            var pool = opts.map(function (_, i) { return i; });
            var idxs = [];
            while (idxs.length < count && pool.length) {
                var k = Math.floor(Math.random() * pool.length);
                idxs.push(pool[k]);
                pool.splice(k, 1);
            }
            return idxs.sort(function (a, b) { return a - b; });
        }
        return [Math.floor(Math.random() * n)];
    }

    var BTN_PRIMARY = 'flex:1;min-width:0;padding:12px 10px;background:var(--accent-color);color:#fff;border:none;border-radius:12px;font-size:13px;font-weight:600;font-family:var(--font-family);cursor:pointer;letter-spacing:.3px;box-shadow:0 4px 16px rgba(var(--accent-color-rgb),0.3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    var BTN_SECOND = 'flex:0 0 auto;padding:12px 14px;background:rgba(var(--accent-color-rgb),0.1);border:1px solid rgba(var(--accent-color-rgb),0.25);border-radius:12px;font-size:13px;color:var(--accent-color);cursor:pointer;font-family:var(--font-family);white-space:nowrap;';
    var BTN_CLOSE = 'flex:0 0 auto;padding:12px 16px;background:transparent;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-secondary);cursor:pointer;font-family:var(--font-family);white-space:nowrap;';
    var CARD = 'background:rgba(var(--accent-color-rgb,197,164,126),0.06);border:1px solid rgba(var(--accent-color-rgb,197,164,126),0.18);border-radius:12px;padding:11px 12px;';
    var OPT_INPUT = 'flex:1;box-sizing:border-box;padding:9px 11px;border:1px solid var(--border-color);border-radius:9px;background:var(--primary-bg);color:var(--text-primary);font-size:12.5px;font-family:inherit;outline:none;';
    var MODE_ON = 'flex:1;padding:7px 0;border:1px solid var(--accent-color);border-radius:9px;background:rgba(var(--accent-color-rgb),0.12);color:var(--accent-color);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-family);';
    var MODE_OFF = 'flex:1;padding:7px 0;border:1px solid var(--border-color);border-radius:9px;background:var(--primary-bg);color:var(--text-secondary);font-size:12px;cursor:pointer;font-family:var(--font-family);';

    function optRowHTML(val) {
        return '<div class="ask-opt-row" style="display:flex;gap:6px;align-items:center;">' +
            '<input type="text" class="ask-opt-input" value="' + esc(val) + '" style="' + OPT_INPUT + '">' +
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
            '<div class="modal-content" style="height:560px;max-height:80vh;padding-bottom:22px;">',
            '  <div class="modal-title"><i class="fas fa-circle-question"></i><span>问 ' + esc(partnerName()) + '</span></div>',

            '  <div style="display:flex;gap:6px;margin-bottom:14px;flex-shrink:0;">',
            '    <button class="env-tab-btn active" id="ask-tab-write">问问题</button>',
            '    <button class="env-tab-btn" id="ask-tab-history">过往问答</button>',
            '  </div>',

            '  <div id="ask-page-write" style="flex:1;display:flex;flex-direction:column;min-height:0;">',
            '    <input id="ask-question" type="text" placeholder="想问 TA 什么？例如：你喜欢我吗？" style="flex-shrink:0;width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;font-family:inherit;outline:none;">',
            '    <div style="display:flex;gap:6px;margin-top:11px;flex-shrink:0;">',
            '      <button type="button" id="ask-mode-single" style="' + MODE_ON + '">单选</button>',
            '      <button type="button" id="ask-mode-multi" style="' + MODE_OFF + '">多选</button>',
            '    </div>',
            '    <div style="font-size:11px;color:var(--text-secondary);letter-spacing:1px;margin:11px 0 7px;flex-shrink:0;">选项</div>',
            '    <div id="ask-opt-list" style="flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding-right:2px;"></div>',
            '    <button class="modal-btn modal-btn-secondary" id="ask-add-opt" style="margin:8px 0 0;width:100%;flex-shrink:0;"><i class="fas fa-plus"></i> 添加选项</button>',
            '    <div style="display:flex;gap:8px;margin-top:12px;flex-shrink:0;">',
            '      <button id="ask-submit" style="' + BTN_PRIMARY + '"><i class="fas fa-paper-plane"></i> 发送</button>',
            '      <button id="ask-again" style="' + BTN_SECOND + '"><i class="fas fa-rotate-right"></i> 再问</button>',
            '      <button id="ask-close-1" style="' + BTN_CLOSE + '">关闭</button>',
            '    </div>',
            '  </div>',

            '  <div id="ask-page-history" style="display:none;flex:1;flex-direction:column;min-height:0;">',
            '    <div id="ask-log-list" style="flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;overflow-y:auto;padding-right:2px;"></div>',
            '    <div style="margin-top:12px;flex-shrink:0;">',
            '      <button id="ask-close-2" style="width:100%;padding:12px;background:transparent;border:1px solid var(--border-color);border-radius:12px;font-size:13px;color:var(--text-secondary);cursor:pointer;font-family:var(--font-family);">关闭</button>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(wrap);

        wrap.querySelector('#ask-tab-write').addEventListener('click', function () { setTab('write'); });
        wrap.querySelector('#ask-tab-history').addEventListener('click', function () { setTab('history'); });

        wrap.querySelector('#ask-close-1').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });
        wrap.querySelector('#ask-close-2').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });

        wrap.querySelector('#ask-mode-single').addEventListener('click', function () { setMode('single'); });
        wrap.querySelector('#ask-mode-multi').addEventListener('click', function () { setMode('multi'); });

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

        wrap.querySelector('#ask-submit').addEventListener('click', function () { submitAsk(false); });
        wrap.querySelector('#ask-again').addEventListener('click', function () { submitAsk(true); });

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

    function setMode(mode) {
        currentMode = mode;
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var s = wrap.querySelector('#ask-mode-single');
        var m = wrap.querySelector('#ask-mode-multi');
        if (s) s.setAttribute('style', mode === 'single' ? MODE_ON : MODE_OFF);
        if (m) m.setAttribute('style', mode === 'multi' ? MODE_ON : MODE_OFF);
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

    function updatePollCardInDOM(msgId, picked, opts, mode) {
        var card = document.querySelector('.poll-card[data-poll-id="' + msgId + '"]');
        if (!card) return;
        var optEls = card.querySelectorAll('.poll-opt');
        Array.prototype.forEach.call(optEls, function (el, i) {
            if (picked.indexOf(i) > -1) {
                el.classList.add('poll-opt-picked');
                if (!el.querySelector('.poll-opt-tag')) {
                    var tag = document.createElement('span');
                    tag.className = 'poll-opt-tag';
                    tag.textContent = '已选';
                    el.appendChild(tag);
                }
            } else {
                el.classList.remove('poll-opt-picked');
                var t = el.querySelector('.poll-opt-tag');
                if (t) t.remove();
            }
        });
        var foot = card.querySelector('.poll-foot');
        if (!foot) {
            foot = document.createElement('div');
            foot.className = 'poll-foot';
            card.appendChild(foot);
        }
        foot.textContent = mode === 'multi' ? '已选 ' + picked.length + ' 项' : '已作答';
    }

    function setPollPicked(msgId, picked) {
        try {
            for (var i = 0; i < messages.length; i++) {
                if (String(messages[i].id) === String(msgId)) {
                    messages[i].poll = messages[i].poll || {};
                    messages[i].poll.picked = picked;
                    break;
                }
            }
        } catch (e) {}
        if (typeof throttledSaveData === 'function') throttledSaveData();
    }

    function sendPoll(q, mode, opts) {
        if (typeof addMessage !== 'function') {
            if (typeof showNotification === 'function') showNotification('聊天还没准备好', 'error');
            return;
        }
        var pollId = Date.now();
        try {
            addMessage({
                id: pollId,
                sender: 'user',
                type: 'poll',
                text: q,
                poll: { q: q, mode: mode, opts: opts.slice(), picked: [] },
                timestamp: new Date(),
                status: 'sent',
                favorited: false
            });
        } catch (e) {}

        setTimeout(function () {
            var picked = pickForPoll(mode, opts);
            setPollPicked(pollId, picked);
            updatePollCardInDOM(pollId, picked, opts, mode);
            var ansText = picked.map(function (i) { return opts[i]; }).join('、');
            try {
                addMessage({
                    id: Date.now() + Math.random(),
                    sender: partnerName(),
                    text: '我选好啦，我的选择是「' + ansText + '」！',
                    timestamp: new Date(),
                    status: 'received',
                    favorited: false,
                    type: 'normal'
                });
            } catch (e) {}
        }, 900);
    }

    function submitAsk(isAgain) {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;

        var q, opts, mode;
        if (isAgain) {
            if (!lastAsk) {
                if (typeof showNotification === 'function') showNotification('先问一次，再点「再问」', 'info');
                return;
            }
            q = lastAsk.q;
            opts = lastAsk.opts;
            mode = lastAsk.mode;
        } else {
            q = (wrap.querySelector('#ask-question').value || '').trim();
            if (!q) {
                if (typeof showNotification === 'function') showNotification('先写下问题吧～', 'info');
                return;
            }
            opts = readOptions();
            if (opts.length < 2) {
                if (typeof showNotification === 'function') showNotification('至少要有两个选项', 'info');
                return;
            }
            mode = currentMode;
        }

        lastAsk = { q: q, opts: opts.slice(), mode: mode };
        sendPoll(q, mode, opts);

        var logs = load();
        logs.unshift({ id: Date.now(), q: q, opts: opts.slice(), mode: mode, pick: [], time: new Date().toISOString() });
        persist(logs);

        if (!isAgain) wrap.querySelector('#ask-question').value = '';
        renderLog();

        if (typeof hideModal === 'function') hideModal(wrap);
        if (typeof showNotification === 'function') showNotification('已发到聊天里，' + partnerName() + ' 正在想…', 'success', 1800);
    }

    function setTab(which) {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var tw = wrap.querySelector('#ask-tab-write');
        var th = wrap.querySelector('#ask-tab-history');
        var pw = wrap.querySelector('#ask-page-write');
        var ph = wrap.querySelector('#ask-page-history');
        var isWrite = which === 'write';
        tw.classList.toggle('active', isWrite);
        th.classList.toggle('active', !isWrite);
        pw.style.display = isWrite ? 'flex' : 'none';
        ph.style.display = isWrite ? 'none' : 'flex';
        if (!isWrite) renderLog();
    }

    function renderLog() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var logs = load();
        var box = wrap.querySelector('#ask-log-list');

        if (!logs.length) {
            box.innerHTML = '<div style="text-align:center;padding:30px 0;color:var(--text-secondary);font-size:12px;line-height:1.9;">还没有问过<br><span style="opacity:.6">切到「问问题」问他一个吧</span></div>';
            return;
        }

        box.innerHTML = logs.map(function (it) {
            var ans = (it.pick && it.pick.length) ? it.pick.map(function (i) { return it.opts[i]; }).join('、') : (it.pick && it.pick.length === 0 ? '' : (it.picked ? '已答' : ''));
            if (typeof it.pick !== 'undefined' && it.pick.length === 0 && it.picked) ans = it.picked;
            if (!ans && Array.isArray(it.pick) && it.pick.length) ans = it.pick.map(function (i) { return it.opts[i]; }).join('、');
            return '<div style="' + CARD + '">' +
                '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">' +
                '<div style="flex:1;min-width:0;font-size:13px;line-height:1.6;color:var(--text-primary);word-break:break-word;">' + esc(it.q) + (it.mode === 'multi' ? ' <span style="font-size:10px;color:var(--text-secondary);">(多选)</span>' : '') + '</div>' +
                '<button data-del="' + it.id + '" title="删除" style="flex:0 0 auto;width:24px;height:24px;border:none;border-radius:7px;background:transparent;color:var(--text-secondary);cursor:pointer;line-height:1;"><i class="fas fa-trash-can" style="font-size:10px;"></i></button>' +
                '</div></div>';
        }).join('');

        Array.prototype.forEach.call(box.querySelectorAll('[data-del]'), function (btn) {
            btn.addEventListener('click', function () {
                var id = Number(btn.getAttribute('data-del'));
                if (!confirm('删除这条问答记录？')) return;
                persist(load().filter(function (x) { return x.id !== id; }));
                renderLog();
            });
        });
    }

    function syncNames() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var n = partnerName();
        var titleSpan = wrap.querySelector('.modal-title span');
        if (titleSpan) titleSpan.textContent = '问 ' + n;
        var q = wrap.querySelector('#ask-question');
        if (q) q.setAttribute('placeholder', '想问 ' + n + ' 什么？例如：你喜欢我吗？');
    }

    window.openAskPartner = function () {
        ensureModal();
        syncNames();
        setTab('write');
        setTimeout(function () {
            if (typeof showModal === 'function') showModal(document.getElementById(MODAL_ID));
        }, 60);
    };

    function bind() {
        var btn = document.getElementById('ask-partner-btn-extra');
        if (!btn || btn.dataset.askBound === '1') return;
        btn.dataset.askBound = '1';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2000);
})();
