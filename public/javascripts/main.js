/* configuration */
requirejs.config({
    baseUrl: '/',
    paths: {
        'jquery': 'javascripts/lib/jquery.min',
        'bootstrap': 'javascripts/lib/bootstrap.min',
        'mkEditor': 'mkEditor/mkEditor',
        'runtime': 'javascripts/lib/runtime',
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
require(['jquery', 'bootstrap', 'mkEditor'], function($, bootstrap, mkEditor) {
    /* dom ready event */
    $(function() {
        /* add event listeners */
        // 用户登录事件
        $('#login-submit').on('click', function() {

        });

        // 添加 新建文章入口。暂时不需login
        $('#secondary').prepend('<aside class="widget widget-edit"><a href="#" id="btn-article-create" class="btn btn-default btn-block">新建文章</a><aside>');

        // 切换至文章编辑
        $('#secondary').on('click', '#btn-article-create', function() {
            mkEditor.render('primary');
        });

        // 退出编辑

        // 点击添加标签

        // 输入标签转为a



        /*require(['XHR'], function(XHR) {
            // render articles
            XHR.getArticlesByPageIdx(0, function(article_list) {
                require(['views/article.js'], function(article) {
                    var div_articles = '';
                    for (var i = 0, il = article_list.length; i < il; i++) {
                        div_articles += article.template({
                            'article': article_list[i]
                        });
                    }
                    $('#content-wrap').html(div_articles);
                });

            });

            // render widgets in side bar

        });*/
    });
});
