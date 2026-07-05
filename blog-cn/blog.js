/**
 * blog.js - 动态加载 Blog 文章并渲染到页面（中文版）
 * 
 * 工作方式：
 * 1. 首先尝试通过 <script> 加载 blog-cn/blog-data.js 数据脚本
 * 2. 如果加载成功，使用其中的数据渲染
 * 3. 如果加载失败（本地 file:// 协议下可能受限），使用内联的默认数据
 */
(function() {
    'use strict';

    function renderPosts(posts) {
        var blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        // 清空占位内容
        blogGrid.innerHTML = '';

        if (!posts || posts.length === 0) {
            blogGrid.innerHTML = '<div class="blog-empty"><p>暂无博客文章，敬请期待！</p></div>';
            return;
        }

        // 按日期降序排列（最新的在前）
        posts.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        posts.forEach(function(post) {
            var card = document.createElement('a');
            card.href = 'blog-cn/' + post.id + '.html';
            card.className = 'blog-card';
            card.innerHTML =
                '<div class="blog-card-image">' +
                    (post.coverImage
                        ? '<img src="blog-cn/' + post.coverImage + '" alt="' + post.title + '" loading="lazy">'
                        : '<div class="blog-card-placeholder">📝</div>') +
                '</div>' +
                '<div class="blog-card-content">' +
                    '<div class="blog-card-meta">' +
                        '<span class="blog-card-date">' + post.date + '</span>' +
                        (post.author ? '<span class="blog-card-author">' + post.author + '</span>' : '') +
                    '</div>' +
                    '<h3>' + post.title + '</h3>' +
                    '<p>' + post.description + '</p>' +
                '</div>';
            blogGrid.appendChild(card);
        });
    }

    // 检查是否有通过 blog-data.js 注入的数据
    if (window.__BLOG_DATA__ && window.__BLOG_DATA__.posts) {
        renderPosts(window.__BLOG_DATA__.posts);
    } else {
        // 尝试动态加载 blog-data.js
        var script = document.createElement('script');
        script.src = 'blog-cn/blog-data.js';
        script.onload = function() {
            if (window.__BLOG_DATA__ && window.__BLOG_DATA__.posts) {
                renderPosts(window.__BLOG_DATA__.posts);
            } else {
                renderPosts(null);
            }
        };
        script.onerror = function() {
            renderPosts(null);
        };
        document.body.appendChild(script);
    }

})();
