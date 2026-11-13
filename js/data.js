(function () {
    'use strict';
    (function blockDm6CSS() {
        if (document.getElementById('dm6-style')) return; 
        var s = document.createElement('style');
        s.id = 'dm6-style'; 
        s.textContent = '/* dm6-style blocked by data-modal v9 */';
        document.head.appendChild(s);
    })();

    var INNER_HTML =
        '<div class="dm-topbar">'
        +   '<div class="dm-topbar-left">'
        +     '<button class="dm-topbar-back" id="back-data"><i class="fas fa-arrow-left"></i></button>'
        +     '<span class="dm-topbar-title">数据管理</span>'
        +   '</div>'
        +   '<button class="dm-topbar-close" id="close-data"><i class="fas fa-xmark"></i></button>'
        + '</div>'

        + '<div class="dm-body">'

        +   '<div class="dm-storage-card">'
        +     '<div class="dm-storage-header">'
        +       '<span class="dm-storage-title"><i class="fas fa-database" style="margin-right:5px;opacity:0.55"></i>存储用量</span>'
        +       '<span class="dm-storage-label" id="dm-storage-total">计算中…</span>'
        +     '</div>'
        +     '<div class="dm-stats-grid">'
        +       '<div class="dm-stat-block"><div class="dm-stat-block-icon" style="color:var(--accent-color)"><i class="fas fa-comments"></i></div><div class="dm-stat-pill-val" id="dm-stat-msgs">—</div><div class="dm-stat-pill-key">聊天记录</div></div>'
        +       '<div class="dm-stat-block"><div class="dm-stat-block-icon" style="color:#9C6FD4"><i class="fas fa-sliders"></i></div><div class="dm-stat-pill-val" id="dm-stat-settings">—</div><div class="dm-stat-pill-key">设置数据</div></div>'
        +       '<div class="dm-stat-block"><div class="dm-stat-block-icon" style="color:#3BC8A4"><i class="fas fa-images"></i></div><div class="dm-stat-pill-val" id="dm-stat-media">—</div><div class="dm-stat-pill-key">图片媒体</div></div>'
        +     '</div>'
        +     '<div class="dm-progress-track"><div class="dm-progress-fill" id="dm-storage-bar" style="width:0%"></div></div>'
        +   '</div>'

        +   '<div class="dm-section-label" style="color:var(--text-primary);"><i class="fab fa-github"></i> GitHub 云端记忆库</div>'
        +   '<div class="dm-row-card" style="padding:15px;display:flex;flex-direction:column;gap:10px;">'
        +     '<div style="font-size:11px;color:var(--text-secondary);line-height:1.6;background:rgba(0,0,0,0.03);padding:10px;border-radius:8px;">'
        +       '<b>【Private 模式（日常推荐）】</b>：仅支持将纯文本记录“自动/手动”备份至云端。若需恢复，请去 GitHub 下载对应的 JSON，在下方点击“聊天记录”手动导入。<br>'
        +       '<div style="margin-top:4px;"><b>【Public 模式（快捷恢复）】</b>：前往 GitHub 将此仓库 Settings 底部的 Visibility 改为 Public，点击下方“一键恢复”即可还原。<b>⚠ 注意：恢复成功后请立刻改回 Private 防偷窥！</b></div>'
        +     '</div>'
        +     '<input type="password" id="gh-token" placeholder="输入 GitHub Token（必须具备 repo 权限）" style="padding:10px;border-radius:8px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-primary);font-size:12px;outline:none;" oninput="window.GitHubSync.saveConfig()">'
        +     '<input type="text" id="gh-repo" placeholder="仓库路径（如 GojoNozomi/Satoru-Nozomi-Memory）" style="padding:10px;border-radius:8px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-primary);font-size:12px;outline:none;" oninput="window.GitHubSync.saveConfig()">'
        +     '<input type="text" id="gh-path" placeholder="存储文件名（如 chat_history.json）" value="chat_history.json" style="padding:10px;border-radius:8px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-primary);font-size:12px;outline:none;" oninput="window.GitHubSync.saveConfig()">'
        +     '<div style="display:flex;align-items:center;justify-content:space-between;border-top:1px dashed var(--border-color);padding-top:10px;margin-top:2px;">'
        +       '<div style="font-size:12px;font-weight:600;"><i class="fas fa-sync" style="color:var(--accent-color);margin-right:6px;"></i>自动备份聊天记录</div>'
        +       '<label class="dm-toggle-pill"><input type="checkbox" id="gh-autosync-toggle" onchange="window.GitHubSync.saveConfig()"><span class="dm-toggle-slider"></span></label>'
        +     '</div>'
        +     '<div style="display:flex;gap:10px;margin-top:6px;">'
        +       '<button class="modal-btn modal-btn-secondary" onclick="window.GitHubSync.pullUI()" style="flex:1;font-size:12px;padding:8px;"><i class="fas fa-cloud-download-alt"></i> 一键恢复</button>'
        +       '<button class="modal-btn modal-btn-primary" onclick="window.GitHubSync.pushUI()" style="flex:1;font-size:12px;padding:8px;background:var(--accent-color);color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.25);border:none;"><i class="fas fa-cloud-upload-alt"></i> 上传云端</button>'
        +     '</div>'
        +     '<div id="gh-sync-status" style="font-size:11px;color:var(--text-secondary);text-align:center;margin-top:4px;">状态：待命</div>'
        +   '</div>'

        +   '<div class="dm-section-label"><i class="fas fa-cloud-upload-alt"></i> 备份与恢复</div>'
        +   '<div class="dm-grid">'
        +     '<div class="dm-tile" id="dm-tile-full-backup">'
        +       '<div class="dm-tile-icon blue"><i class="fas fa-layer-group"></i></div>'
        +       '<div class="dm-tile-info"><div class="dm-tile-title">全量备份</div><div class="dm-tile-desc">所有设置与数据</div></div>'
        +       '<i class="fas fa-chevron-right dm-tile-arrow"></i>'
        +     '</div>'
        +     '<div class="dm-tile" id="dm-tile-chat-backup">'
        +       '<div class="dm-tile-icon teal"><i class="fas fa-comments"></i></div>'
        +       '<div class="dm-tile-info"><div class="dm-tile-title">聊天记录</div><div class="dm-tile-desc">消息内容单独备份</div></div>'
        +       '<i class="fas fa-chevron-right dm-tile-arrow"></i>'
        +     '</div>'
        +   '</div>'

        +   '<div style="display:none">'
        +     '<button id="export-all-settings"></button>'
        +     '<button id="import-all-settings"></button>'
        +     '<button id="export-chat-btn"></button>'
        +     '<button id="import-chat-btn"></button>'
        +   '</div>'

        +   '<div class="dm-section-label"><i class="fas fa-bell"></i> 通知与关于</div>'
        +   '<div class="dm-row-card">'
        +     '<div class="dm-row-item">'
        +       '<div class="dm-row-icon amber"><i class="fas fa-bell"></i></div>'
        +       '<div class="dm-row-info"><div class="dm-row-title">后台消息推送</div><div class="dm-row-desc" id="notif-status-text">收到新消息时弹出提醒</div></div>'
        +       '<label class="dm-toggle-pill"><input type="checkbox" id="notif-permission-toggle" onchange="handleNotifToggle(this)"><span class="dm-toggle-slider"></span></label>'
        +     '</div>'
        +   '</div>'

        +   '<div class="dm-section-label danger-label"><i class="fas fa-triangle-exclamation"></i> 危险操作</div>'
        +   '<div class="dm-danger-cards dm-danger-cards-row">'
        +     '<button class="dm-danger-card dm-danger-card-orange dm-danger-card-half" id="clear-chat-only">'
        +       '<div class="dm-danger-card-icon"><i class="fas fa-eraser"></i></div>'
        +       '<div class="dm-danger-card-body">'
        +         '<div class="dm-danger-card-title">清除会话</div>'
        +         '<div class="dm-danger-card-desc">删除本会话消息</div>'
        +       '</div>'
        +     '</button>'
        +     '<button class="dm-danger-card dm-danger-card-red dm-danger-card-half" id="clear-storage">'
        +       '<div class="dm-danger-card-icon"><i class="fas fa-skull-crossbones"></i></div>'
        +       '<div class="dm-danger-card-body">'
        +         '<div class="dm-danger-card-title">重置数据</div>'
        +         '<div class="dm-danger-card-desc">清空所有，不可撤销</div>'
        +       '</div>'
        +     '</button>'
        +   '</div>'

        + '</div>'
        ;

    var DRAWER_FULL_HTML =
        '<div class="dm-action-drawer" id="dm-drawer-full">'
        +   '<div class="dm-drawer-backdrop" id="dm-drawer-full-backdrop"></div>'
        +   '<div class="dm-drawer-sheet">'
        +     '<div class="dm-drawer-handle"></div>'
        +     '<div class="dm-drawer-title">'
        +       '<div class="dm-drawer-title-icon blue" style="background:linear-gradient(135deg,#4A90E2,#3576C8);color:#fff"><i class="fas fa-layer-group"></i></div>'
        +       '<div><div class="dm-drawer-title-text">全量备份</div><div class="dm-drawer-subtitle">包含所有设置、外观、字卡等数据</div></div>'
        +     '</div>'
        +     '<div class="dm-drawer-actions">'
        +       '<button class="dm-drawer-action-btn primary" id="export-all-settings-real">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-download"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">导出备份</div><div class="dm-drawer-btn-desc">将数据保存为文件</div></div>'
        +       '</button>'
        +       '<button class="dm-drawer-action-btn" id="import-all-settings-real">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-upload"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">从文件恢复</div><div class="dm-drawer-btn-desc">选择之前导出的备份文件</div></div>'
        +       '</button>'
        +     '</div>'
        +     '<button class="dm-drawer-cancel" id="dm-drawer-full-cancel">取消</button>'
        +   '</div>'
        + '</div>';

    var DRAWER_CHAT_HTML =
        '<div class="dm-action-drawer" id="dm-drawer-chat">'
        +   '<div class="dm-drawer-backdrop" id="dm-drawer-chat-backdrop"></div>'
        +   '<div class="dm-drawer-sheet">'
        +     '<div class="dm-drawer-handle"></div>'
        +     '<div class="dm-drawer-title">'
        +       '<div class="dm-drawer-title-icon" style="background:linear-gradient(135deg,#3BC8A4,#20A882);color:#fff"><i class="fas fa-comments"></i></div>'
        +       '<div><div class="dm-drawer-title-text">聊天记录</div><div class="dm-drawer-subtitle">仅包含消息内容</div></div>'
        +     '</div>'
        +     '<div class="dm-drawer-actions">'
        +       '<button class="dm-drawer-action-btn primary" id="export-chat-btn-real" style="background:linear-gradient(135deg,#3BC8A4,#20A882);border-color:#3BC8A4">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-download"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">导出聊天</div><div class="dm-drawer-btn-desc">将消息记录保存为文件</div></div>'
        +       '</button>'
        +       '<button class="dm-drawer-action-btn" id="import-chat-btn-real">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-upload"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">导入聊天</div><div class="dm-drawer-btn-desc">从文件恢复历史消息</div></div>'
        +       '</button>'
        +     '</div>'
        +     '<button class="dm-drawer-cancel" id="dm-drawer-chat-cancel">取消</button>'
        +   '</div>'
        + '</div>';

    function isCorrect(mc) {
        return mc.querySelector('.dm-topbar') !== null
            && mc.querySelector('.dm-storage-card') !== null
            && mc.querySelector('.dm6') === null
            && mc.querySelector('.dm6-tabs') === null;
    }

    function ensureDrawersOnBody() {
        var DRAWER_IDS = ['dm-drawer-full', 'dm-drawer-chat'];
        DRAWER_IDS.forEach(function(id) {
            var existing = document.getElementById(id);
            if (existing && existing.parentElement === document.body) return;
            if (existing) {
                document.body.appendChild(existing);
                return;
            }
            var dummy = document.createElement('div');
            if (id === 'dm-drawer-full') dummy.innerHTML = DRAWER_FULL_HTML;
            else dummy.innerHTML = DRAWER_CHAT_HTML;
            document.body.appendChild(dummy.firstElementChild);
        });
    }

    function writeHTML(mc) {
        mc.innerHTML = INNER_HTML;
        mc.dataset.dm6Built = 'v9'; 
        ensureDrawersOnBody();
        bindAll(mc);
    }

    function ensureHTML(mc) {
        if (!mc) return;
        mc.dataset.dm6Built = 'v9'; 
        if (!isCorrect(mc)) writeHTML(mc);
        else ensureDrawersOnBody(); 
    }

    function fmt(b) {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        return (b / 1048576).toFixed(2) + ' MB';
    }

    function applyStats(total, msgs, cfg, media) {
        var pct = Math.min(100, total / (5 * 1024 * 1024) * 100);
        var g = function (id) { return document.getElementById(id); };
        var bar = g('dm-storage-bar');
        if (bar) {
            bar.style.width = pct.toFixed(1) + '%';
            bar.style.background = pct > 80
                ? 'linear-gradient(90deg,#FF3B30,#CC0000)'
                : pct > 50
                ? 'linear-gradient(90deg,#FF9F0A,#E07000)'
                : 'linear-gradient(90deg,var(--accent-color),rgba(var(--accent-color-rgb),0.6))';
        }
        if (g('dm-storage-total')) g('dm-storage-total').textContent = fmt(total) + ' / ~5 MB';
        if (g('dm-stat-msgs'))     g('dm-stat-msgs').textContent     = fmt(msgs);
        if (g('dm-stat-settings')) g('dm-stat-settings').textContent = fmt(cfg);
        if (g('dm-stat-media'))    g('dm-stat-media').textContent    = fmt(media);
    }

    function updateStats() {
        var total = 0, msgs = 0, cfg = 0, media = 0;
        var processLS = function () {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i) || '';
                var v = localStorage.getItem(k) || '';
                var bytes = (k.length + v.length) * 2;
                total += bytes;
                if (/messages|msgs|session/i.test(k)) msgs += bytes;
                else if (v.startsWith('data:image') || v.startsWith('data:video')) media += bytes;
                else cfg += bytes;
            }
            applyStats(total, msgs, cfg, media);
        };
        try {
            if (window.localforage) {
                localforage.keys().then(function (keys) {
                    var promises = keys.map(function (k) {
                        return localforage.getItem(k).then(function (raw) {
                            if (raw == null) return { k: k, b: 0 };
                            var str = typeof raw === 'string' ? raw : JSON.stringify(raw);
                            return { k: k, b: (k.length + str.length) * 2 };
                        });
                    });
                    Promise.all(promises).then(function (results) {
                        results.forEach(function (r) {
                            total += r.b;
                            if (/messages|msgs|session/i.test(r.k)) msgs += r.b;
                            else if (/avatar|image|photo|bg|background|wallpaper/i.test(r.k)) media += r.b;
                            else cfg += r.b;
                        });
                        applyStats(total, msgs, cfg, media);
                    }).catch(processLS);
                }).catch(processLS);
            } else { processLS(); }
        } catch (e) { processLS(); }
    }

    function syncToggles() {
        var n = document.getElementById('notif-permission-toggle');
        if (n) n.checked = localStorage.getItem('notifEnabled') === '1'
                        && 'Notification' in window
                        && Notification.permission === 'granted';
    }

    function openDrawer(drawerId) {
        var drawer = document.getElementById(drawerId);
        if (!drawer) return;
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer(drawerId) {
        var drawer = document.getElementById(drawerId);
        if (!drawer) return;
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    function bindAll(mc) {
        var closeBtn = mc.querySelector('#close-data');
        if (closeBtn) closeBtn.addEventListener('click', function () {
            var modal = document.getElementById('data-modal');
            if (modal && typeof hideModal === 'function') hideModal(modal);
        });

        var backBtn = mc.querySelector('#back-data');
        if (backBtn) backBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            var settingsModal = document.getElementById('settings-modal');
            if (settingsModal && typeof showModal === 'function') showModal(settingsModal);
        });

        var tileFullBackup = mc.querySelector('#dm-tile-full-backup');
        if (tileFullBackup) tileFullBackup.addEventListener('click', function () { openDrawer('dm-drawer-full'); });

        var tileChatBackup = mc.querySelector('#dm-tile-chat-backup');
        if (tileChatBackup) tileChatBackup.addEventListener('click', function () { openDrawer('dm-drawer-chat'); });

        var fullDrawer = document.getElementById('dm-drawer-full');
        if (fullDrawer) {
            var backdrop1 = fullDrawer.querySelector('#dm-drawer-full-backdrop');
            if (backdrop1) backdrop1.addEventListener('click', function () { closeDrawer('dm-drawer-full'); });
            var cancelBtn1 = fullDrawer.querySelector('#dm-drawer-full-cancel');
            if (cancelBtn1) cancelBtn1.addEventListener('click', function () { closeDrawer('dm-drawer-full'); });
            var exportAllReal = fullDrawer.querySelector('#export-all-settings-real');
            if (exportAllReal) exportAllReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-full');
                if (typeof exportAllData === 'function') exportAllData();
            });
            var importAllReal = fullDrawer.querySelector('#import-all-settings-real');
            if (importAllReal) importAllReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-full');
                var inp = document.createElement('input');
                inp.type = 'file'; inp.accept = '.json,.zip,application/json,application/zip';
                inp.onchange = function (e) {
                    var f = e.target.files && e.target.files[0];
                    if (f && typeof importAllData === 'function') importAllData(f);
                };
                inp.click();
            });
        }

        var chatDrawer = document.getElementById('dm-drawer-chat');
        if (chatDrawer) {
            var backdrop2 = chatDrawer.querySelector('#dm-drawer-chat-backdrop');
            if (backdrop2) backdrop2.addEventListener('click', function () { closeDrawer('dm-drawer-chat'); });
            var cancelBtn2 = chatDrawer.querySelector('#dm-drawer-chat-cancel');
            if (cancelBtn2) cancelBtn2.addEventListener('click', function () { closeDrawer('dm-drawer-chat'); });
            var exportChatReal = chatDrawer.querySelector('#export-chat-btn-real');
            if (exportChatReal) exportChatReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-chat');
                if (typeof exportChatHistory === 'function') exportChatHistory();
            });
            var importChatReal = chatDrawer.querySelector('#import-chat-btn-real');
            if (importChatReal) importChatReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-chat');
                var inp = document.createElement('input');
                inp.type = 'file'; inp.accept = '.json';
                inp.onchange = function (e) {
                    var f = e.target.files && e.target.files[0];
                    if (f && typeof importChatHistory === 'function') importChatHistory(f);
                };
                inp.click();
            });
        }

        var clearChatBtn = mc.querySelector('#clear-chat-only');
        if (clearChatBtn) clearChatBtn.addEventListener('click', function () {
            if (!confirm('确定要清除当前会话的所有消息吗？\n\n所有设置、头像、字卡等数据将保留，仅聊天记录会被删除。\n\n此操作无法恢复！')) return;
            // 修复：直接赋值 let messages（window.messages 赋值不影响 let 绑定）
            messages = [];
            displayedMessageCount = typeof HISTORY_BATCH_SIZE !== 'undefined' ? HISTORY_BATCH_SIZE : 20;
            try { localStorage.removeItem('BACKUP_V1_critical'); } catch(e) {}
            try { localStorage.removeItem('BACKUP_V1_timestamp'); } catch(e) {}
            if (window.localforage && typeof getStorageKey === 'function') {
                localforage.setItem(getStorageKey('chatMessages'), []).catch(function() {});
            }
            if (typeof renderMessages === 'function') renderMessages();
            if (typeof showNotification === 'function') showNotification('聊天记录已清除', 'success');
        });

        var clearBtn = mc.querySelector('#clear-storage');
        if (clearBtn) clearBtn.addEventListener('click', function () {
            if (!confirm('⚠️ 确定要清空全部数据吗？\n\n所有消息、设置、字卡、头像等将被永久删除，不可恢复！')) return;
            if (!confirm('最后确认：清空后页面将自动刷新，无法撤销，继续吗？')) return;
            window._skipBackup = true;
            var doReset = function () {
                localStorage.clear();
                if (typeof showNotification === 'function') showNotification('所有数据已清空，即将刷新…', 'info', 2000);
                setTimeout(function () { window.location.href = window.location.pathname + '?reset=' + Date.now(); }, 2000);
            };
            window.localforage ? localforage.clear().then(doReset).catch(doReset) : doReset();
        });

        var exportAll = mc.querySelector('#export-all-settings');
        if (exportAll) exportAll.addEventListener('click', function () {
            if (typeof exportAllData === 'function') exportAllData();
        });

        var importAll = mc.querySelector('#import-all-settings');
        if (importAll) importAll.addEventListener('click', function () {
            var inp = document.createElement('input');
            inp.type = 'file'; inp.accept = '.json,.zip,application/json,application/zip';
            inp.onchange = function (e) {
                var f = e.target.files && e.target.files[0];
                if (f && typeof importAllData === 'function') importAllData(f);
            };
            inp.click();
        });

        var exportChat = mc.querySelector('#export-chat-btn');
        if (exportChat) exportChat.addEventListener('click', function () {
            if (typeof exportChatHistory === 'function') exportChatHistory();
        });

        var importChat = mc.querySelector('#import-chat-btn');
        if (importChat) importChat.addEventListener('click', function () {
            var inp = document.createElement('input');
            inp.type = 'file'; inp.accept = '.json';
            inp.onchange = function (e) {
                var f = e.target.files && e.target.files[0];
                if (f && typeof importChatHistory === 'function') importChatHistory(f);
            };
            inp.click();
        });

        var creditsBtn = mc.querySelector('#open-credits-btn');
        if (creditsBtn) creditsBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            var disc = document.getElementById('disclaimer-modal');
            if (disc && typeof showModal === 'function') showModal(disc);
        });

        var tutorialBtn = mc.querySelector('#replay-tutorial-btn');
        if (tutorialBtn) tutorialBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            if (typeof startTour === 'function') {
                if (window.localforage && window.APP_PREFIX) {
                    localforage.removeItem(APP_PREFIX + 'tour_seen').then(startTour).catch(startTour);
                } else { startTour(); }
            }
        });
    }

    function onModalOpen(modal) {
        var mc = modal.querySelector('.modal-content');
        if (!mc) return;
        ensureHTML(mc);
        requestAnimationFrame(function () {
            mc.style.opacity = '1';
            mc.style.transform = 'none';
        });
        setTimeout(function () {
            updateStats();
            syncToggles();
            if (window.GitHubSync) window.GitHubSync.loadUI();
        }, 60);
    }

    var _styleObserver = null;
    var _contentObserver = null;

    function init() {
        var modal = document.getElementById('data-modal');
        if (!modal) return;

        var mc = modal.querySelector('.modal-content');
        if (mc) mc.dataset.dm6Built = 'v9';

        if (_styleObserver) { _styleObserver.disconnect(); _styleObserver = null; }
        if (_contentObserver) { _contentObserver.disconnect(); _contentObserver = null; }

        _styleObserver = new MutationObserver(function () {
            var d = modal.style.display;
            if (d === 'flex' || d === 'block') onModalOpen(modal);
        });
        _styleObserver.observe(modal, { attributes: true, attributeFilter: ['style'] });

        if (mc) {
            _contentObserver = new MutationObserver(function () {
                var mc2 = modal.querySelector('.modal-content');
                if (mc2 && !isCorrect(mc2)) {
                    mc2.dataset.dm6Built = 'v9';
                    writeHTML(mc2);
                }
            });
            _contentObserver.observe(mc, { childList: true, subtree: false });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
    } else {
        init();
    }

})();

