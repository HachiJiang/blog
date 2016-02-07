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


        });
    });
});
