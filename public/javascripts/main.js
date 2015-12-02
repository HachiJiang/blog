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

        // 保存文章，页面跳转显示正文全文

        // 退出编辑

    });
});
