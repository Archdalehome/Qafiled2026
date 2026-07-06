/**
 * services.js - 动态加载 Services 信息并渲染到页面
 * 
 * 工作方式：
 * 1. 首先尝试通过 <script> 加载 services-data.js 数据脚本
 * 2. 如果加载成功，使用其中的数据渲染
 * 3. 如果加载失败（本地 file:// 协议下可能受限），使用内联的默认数据
 */
(function() {
    'use strict';

    function renderServices(services) {
        var serviceGrid = document.getElementById('service-grid');
        if (!serviceGrid) return;

        // 清空占位内容
        serviceGrid.innerHTML = '';

        if (!services || services.length === 0) {
            serviceGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1;">No services available yet.</p>';
            return;
        }

        services.forEach(function(service) {
            var card = document.createElement('a');
            card.href = 'services/' + service.detailPage;
            card.className = 'app-card';
            card.innerHTML =
                '<div class="app-card-image">' +
                    '<img src="' + service.coverImage + '" alt="' + service.title + '" loading="lazy">' +
                '</div>' +
                '<div class="app-card-content">' +
                    '<h3>' + service.title + '</h3>' +
                    '<p>' + service.description + '</p>' +
                '</div>';
            serviceGrid.appendChild(card);
        });
    }

    // 检查是否有通过 services-data.js 注入的数据
    if (window.__SERVICES_DATA__ && window.__SERVICES_DATA__.services) {
        renderServices(window.__SERVICES_DATA__.services);
    } else {
        // 尝试动态加载 services-data.js
        var script = document.createElement('script');
        script.src = 'services/services-data.js';
        script.onload = function() {
            if (window.__SERVICES_DATA__ && window.__SERVICES_DATA__.services) {
                renderServices(window.__SERVICES_DATA__.services);
            } else {
                renderServices(null);
            }
        };
        script.onerror = function() {
            renderServices(null);
        };
        document.body.appendChild(script);
    }

})();
