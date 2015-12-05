/* configuration */
requirejs.config({
    baseUrl: '/',
    paths: {
        'jquery': 'javascripts/lib/jquery.min',
        'bootstrap': 'javascripts/lib/bootstrap.min',
        'home': 'javascripts/home',
        'mkEditor': 'mkEditor/mkEditor',
        'runtime': 'javascripts/lib/runtime',
        'articleProc': 'javascripts/app/articleProc',
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
    require(['articleProc', 'XHR'], function(articleProc, XHR) {
        $(function() {
            /* add event listeners */
            // 用户登录事件
            $('#login-submit').on('click', function() {

            });

            // 添加 新建文章入口。暂时不需login
            $('#secondary').prepend('<aside class="widget widget-edit"><a href="#" id="btn-article-create" class="btn btn-default btn-block">新建文章</a><aside>');

            // 切换至文章编辑
            $('#secondary').on('click', '#btn-article-create', function() {
                articleProc.renderEditor('primary');
                $('#primary .article-editor').attr('id', '-1');
            });

            // 发布文章，页面跳转显示正文全文
            $('#primary').on('click', '.btn-editor-save', function() {
                var article = articleProc.collectInput();
                if (article === {}) return;

                // 获取文章id
                article.id = $('#primary .article-editor').attr('id');
                // 更新时间
                article.date_created = article.date_collected;
                article.date_modified = article.date_collected;
                // @TO_DO: 获取当前username
                article.author = 'swordarchor';
                // 添加已发布文章的flag
                article.status = '2';
                // 初始化comments
                article.comments = '';
                // @TO_DO: 初始化统计信息
                article.article_statistics = '';

                XHR.saveArticle(article, articleProc.displayArticle);
                // XHR.requestArticleToDisplay(article);
            });

            // 退出编辑

        });
    });
});
