/**
 * app.js - 动态加载 App 信息并渲染到页面（中文版）
 * 
 * 工作方式：
 * 1. 首先尝试通过 <script> 加载 app-cn/app-data.js 数据脚本
 * 2. 如果加载成功，使用其中的数据渲染
 * 3. 如果加载失败（本地 file:// 协议下可能受限），使用内联的默认数据
 */
(function() {
    'use strict';

    function renderApps(apps) {
        var appGrid = document.getElementById('app-grid');
        if (!appGrid) return;

        // 清空占位内容
        appGrid.innerHTML = '';

        if (!apps || apps.length === 0) {
            appGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1;">暂无可用应用。</p>';
            return;
        }

        apps.forEach(function(app) {
            var card = document.createElement('a');
            card.href = 'app-cn/' + app.detailPage;
            card.className = 'app-card';
            card.innerHTML =
                '<div class="app-card-image">' +
                    '<img src="app-cn/' + app.coverImage + '" alt="' + app.title + '" loading="lazy">' +
                '</div>' +
                '<div class="app-card-content">' +
                    '<h3>' + app.title + '</h3>' +
                    '<p>' + app.description + '</p>' +
                '</div>';
            appGrid.appendChild(card);
        });
    }

    // 检查是否有通过 app-data.js 注入的数据
    if (window.__APP_DATA__ && window.__APP_DATA__.apps) {
        renderApps(window.__APP_DATA__.apps);
    } else {
        // 尝试动态加载 app-data.js
        var script = document.createElement('script');
        script.src = 'app-cn/app-data.js';
        script.onload = function() {
            if (window.__APP_DATA__ && window.__APP_DATA__.apps) {
                renderApps(window.__APP_DATA__.apps);
            } else {
                renderApps(null);
            }
        };
        script.onerror = function() {
            renderApps(null);
        };
        document.body.appendChild(script);
    }

})();