/* ☁️ ========== GitHub 自动化云端大脑 ========== ☁️ */
window.GitHubSync = {
    getPfx: function () { return (typeof window.APP_PREFIX !== 'undefined' ? window.APP_PREFIX : 'CHAT_APP_V4_'); },
    getConfig: function () {
        var pfx = this.getPfx();
        return {
            token: localStorage.getItem(pfx + 'gh_token') || '',
            repo: localStorage.getItem(pfx + 'gh_repo') || '',
            path: localStorage.getItem(pfx + 'gh_path') || 'chat_history.json',
            auto: localStorage.getItem(pfx + 'gh_auto') === '1'
        };
    },
    saveConfig: function () {
        var pfx = this.getPfx();
        if (document.getElementById('gh-token')) localStorage.setItem(pfx + 'gh_token', document.getElementById('gh-token').value.trim());
        if (document.getElementById('gh-repo')) localStorage.setItem(pfx + 'gh_repo', document.getElementById('gh-repo').value.trim());
        if (document.getElementById('gh-path')) localStorage.setItem(pfx + 'gh_path', document.getElementById('gh-path').value.trim());
        if (document.getElementById('gh-autosync-toggle')) localStorage.setItem(pfx + 'gh_auto', document.getElementById('gh-autosync-toggle').checked ? '1' : '0');
    },
    loadUI: function () {
        var cfg = this.getConfig();
        if (document.getElementById('gh-token')) document.getElementById('gh-token').value = cfg.token;
        if (document.getElementById('gh-repo')) document.getElementById('gh-repo').value = cfg.repo;
        if (document.getElementById('gh-path')) document.getElementById('gh-path').value = cfg.path;
        if (document.getElementById('gh-autosync-toggle')) document.getElementById('gh-autosync-toggle').checked = cfg.auto;
    },
    setStatus: function (msg, isError) {
        var el = document.getElementById('gh-sync-status');
        if (el) {
            el.textContent = '状态：' + msg;
            el.style.color = isError ? '#ff4757' : 'var(--accent-color)';
        }
    },
    cleanToken: function (str) { return (str || '').replace(/[^a-zA-Z0-9_]/g, ''); },
    cleanRepo: function (str) { return (str || '').replace(/[^a-zA-Z0-9_.\/-]/g, ''); },
    cleanPath: function (str) { return (str || '').replace(/[^a-zA-Z0-9_./-]/g, ''); },

    pushUI: async function () {
        this.setStatus('正在全量推送...', false);
        var res = await this.push({ full: true });
        this.setStatus(res.msg, !res.success);
        if (res.success && typeof showNotification === 'function') showNotification('云端全量备份成功！', 'success');
    },

    pullUI: async function () {
        var cfg = this.getConfig();
        var cRepo = this.cleanRepo(cfg.repo);
        var cPath = this.cleanPath(cfg.path);

        if (!cRepo) return this.setStatus('请先填写仓库路径', true);
        this.setStatus('正在走公开免密通道拉取并智能重构...', false);
        try {
            var fetchJsonAny = async function (path) {
                var urls = [
                    'https://raw.githubusercontent.com/' + cRepo + '/main/' + path,
                    'https://raw.githubusercontent.com/' + cRepo + '/master/' + path
                ];
                for (var u = 0; u < urls.length; u++) {
                    var r = await fetch(urls[u], { cache: 'no-store' });
                    if (r.ok) return await r.json();
                }
                throw new Error('拉取失败，请确保改成了 Public');
            };

            var msgs = await fetchJsonAny(cPath);
            if (msgs && msgs.chunked) {
                this.setStatus('检测到分片备份，正在合并 ' + msgs.parts + ' 个分片...', false);
                var all = [];
                for (var p = 1; p <= msgs.parts; p++) {
                    var partName = msgs.base + String(p).padStart(2, '0') + '.json';
                    var arr = await fetchJsonAny(partName);
                    if (Array.isArray(arr)) all = all.concat(arr);
                }
                msgs = all;
            }
            if (!Array.isArray(msgs)) throw new Error('云端内容不正确');

            var restoredMsgs = msgs.map(function (m) {
                var ts = m.timestamp;
                if (!ts && m.id && !isNaN(m.id)) ts = new Date(Number(m.id)).toISOString();
                var out = {
                    id: m.id,
                    sender: m.sender,
                    text: m.text !== undefined ? m.text : (m.content || ''),
                    timestamp: ts,
                    status: m.status || (m.sender === 'user' ? 'read' : 'received'),
                    favorited: m.favorited || false,
                    note: m.note || null
                };
                if (m.replyTo) out.replyTo = m.replyTo;
                return out;
            });
            restoredMsgs.sort(function (a, b) { return Number(a.id) - Number(b.id); });

            var storageKey = typeof getStorageKey === 'function' ? getStorageKey('chatMessages') : (this.getPfx() + 'chatMessages');
            await localforage.setItem(storageKey, restoredMsgs);
            if (typeof window.messages !== 'undefined') window.messages = restoredMsgs;
            if (typeof renderMessages === 'function') renderMessages();
            if (typeof updateStorageUsageBar === 'function') updateStorageUsageBar();

            this.setStatus('云端纯享版拉取并系统重构成功！', false);
            if (typeof showNotification === 'function') showNotification('记录已完美归位！', 'success');
        } catch (e) {
            this.setStatus('拉取报错: ' + e.message, true);
        }
    },

    push: async function (opts) {
        opts = opts || {};
        var full = !!opts.full;
        var cfg = this.getConfig();
        var cToken = this.cleanToken(cfg.token);
        var cRepo = this.cleanRepo(cfg.repo);
        var cPath = this.cleanPath(cfg.path);

        if (!cToken || !cRepo) return { success: false, msg: '缺失密钥或配置' };
        if (this._busy) return { success: false, msg: '正在同步中，请稍候' };
        this._busy = true;
        try {
            var storageKey = typeof getStorageKey === 'function' ? getStorageKey('chatMessages') : (this.getPfx() + 'chatMessages');
            var messages = await localforage.getItem(storageKey) || window.messages || [];
            if (!messages || messages.length === 0) return { success: false, msg: '本地没有聊天数据' };

            var slimMessages = [];
            for (var i = 0; i < messages.length; i++) {
                var m = messages[i];
                if (!m) continue;
                var slimM = { id: m.id };
                if (m.sender) slimM.sender = m.sender;

                var rawText = m.text !== undefined ? m.text : (m.content !== undefined ? m.content : '');
                if (typeof rawText === 'string' && rawText.length > 800 && rawText.indexOf('data:image') === 0) {
                    slimM.text = '[图片体积过大，已由云端过滤保命 ☁️]';
                } else {
                    slimM.text = rawText;
                }

                if (m.id && !isNaN(m.id)) {
                    var d = new Date(Number(m.id));
                    var pad = function (n) { return n < 10 ? '0' + n : n; };
                    slimM.time = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
                }
                if (m.replyTo !== undefined && m.replyTo !== null && m.replyTo !== '') slimM.replyTo = m.replyTo;
                slimMessages.push(slimM);
            }

            // 每片 5000 条（约 700KB），按目录存放：satoru/part-01.json
            var CHUNK = 5000;
            var slash = cPath.lastIndexOf('/');
            var dir = slash >= 0 ? cPath.slice(0, slash + 1) : '';
            var partBase = dir + 'part-';
            var partCount = Math.ceil(slimMessages.length / CHUNK);
            var self = this;

            var putFile = async function (path, obj, commitMsg) {
                var content = btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2))));
                var sha = '';
                var gr = await fetch('https://api.github.com/repos/' + cRepo + '/contents/' + path, {
                    headers: { 'Authorization': 'token ' + cToken }
                });
                if (gr.ok) { var gj = await gr.json(); sha = gj.sha; }
                var pr = await fetch('https://api.github.com/repos/' + cRepo + '/contents/' + path, {
                    method: 'PUT',
                    headers: { 'Authorization': 'token ' + cToken, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: commitMsg, content: content, sha: sha })
                });
                return pr.ok;
            };

            if (partCount <= 1) {
                var ok1 = await putFile(cPath, slimMessages, 'sync chat');
                return ok1 ? { success: true, msg: '同步成功（' + slimMessages.length + ' 条）' }
                           : { success: false, msg: '上传被拒绝' };
            }

            // 增量只传最后一片；全量传所有片
            var indices = [];
            if (full) {
                for (var q = 0; q < partCount; q++) indices.push(q);
            } else {
                indices.push(partCount - 1);
            }

            for (var k = 0; k < indices.length; k++) {
                var pi = indices[k];
                if (self.setStatus) self.setStatus('正在上传 ' + (k + 1) + '/' + indices.length + '（part-' + (pi + 1) + '）...', false);
                var part = slimMessages.slice(pi * CHUNK, (pi + 1) * CHUNK);
                var name = partBase + String(pi + 1).padStart(2, '0') + '.json';
                var okp = await putFile(name, part, 'sync part-' + (pi + 1) + '/' + partCount);
                if (!okp) return { success: false, msg: 'part-' + (pi + 1) + ' 上传失败' };
            }

            var manifest = { chunked: true, parts: partCount, total: slimMessages.length, chunkSize: CHUNK, base: partBase };
            var okm = await putFile(cPath, manifest, 'sync manifest');
            if (!okm) return { success: false, msg: '目录文件上传失败' };
            return { success: true, msg: '同步成功（' + (full ? '全量 ' + partCount + ' 片' : '增量 1 片') + '，共 ' + slimMessages.length + ' 条）' };
        } catch (err) {
            return { success: false, msg: err.message };
        } finally {
            this._busy = false;
        }
    }
};

