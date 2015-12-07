/* configuration */
requirejs.config({
    baseUrl: '/',
    paths: {
        'jquery': 'javascripts/lib/jquery.min',
        'bootstrap': 'javascripts/lib/bootstrap.min',
        'mkEditor': 'mkEditor/mkEditor',
        'runtime': 'javascripts/lib/runtime',
        'articleProc': 'javascripts/app/articleProc',
        'widgetProc': 'javascripts/app/widgetProc',
        'XHR': 'javascripts/app/XHR'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        }
    }
});

/* entry */
require(['jquery', 'bootstrap'], function(jquery, bootstrap) {
    require(['articleProc', 'widgetProc', 'XHR'], function(articleProc, widgetProc, XHR) {
        $(function() {
            var prim_div = $('#primary'),
                sec_div = $('#secondary'),
                pagi_div = $('#content-pagination');

            /* Render articles */
            XHR.getArticlesByPageIdx(0, articleProc.displayArticles);
            /* Render sidebars */
            XHR.getCategories(widgetProc.displayCategories);
            XHR.getTags(widgetProc.displayTags);

            /* Add event listeners */
            // 用户登录事件
            $('#login-submit').on('click', function() {

            });

            // @TO_DO: 添加 新建文章入口。暂时不需login
            sec_div.prepend('<aside class="widget widget-edit"><a href="#" id="btn-article-create" class="btn btn-default btn-block">新建文章</a><aside>');

            // 显示单篇文章详情页
            prim_div.on('click', '.article-title a', function() {
                var id = $(this).parents('article').attr('id').split('-')[1];
                XHR.getArticleById(id, articleProc.displayArticle);
            });
            prim_div.on('click', '.article-permalink a', function() {
                var id = $(this).parents('article').attr('id').split('-')[1];
                XHR.getArticleById(id, articleProc.displayArticle);
            });

            // 切换至新文章编辑
            $('#secondary').on('click', '#btn-article-create', function() {
                articleProc.renderEditor('content-wrap');
                $('#primary .article-editor').attr('id', '-1');
                pagi_div.hide();
            });

            // 切换至已有文章编辑
            prim_div.on('click', '.edit-link', function() {
                var id = $(this).parents('article').attr('id').split('-')[1];
                XHR.getArticleById(id, articleProc.loadArticleInEditor);
                pagi_div.hide();
            });

            // 发布文章，页面跳转显示正文全文
            prim_div.on('click', '.btn-editor-save', function() {
                var article = articleProc.collectInput();
                if (article === {}) return;

                // 获取文章id
                article.article_id = $('#primary .article-editor').attr('id');
                // 更新时间
                if (article.article_id === '-1') {
                    article.article_date_created = article.article_date_modified;
                }
                // @TO_DO: 获取当前username
                article.user_name = 'swordarchor';
                // 添加已发布文章的flag
                article.status_id = '2';
                // 初始化comments
                article.comments = '';
                // @TO_DO: 初始化统计信息
                article.article_statistics = '';

                XHR.saveArticle(article, articleProc.displayArticle);
            });

            // 退出编辑
            prim_div.on('click', '.article-editor .btn-editor-exit', function() {
                // 获取文章id
                var id = $('#primary .article-editor').attr('id'),
                    page_idx;
                if (id !== '-1') {
                    XHR.getArticleById(id, articleProc.displayArticle);
                } else {
                    page_idx = 0; // @TO_DO: 获取当前页
                    XHR.getArticlesByPageIdx(page_idx, articleProc.displayArticles);
                    pagi_div.show();
                }
            });

            /* 完善editor功能之：类别管理 */
            // 新增category item
            prim_div.on('click', '.article-editor .cat-add-link a', function(e) {
                e.preventDefault();
                $('#dialog-input').modal({
                    keyboard: false
                });
            });

        });
    });
});
