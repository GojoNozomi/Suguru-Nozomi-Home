/* ꒰ঌ 颜文字快捷输入 ໒꒱ */
(function () {
    'use strict';

    var MODAL_ID = 'kaomoji-quick-modal';

    var FALLBACK = [
        "(๑•̀ㅂ•́)و✧",
        "(*/ω＼*)",
        "(｡•́︿•̀｡)",
        "(๑>؂<๑）",
        "(≧▽≦)",
        "ヾ(≧▽≦*)o",
        "(*^▽^*)",
        "(￣▽￣)",
        "(・∀・)",
        "(´▽`ʃ♡ƪ)",
        "(づ｡◕‿‿◕｡)づ",
        "(っ´ω`)ﾉ",
        "(⁄ ⁄•⁄ω⁄•⁄ ⁄)",
        "(๑´ㅂ`๑)",
        "(๑•́ ₃ •̀๑)",
        "(ノ°ο°)ノ",
        "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
        "ヽ(✿ﾟ▽ﾟ)ノ",
        "╰(*°▽°*)╯",
        "ヽ(￣д￣;)ノ",
        "(－_－)",
        "(￣ε(#￣)",
        "(￣^￣)",
        "(¬_¬)",
        "(￢_￢)",
        "(￣ω￣)",
        "(￣３￣)",
        "(〃∀〃)",
        "(๑•́ω•̀๑)",
        "(´,,•ω•,,)♡",
        "( T_T )",
        "(>_<)",
        "(ㄒoㄒ)",
        "(╥﹏╥)",
        "(ಥ_ಥ)",
        "(▰˘◡˘▰)",
        "(●´ω｀●)",
        "(◕‿◕✿)",
        "(◠‿◠)",
        "(♥ω♥*)",
        "(*≧ω≦)",
        "(๑￫‿￩๑)",
        "(◍•ᴗ•◍)",
        "(✿◠‿◠)",
        "(◡‿◡✿)",
        "ヾ(＾∇＾)",
        "(＾▽＾)",
        "(^_^)",
        "(^-^)",
        "(｡◕‿◕｡)",
        "(๑ơ ₃ ơ)♥",
        "(♡˙︶˙♡)",
        "(灬º‿º灬)♡",
        "(｡♥‿♥｡)",
        "(づ￣ ³￣)づ",
        "(๑´•.̫ • `๑)",
        "(•　•)",
        "(*꒦ິ⌓꒦ີ)",
        "(இ﹏இ`｡)",
        "(๑¯ω¯๑)",
        "(￣▽￣)ノ",
        "(＝^･ω･^＝)",
        "ฅ(•ㅅ•❀)ฅ",
        "(๑˃̵ᴗ˂̵)و",
        "(*｀へ´*)",
        "(¬‿¬)",
        "(￣ー￣)",
        "( ´ ▽ ` )ﾉ",
        "(๑•̀ㅁ•́๑)✧",
        "≽^•༚• ྀི≼",
        "·ᯅ·",
        "⌯'Ⱉ'⌯",
        "˶ᵒ ᜊ ˂˶",
        "Z☡zᶻ",
        "⌯'ᵕ'⌯",
        "𖦹𖦹 .ᐟ.ᐟ",
        "૮・ᴥ・ა",
        "˚⌯> × 𖦹⌯˚",
        "^⎚˕⎚^",
        "ฅ´ ꄃ `ฅ",
        "ᕱ⑅ᕱ",
        "ฅ˙Ⱉ˙ฅ",
        "Oᴗoಣ",
        "'◡'",
        "ʚ˃ ᵕ ˂ ɞ",
        "ʚ✞ɞ",
        "ᜊ ოყ  ხαხყ ᜊ",
        "𖦹ᯅ𖦹.ᐟ.ᐟ",
        "🍛•᎔•🥄",
        "𖥣𖥣 ⠜",
        "˶╹ꇴ╹˶",
        "•⩊•",
        "◡̈ ⑅",
        "୧ᐛو",
        "^⌯𖥦⌯^੭",
        "/ᐠ .⸝⸝⸝. ྀིﾏ",
        "ʕ⁰̈ʕ⁰̈ʔ",
        "₍ᐢ..ᐢ₎ᐝ",
        "૮⑉･-･⑉ა",
        "՞˶･֊･˶՞",
        "ᐞ･֊･ᐞฅ",
        "ミ ᴗ͈ 。ᴗ͈ ミ",
        "ᑒ",
        "𖠚ᐝ",
        "^ ̳ᴗ  ̫ ᴗ ̳^",
        "^›⩊‹^ ੭",
        "◔.̮◔✧",
        "ʢᴗ.ᴗʡᶻ",
        "՞⩌⌯⩌՞ ᶻ 𝗓",
        "/ᐠ. ｡.ᐟ\\ˎˊ˗",
        "𓌉◯𓇋",
        "ꉂ  • ༚ • ིྀต੭",
        "ᗦ↞︎◃︎",
        "ꉂ ･ ･ ☆",
        "꒰ᐢ⸝⸝•༝•⸝⸝ᐢ꒱",
        "𐂐 ჻",
        "𖦤",
        "𐙚 ᯓ",
        "☆✩⋆ ✮ 𖤐",
        "ฅ^•𐃷•^ฅ",
        "ᘏ⑅ᘏ",
        "ᥫ᭡",
        "♡˖ ⊹",
        "ᰔ ෆ.",
        "ᡣ𐭩 ྀིྀ",
        "ᰔᩚ",
        "𓎩 ⸝⸝",
        "^⦁᎑-^ ੭",
        "✎ ̼",
        "ᝰ✍︎꙳⋆",
        "੯‧̀͡ᥬ⑅ྀི\\",
        "₍^˶⦁༝⦁˶^₎◞ ̑̑",
        "＞𐋣＜",
        "ᵔ·͈༝·͈ᵔ",
        "⦁֊⦁꧞",
        "´⚰︎`˵ಣ",
        "๑'~'๑ ɞ ̖́",
        "ᗜ ‸ ᗜ",
        "OvO",
        "˵＞𖥦＜˵",
        "˶>ᗜ<˶",
        "𖦹ࡇ𖦹",
        "๑ᵒᯅᵒ๑",
        ">ᴗoಣ",
        "๑'~'๑ ɞ",
        "꒦ິ^꒦ິ",
        "૮₍ •᎔•₎",
        "•︡ᯅ•︠",
        "ฅ-u-ฅ",
        "๑˃ ᵕ ˂๑",
        "･ิϖ･ิ",
        ">֊<",
        "•ｏ-๑",
        "՞╥⩊╥՞",
        "ദ്ദി˶ᵒ ᵕ ˂)",
        "☆∀☆",
        "/ᐠ > ˕ <マ੭",
        "๑'~'๑",
        "˶╸▵╺˶",
        "⌯'ㅅ'⌯",
        "๑ ˙ᴥ˙ ๑",
        "ꧦ𐅁𐀸𐋠𛰙᭜𖫴𖫰𖫱𖫳𖫲𖫲𖫳𖫴𖫰𖫱꛰ﯩᩝ︪᭜𖫴𖫰𖫱𖫳𖫲𖫲𖫳𖫴𖫰𖫱꛰ީᩝ𛰚",
        "ദ്ദി˶•̀֊•́)✧",
        "= ᗜ ω ᗜ.=",
        "꒰ ⌯︎•ɷ•⌯︎ ꒱",
        "Σ(๑°꒳°๑)ᵎᵎᵎ",
        "(˶>ㅅ<˶)..💬",
        "ට⩊ට◞",
        "ᗜ𐃷ᗜ˶",
        "ಣ˶ᗜ𐃷ᗜ˶ಣ",
        "(๑-ᆺ-๑)...zZZ",
        "⊝ᴥ⊝ᐝ",
        "꒰ঌ࿎♡̸᩠࿎໒꒱",
        "๑>ᴗ<๑⁺！！★⁺°.",
        "🐾ʢᴗ.ᴗʡᶻ",
        "ᯠ  ⑅  ᯄ ᰔᩚ",
        "₊⁺♡₍^˶ ╸𖥦  ╸˵^₎⟆✝︎",
        "^_−☆",
        "☆★*☆",
        "• ֊ •╹╹",
        "◍˃ᵕ˂◍",
        ". ∧ ___∧",
        "=( ⎚⩊⎚--)=",
        "O🍰С \\っ",
        "∪-----∪ ​ ​​​",
        "✌︎˶╹ꇴ╹˶✌︎",
        "╭☞( ￣ ▽￣)╭☞",
        "(｀∀´)Ψ ╰ひ╯",
        "(⋟﹏⋞)",
        "┑(￣Д ￣)┍",
        "\\(≧▽≦)/",
        "無量空処🤞（ｰДｰ）",
        "(▀▀̮▀)",
        "(づ ●─● )づ",
        "(˵¯͒〰¯͒˵)吃喜久福",
        "(ฅ◑ω◑ฅ)",
        "ꉂ(ˊᗜˋ*)",
        "(╬￣皿￣)“——哈？！”",
        "ฅᐞ˶⦁༝⦁˶ᐞฅ",
        "(ÒωÓ๑ゝ∠)",
        "✌︎( ᐛ )✌︎",
        "^^",
        "^ ^",
        "^",
        "^0^",
        "^一^",
        "^⁠_⁠^",
        "●▽●",
        "₍^˶ ╸𖥦 ╸˵^₎⟆喵",
        "⁽⁽ (๑˃̶͈̀ ᗨ ˂̶͈́) ⁾⁾",
        "(∩_∩)",
        "/ᐠ - ˕ -マ Ⳋ",
        "ദ്ദി˶ｰ̀֊ｰ́ )✧",
        "(•̀⌄•́)",
        "（▀▿▀）",
        "↖(^ω^)↗",
        "(๑ゝω╹๑)",
        "( Φ ω Φ )",
        "⎚⩊⎚",
        "=⩌⩊⩌=",
        "⌯⬮⩊ <⌯",
        "( ˵>ㅿ<˵ )♡♡",
        "₍^ₗ   ̫˳ ₗ^₎",
        "ꉂ ᳐˶ᵒ ᵕ ˂˶ ᳐ฅ",
        "(⸝⸝› з ‹⸝⸝)♡",
        "( 𓏼˙ ᴥ ˙𓏼 )",
        "ᶻz ₍^_   ̫ _^₎",
        "૮₍♡>𖥦< ₎ა",
        "ᗜ 𖥦 ᗜ",
        "ʚOᴗOɞ",
        "╥﹏╥",
        "˶>๐<˵",
        "ට⩊ට",
        "ㅠ⩊ㅠ",
        "⁎ •͈ ༝ •͈ ⁎",
        "っ⩊＜｡",
        "៸៸◺𓈊◿៸៸",
        "˙˚⦮ 𐀴    𐀴 ⦯˚˙",
        "꒰ঌ( ⸝⸝๑ ' ꇴ ' ๑⸝⸝ )໒꒱",
        "⁺⊹ꉂ  ᳐˶ᵒ ᵕ ˂˶  ᳐ฅ໑ ₊˚",
        "ᝯ◂ ࠫ‘֊‘ ࠫ▾ಎ➹ ♡",
        "꒰ঌ⌯'ᵕ'⌯໒꒱",
        "(⸝⸝⸝ ╸▵╺⸝⸝⸝) ⋆⁺₊⋆",
        "₍՞˶⦁֊⦁˶՞₎੭ﾞ",
        "٩꒰｡•◡•｡꒱۶",
        "( ˶ ˙º˙˶ ) ୨♡",
        "Σ(๑ ° ω ° ๑)!!",
        "（づ￣3￣）づ╭❤～",
        "(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤",
        "(｡◕ˇ∀ˇ◕)",
        "(＾－＾)V",
        "V (◕ˇ∀ˇ◕｡) V",
        "(*´з)(ε｀*)",
        "Ծ‸Ծ"
    ];

    function removedKey() {
        try { return typeof getStorageKey === 'function' ? getStorageKey('removedKaomoji') : 'removedKaomoji'; }
        catch (e) { return 'removedKaomoji'; }
    }

    function removedSet() {
        try { return new Set(JSON.parse(localStorage.getItem(removedKey()) || '[]')); }
        catch (e) { return new Set(); }
    }

    // 永久删除：加入黑名单，刷新后也不会再出现
    window.removeKaomojiPermanent = function (k) {
        var key = String(k == null ? '' : k).trim();
        if (!key) return;
        try {
            var set = removedSet();
            set.add(key);
            localStorage.setItem(removedKey(), JSON.stringify(Array.from(set)));
        } catch (e) {}
    };

    // 供回复库"字卡→颜文字"使用
    window.getKaomojiFallback = function () { return FALLBACK.slice(); };

    function list() {
        // 系统默认始终保留，再追加你自己添加的颜文字（去重），并剔除已删除的
        var _removed = removedSet();
        var arr = FALLBACK.filter(function (k) { return !_removed.has(String(k).trim()); });
        try {
            if (window._kaomojiLibrary && Array.isArray(window._kaomojiLibrary)) {
                arr = arr.concat(window._kaomojiLibrary);
            }
        } catch (e) {}
        var seen = {};
        return arr.map(function (x) { return String(x == null ? '' : x).trim(); })
            .filter(function (x) {
                if (!x || seen[x] || _removed.has(x)) return false;
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