if (!window._ghSyncInterceptorInstalled) {
    window._ghSyncInterceptorInstalled = true;
    var _origSetItem = localforage.setItem;
    localforage.setItem = async function (key, value) {
        var res = await _origSetItem.apply(this, arguments);
        var targetKey = typeof getStorageKey === 'function' ? getStorageKey('chatMessages') : (window.GitHubSync.getPfx() + 'chatMessages');
        if (key === targetKey) {
            if (window.GitHubSync && window.GitHubSync.getConfig().auto) {
                clearTimeout(window._ghSyncTimer);
                window._ghSyncTimer = setTimeout(function () {
                    if (Date.now() - (window._ghLastPushAt || 0) < 5 * 60 * 1000) return;
                    window.GitHubSync.push().then(function (r) {
                        if (r.success) window._ghLastPushAt = Date.now();
                        var el = document.getElementById('gh-sync-status');
                        if (el && r.success) el.textContent = '状态：云端增量同步成功 ✓';
                    });
                }, 60000);
            }
        }
        return res;
    };
}
/* ☁️ ========================================== ☁️ */

function updateStorageUsageBar() {
    var bar   = document.getElementById('dm-storage-bar')   || document.getElementById('storage-usage-fill');
    var text  = document.getElementById('dm-storage-total') || document.getElementById('storage-usage-text');
    if (!bar && !text) return;

    try {
        if (window.localforage && window.APP_PREFIX) {
            localforage.keys().then(function(keys) {
                var promises = keys.map(function(k) {
                    return localforage.getItem(k).then(function(v) {
                        if (v === null || v === undefined) return 0;
                        var str = typeof v === 'string' ? v : JSON.stringify(v);
                        return (k.length + str.length) * 2;
                    });
                });
                Promise.all(promises).then(function(sizes) {
                    var total   = sizes.reduce(function(a,b){return a+b;},0);
                    var usedKB  = (total / 1024).toFixed(1);
                    var maxBytes = 5 * 1024 * 1024;
                    var pct     = Math.min(total / maxBytes * 100, 100).toFixed(1);
                    var fmt     = function(b) { return b<1024 ? b+' B' : b<1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(2)+' MB'; };

                    if (bar) {
                        bar.style.width = pct + '%';
                        if (parseFloat(pct) > 80)
                            bar.style.background = 'linear-gradient(90deg,#FF3B30,#CC0000)';
                        else if (parseFloat(pct) > 50)
                            bar.style.background = 'linear-gradient(90deg,#FF9F0A,#E07000)';
                        else
                            bar.style.background = 'linear-gradient(90deg,var(--accent-color),rgba(var(--accent-color-rgb),0.6))';
                    }
                    if (text) text.textContent = fmt(total) + ' / ~5 MB (' + pct + '%)';
                });
            }).catch(function() {
                var ls = 0;
                for (var i = 0; i < localStorage.length; i++) {
                    var k = localStorage.key(i) || '';
                    var v = localStorage.getItem(k) || '';
                    ls += (k.length + v.length) * 2;
                }
                var pct = Math.min(ls / (5*1024*1024) * 100, 100).toFixed(1);
                if (bar) bar.style.width = pct + '%';
                if (text) text.textContent = (ls/1024).toFixed(1) + ' KB (localStorage)';
            });
        } else {
            if (text) text.textContent = '暂无数据';
            if (bar)  bar.style.width  = '0%';
        }
    } catch(e) {
        if (text) text.textContent = '无法读取';
    }
}

