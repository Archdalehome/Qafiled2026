/**
 * blog.js - 动态加载 Blog 文章并渲染到页面
 *
 * 工作方式：
 * 1. blog-data.js 已在 blog.html 中同步加载，正常情况下直接使用其中的数据
 * 2. 如果没有文章（posts 为空），保留 HTML 里写好的静态空状态，不清空页面
 * 3. 有文章时渲染成卡片，链接指向 /blog/<id>（Cloudflare Pages 的干净 URL）
 */
(function() {
    'use strict';

    function renderPosts(posts) {
        var blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;

        // 没有文章时不渲染，保留 HTML 里的静态内容（对爬虫友好）
        if (!posts || posts.length === 0) {
            return;
        }

        // 按日期降序排列（最新的在前）
        posts.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        blogGrid.innerHTML = '';

        posts.forEach(function(post) {
            var card = document.createElement('a');
            card.href = '/blog/' + post.id;
            card.className = 'blog-card';
            card.innerHTML =
                '<div class="blog-card-image">' +
                    (post.coverImage
                        ? '<img src="/blog/' + post.coverImage + '" alt="' + post.title + '" loading="lazy">'
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

    if (window.__BLOG_DATA__ && window.__BLOG_DATA__.posts) {
        renderPosts(window.__BLOG_DATA__.posts);
    }
})();
