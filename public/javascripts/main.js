/**
 *  configuration
 */
requirejs.config({
    baseUrl: '/',
    paths: {
        'jquery': 'javascripts/lib/jquery.min',
        'bootstrap': 'javascripts/lib/bootstrap.min',
        'mkEditor': 'mkEditor/mkEditor',
        'runtime': 'javascripts/lib/runtime',
        'articleProc': 'javascripts/app/articleProc',
        'widgetProc': 'javascripts/app/widgetProc',
        'XHR': 'javascripts/app/XHR',
        'PagiWidget': 'javascripts/components/PagiWidget'
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
    require(['articleProc', 'widgetProc', 'XHR', 'PagiWidget'], function(articleProc, widgetProc, XHR, PagiWidget) {

        $(function() {

            var pagi = new PagiWidget();

            var content_div = $('#content-wrap'),
                sec_div = $('#secondary'),
                pagi_div = $('#content-pagination'),
                dialog_del = $('#isDel');

            var cat_id_cur, tag_id_cur, page_idx_cur;

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
            content_div.on('click', '.article-title a', function() {
                var id = $(this).parents('article').attr('id').split('-')[1];
                XHR.getArticleById(id, articleProc.displayArticle);
                pagi_div.hide();
            });
            content_div.on('click', '.article-permalink a', function() {
                var id = $(this).parents('article').attr('id').split('-')[1];
                XHR.getArticleById(id, articleProc.displayArticle);
                pagi_div.hide();
            });

            // tag filter
            sec_div.on('click', '.tag-item', function() {
                if ($(this).hasClass('active')) {
                    return;
                }

                var tag_id = widgetProc.extractId($(this).attr('id')),
                    page_idx = 0;

                XHR.getArticlesByTagId(tag_id, page_idx, articleProc.displayArticles);
                widgetProc.updateFilterNd(this);
            });

            // cat filter
            sec_div.on('click', '.cat-item', function() {
                if ($(this).hasClass('active')) {
                    return;
                }

                var cat_id = widgetProc.extractId($(this).attr('id')),
                    page_idx = 0;

                XHR.getArticlesByCatId(cat_id, page_idx, articleProc.displayArticles);
                widgetProc.updateFilterNd(this);
            });

            /* 编辑权限部分 */
            // 切换至新文章编辑
            // @TO_DO: Needs login
            sec_div.on('click', '#btn-article-create', function() {
                articleProc.loadArticleInEditor();
                $('#primary .mk-editor').attr('id', '-1');
                pagi_div.hide();
            });

            // 切换至已有文章编辑
            content_div.on('click', '.edit-link', function() {
                var id = $(this).parents('article').attr('id').split('-')[1];
                if (!id) {
                    console.log('cannot find id');
                    return;
                }

                XHR.getArticleById(id, articleProc.loadArticleInEditor);
                pagi_div.hide();
            });

            // 发布文章，页面跳转显示正文全文
            content_div.on('click', '.btn-editor-save', submitArticle);

            // 退出编辑
            content_div.on('click', '.mk-editor .btn-editor-exit', function() {
                // 获取文章id
                var id = $('.mk-editor').attr('id'),
                    page_idx;
                if (id !== '-1') {
                    XHR.getArticleById(id, articleProc.displayArticle);
                    pagi_div.hide();
                } else {
                    page_idx = 0; // @TO_DO: 获取当前页
                    XHR.getArticlesByPageIdx(page_idx, articleProc.displayArticles);
                    pagi_div.show();
                }
            });

            // 删除文章，刷新/回到主页
            content_div.on('click', '.del-link', function(e) {
                e.preventDefault();
                var id = $(this).parents('article').attr('id').split('-')[1],
                    data;

                if (!id) {
                    console.log('cannot find id');
                    return;
                }

                dialog_del.modal();
                dialog_del.find('#del-submit').attr('target', id);
                data = {
                    id : id,
                    congtent_div: content_div
                };
                $('#del-submit').on('click', data, function(evt) {
                    var page_idx = 0, // @TO_DO: 获取当前页
                        data = evt.data,
                        articleNd = data.congtent_div.find('#article-' + data.id);

                    XHR.deleteArticleById($(this).attr('target'));
                    $(this).removeAttr('target');
                    XHR.getArticlesByPageIdx(page_idx, articleProc.displayArticles);
                    if (articleNd) {
                        articleNd.remove();
                    }
                    dialog_del.modal('hide');
                    pagi_div.show();
                    $(this).off('click');
                });
            });

            // 文章编辑框捕获键盘快捷键
            content_div.on('keypress', 'textarea', function(evt) {
                // [ctrl+s] 保存文章
                if (evt.ctrlKey && evt.which === "83") {
                    submitArticle();
                }
            });

            // submit article info
            function submitArticle() {
                var article = articleProc.collectInput();
                if (article === {}) {
                    return;
                }

                // 获取文章id
                article.article_id = $('.mk-editor').attr('id');
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
            }
        });
    });
});