(function() {
    var orig = window.showModal;
    if (typeof orig === 'function') {
        window.showModal = function(el) {
            orig.apply(this, arguments);
            if (el && el.id === 'data-modal') {
                setTimeout(updateStorageUsageBar, 250);
            }
        };
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('data-settings');
    if (btn) {
        btn.addEventListener('click', function() { setTimeout(updateStorageUsageBar, 350); });
    }
});

window._sendPartnerNotification = function(title, body) {
    try {
        if (localStorage.getItem('notifEnabled') !== '1') return;
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        if (!document.hidden) return;
        new Notification(title || '传讯', {
            body: body || '对方发来了消息',
            icon: (document.querySelector('#partner-avatar img') || {}).src,
            tag: 'partner-msg',
            renotify: true
        });
    } catch(e) {}
};

window.handleNotifToggle = function(checkbox) {
    var statusEl = document.getElementById('notif-status-text');
    if (!('Notification' in window)) {
        checkbox.checked = false;
        if (statusEl) statusEl.textContent = '⚠️ 您的浏览器不支持通知功能，请更换浏览器';
        return;
    }
    if (checkbox.checked) {
        Notification.requestPermission().then(function(perm) {
            if (perm === 'granted') {
                if (statusEl) statusEl.textContent = '✅ 已开启 — 当页面在后台时，收到消息会弹出系统通知';
                localStorage.setItem('notifEnabled', '1');
                try { new Notification('传讯通知已开启 ✨', { body: '你现在可以在后台收到消息提醒了', tag: 'notif-test' }); } catch(e) {}
            } else if (perm === 'denied') {
                checkbox.checked = false;
                if (statusEl) statusEl.textContent = '❌ 权限被拒绝，请自行搜索如何开启';
                localStorage.setItem('notifEnabled', '0');
            } else {
                checkbox.checked = false;
                if (statusEl) statusEl.textContent = '⚠️ 未做出选择，请重试';
                localStorage.setItem('notifEnabled', '0');
            }
        }).catch(function() {
            checkbox.checked = false;
            if (statusEl) statusEl.textContent = '❌ 请求权限失败，请自行搜索如何打开';
            localStorage.setItem('notifEnabled', '0');
        });
    } else {
        if (statusEl) statusEl.textContent = '已关闭 — 后台将不再弹出消息提醒';
        localStorage.setItem('notifEnabled', '0');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var toggle   = document.getElementById('notif-permission-toggle');
    var statusEl = document.getElementById('notif-status-text');
    if (!toggle) return;
    var enabled = localStorage.getItem('notifEnabled') === '1';
    var granted = ('Notification' in window) && Notification.permission === 'granted';
    toggle.checked = enabled && granted;
    if (!statusEl) return;
    if (toggle.checked) {
        statusEl.textContent = '✅ 已开启 — 当页面在后台时，收到消息会弹出系统通知';
    } else if ('Notification' in window && Notification.permission === 'denied') {
        statusEl.textContent = '❌ 通知权限已被浏览器屏蔽，请自行搜索如何开启';
    } else {
        statusEl.textContent = '关闭状态 — 开启后可在后台接收消息提醒';
    }
});
