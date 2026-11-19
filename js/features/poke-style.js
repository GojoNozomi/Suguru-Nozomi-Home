/* 🖐 拍一拍美化 —— 玻璃拟态卡片可调样式 */
(function () {
    'use strict';

    var DEFAULTS = { bg: null, text: null, alpha: 16, radius: 18, weight: 600, size: 18 };

    function getStyle() {
        var s = {};
        try { s = (typeof settings !== 'undefined' && settings && settings.pokeStyle) || {}; } catch (e) {}
        return {
            bg: s.bg || null,
            text: s.text || null,
            alpha: typeof s.alpha === 'number' ? s.alpha : DEFAULTS.alpha,
            radius: typeof s.radius === 'number' ? s.radius : DEFAULTS.radius,
            weight: typeof s.weight === 'number' ? s.weight : DEFAULTS.weight,
            size: typeof s.size === 'number' ? s.size : DEFAULTS.size
        };
    }

    function hexToRgb(hex) {
        var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
        if (!m) return null;
        return parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16);
    }

    function apply() {
        var st = getStyle();
        var root = document.documentElement;
        if (st.bg) {
            var rgb = hexToRgb(st.bg);
            if (rgb) root.style.setProperty('--poke-bg-rgb', rgb);
        } else {
            root.style.removeProperty('--poke-bg-rgb');
        }
        root.style.setProperty('--poke-bg-alpha', String(st.alpha / 100));
        root.style.setProperty('--poke-radius', st.radius + 'px');
        root.style.setProperty('--poke-weight', String(st.weight));
        root.style.setProperty('--poke-font-size', st.size + 'px');
        if (st.text) root.style.setProperty('--poke-text', st.text);
        else root.style.removeProperty('--poke-text');
    }

    function save(partial) {
        var st = getStyle();
        Object.keys(partial).forEach(function (k) { st[k] = partial[k]; });
        try { if (typeof settings !== 'undefined' && settings) settings.pokeStyle = st; } catch (e) {}
        apply();
        syncUI();
        if (typeof throttledSaveData === 'function') throttledSaveData();
    }

    function setText(id, v) {
        var el = document.getElementById(id);
        if (el) el.textContent = v;
    }

    function syncUI() {
        var st = getStyle();
        var bg = document.getElementById('poke-bg-color');
        var tx = document.getElementById('poke-text-color');
        var op = document.getElementById('poke-opacity');
        var ra = document.getElementById('poke-radius');
        var we = document.getElementById('poke-weight');
        var fs = document.getElementById('poke-font-size');
        if (fs) fs.value = st.size;
        if (bg && st.bg) bg.value = st.bg;
        if (tx && st.text) tx.value = st.text;
        if (op) op.value = st.alpha;
        if (ra) ra.value = st.radius;
        if (we) we.value = st.weight;
        setText('poke-opacity-val', st.alpha + '%');
        setText('poke-radius-val', st.radius + 'px');
        setText('poke-weight-val', String(st.weight));
        setText('poke-font-size-val', st.size + 'px');
        var bgFollow = document.getElementById('poke-bg-follow');
        var txFollow = document.getElementById('poke-text-follow');
        if (bgFollow) bgFollow.style.opacity = st.bg ? '1' : '0.55';
        if (txFollow) txFollow.style.opacity = st.text ? '1' : '0.55';
    }

    function preview() {
        if (typeof addMessage === 'function') {
            var who = '对方';
            try { who = (settings && settings.partnerName) || '对方'; } catch (e) {}
            addMessage({ id: Date.now(), text: '💚 ' + who + ' 拍了拍你 💚', timestamp: new Date(), type: 'poke' });
        }
    }

    function bind() {
        var bg = document.getElementById('poke-bg-color');
        if (bg && bg.dataset.pokeBound !== '1') {
            bg.dataset.pokeBound = '1';
            bg.addEventListener('input', function () { save({ bg: bg.value }); });
        }
        var tx = document.getElementById('poke-text-color');
        if (tx && tx.dataset.pokeBound !== '1') {
            tx.dataset.pokeBound = '1';
            tx.addEventListener('input', function () { save({ text: tx.value }); });
        }
        var op = document.getElementById('poke-opacity');
        if (op && op.dataset.pokeBound !== '1') {
            op.dataset.pokeBound = '1';
            op.addEventListener('input', function () { save({ alpha: Number(op.value) }); });
        }
        var ra = document.getElementById('poke-radius');
        if (ra && ra.dataset.pokeBound !== '1') {
            ra.dataset.pokeBound = '1';
            ra.addEventListener('input', function () { save({ radius: Number(ra.value) }); });
        }
        var fs = document.getElementById('poke-font-size');
        if (fs && fs.dataset.pokeBound !== '1') {
            fs.dataset.pokeBound = '1';
            fs.addEventListener('input', function () { save({ size: Number(fs.value) }); });
        }
        var we = document.getElementById('poke-weight');
        if (we && we.dataset.pokeBound !== '1') {
            we.dataset.pokeBound = '1';
            we.addEventListener('input', function () { save({ weight: Number(we.value) }); });
        }
        var bgF = document.getElementById('poke-bg-follow');
        if (bgF && bgF.dataset.pokeBound !== '1') {
            bgF.dataset.pokeBound = '1';
            bgF.addEventListener('click', function () { save({ bg: null }); });
        }
        var txF = document.getElementById('poke-text-follow');
        if (txF && txF.dataset.pokeBound !== '1') {
            txF.dataset.pokeBound = '1';
            txF.addEventListener('click', function () { save({ text: null }); });
        }
        var rs = document.getElementById('poke-style-reset');
        if (rs && rs.dataset.pokeBound !== '1') {
            rs.dataset.pokeBound = '1';
            rs.addEventListener('click', function () {
                try { if (typeof settings !== 'undefined' && settings) settings.pokeStyle = Object.assign({}, DEFAULTS); } catch (e) {}
                apply();
                syncUI();
                if (typeof throttledSaveData === 'function') throttledSaveData();
                if (typeof showNotification === 'function') showNotification('拍一拍样式已恢复默认', 'success');
            });
        }
        var tv = document.getElementById('poke-style-test');
        if (tv && tv.dataset.pokeBound !== '1') {
            tv.dataset.pokeBound = '1';
            tv.addEventListener('click', function () {
                preview();
                if (typeof showNotification === 'function') showNotification('已生成一条预览，关闭面板看看效果', 'info', 2200);
            });
        }
        apply();
        syncUI();
    }

    window.applyPokeStyle = apply;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }
    setTimeout(bind, 900);
    setTimeout(bind, 2200);
})();
