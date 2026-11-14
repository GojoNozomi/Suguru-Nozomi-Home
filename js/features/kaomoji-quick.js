/* ꒰ঌ 颜文字快捷输入 ໒꒱ */
(function () {
    'use strict';

    var MODAL_ID = 'kaomoji-quick-modal';

    var FALLBACK = [
        '(๑•̀ㅂ•́)و✧', '(*/ω＼*)', '(｡•́︿•̀｡)', '(๑>؂<๑）', '(≧▽≦)',
        'ヾ(≧▽≦*)o', '(*^▽^*)', '(￣▽￣)', '(・∀・)', '(´▽`ʃ♡ƪ)',
        '(づ｡◕‿‿◕｡)づ', '(っ´ω`)ﾉ', '(⁄ ⁄•⁄ω⁄•⁄ ⁄)', '(๑´ㅂ`๑)', '(๑•́ ₃ •̀๑)',
        '(ノ°ο°)ノ', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', 'ヽ(✿ﾟ▽ﾟ)ノ', '╰(*°▽°*)╯', 'ヽ(￣д￣;)ノ',
        '(－_－)', '(￣ε(#￣)', '(￣^￣)', '(¬_¬)', '(￢_￢)',
        '(￣ω￣)', '(￣３￣)', '(〃∀〃)', '(๑•́ω•̀๑)', '(´,,•ω•,,)♡',
        '( T_T )', '(>_<)', '(ㄒoㄒ)', '(╥﹏╥)', '(ಥ_ಥ)',
        '(▰˘◡˘▰)', '(●´ω｀●)', '(◕‿◕✿)', '(◠‿◠)', '(♥ω♥*)',
        '(*≧ω≦)', '(๑￫‿￩๑)', '(◍•ᴗ•◍)', '(✿◠‿◠)', '(◡‿◡✿)',
        'ヾ(＾∇＾)', '(＾▽＾)', '(^_^)', '(^-^)', '(｡◕‿◕｡)',
        '(๑ơ ₃ ơ)♥', '(♡˙︶˙♡)', '(灬º‿º灬)♡', '(｡♥‿♥｡)', '(づ￣ ³￣)づ',
        '(๑´•.̫ • `๑)', '(•　•)', '(*꒦ິ⌓꒦ີ)', '(இ﹏இ`｡)', '(｡•́︿•̀｡)',
        '(๑¯ω¯๑)', '(￣▽￣)ノ', '(＝^･ω･^＝)', 'ฅ(•ㅅ•❀)ฅ', '(๑˃̵ᴗ˂̵)و',
        '(*｀へ´*)', '(¬‿¬)', '(￣ー￣)', '( ´ ▽ ` )ﾉ', '(๑•̀ㅁ•́๑)✧'
    ];

    function list() {
        // 系统默认始终保留，再追加你自己添加的颜文字（去重）
        var arr = FALLBACK.slice();
        try {
            if (window._kaomojiLibrary && Array.isArray(window._kaomojiLibrary)) {
                arr = arr.concat(window._kaomojiLibrary);
            }
        } catch (e) {}
        var seen = {};
        return arr.map(function (x) { return String(x == null ? '' : x).trim(); })
            .filter(function (x) {
                if (!x || seen[x]) return false;
                seen[x] = 1;
                return true;
            });
    }

    function insertKaomoji(k) {
        var inp = document.getElementById('message-input');
        if (!inp) return;
        var pos = (typeof inp.selectionStart === 'number') ? inp.selectionStart : (inp.value || '').length;
        var val = inp.value || '';
        inp.value = val.slice(0, pos) + k + val.slice(pos);
        var newPos = pos + k.length;
        try {
            inp.setSelectionRange(newPos, newPos);
        } catch (e) {}
        inp.focus();
        try {
            inp.dispatchEvent(new Event('input', { bubbles: true }));
        } catch (e) {}
    }

    function ensureModal() {
        var existed = document.getElementById(MODAL_ID);
        if (existed) return existed;

        var wrap = document.createElement('div');
        wrap.className = 'modal';
        wrap.id = MODAL_ID;
        wrap.innerHTML = [
            '<div class="modal-content">',
            '  <div class="modal-title"><i class="fas fa-face-smile"></i><span>颜文字</span></div>',
            '  <div id="kaomoji-quick-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;max-height:56vh;overflow-y:auto;padding-right:2px;"></div>',
            '  <div class="modal-buttons">',
            '    <button class="modal-btn modal-btn-secondary" id="close-kaomoji-quick">关闭</button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(wrap);

        wrap.querySelector('#close-kaomoji-quick').addEventListener('click', function () {
            if (typeof hideModal === 'function') hideModal(wrap);
        });

        return wrap;
    }

    function renderGrid() {
        var wrap = document.getElementById(MODAL_ID);
        if (!wrap) return;
        var grid = wrap.querySelector('#kaomoji-quick-grid');
        var arr = list();

        if (!arr.length) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:22px 0;color:var(--text-secondary);font-size:12px;">还没有颜文字</div>';
            return;
        }

        grid.innerHTML = arr.map(function (k, i) {
            return '<button data-km="' + i + '" style="padding:10px 6px;border:1px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:14px;line-height:1.3;cursor:pointer;font-family:inherit;word-break:break-all;">' + k.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</button>';
        }).join('');

        Array.prototype.forEach.call(grid.querySelectorAll('[data-km]'), function (btn) {
            btn.addEventListener('click', function () {
                var idx = Number(btn.getAttribute('data-km'));
                insertKaomoji(arr[idx]);
                if (typeof hideModal === 'function') hideModal(wrap);
            });
        });
    }

    window.openKaomojiQuick = function () {
        ensureModal();
        renderGrid();
        setTimeout(function () {
            if (typeof showModal === 'function') showModal(document.getElementById(MODAL_ID));
        }, 60);
    };

    function bind() {
        var btn = document.getElementById('kaomoji-quick-btn');
        if (!btn || btn.dataset.kmqBound === '1') return;
        btn.dataset.kmqBound = '1';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 800);
    setTimeout(bind, 2000);
})();
