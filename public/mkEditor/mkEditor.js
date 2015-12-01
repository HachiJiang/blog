/* Markdown Editor: Main module */

define(['mkEditor/lib/jquery.min.js', 'mkEditor/lib/bootstrap.min.js', 'mkEditor/lib/runtime.js', 'mkEditor/mkParser.js', 'exports'], function(jquery, bootstrap, jade, mkParser, exports) {
    // 解析时间
    var parent_div_class = 'mkEditor';
    var weekday = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };

    function _parseDate(date) {
        if (!date) {
            console.log('invalid date to parse');
            return;
        }
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            daytime = date.getDate(),
            day = weekday[date.getDay()],
            hours = date.getHours(),
            minutes = date.getMinutes();

        minutes = minutes < 10 ? "0" + minutes : minutes;
        return year + "年" + month + "月" + daytime + "日 星期" + day + " " + hours + ":" + minutes;
    }

    // 获取markdown编辑器模板
    function _template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;

        buf.push("<div class=\"article-editor\"><h4>文章编辑</h4><div><form class=\"form-group\"><input placeholder=\"标题\" class=\"form-control article-title\"/><div class=\"article-meta-wrap\"><div class=\"pull-left article-cat-wrap\"><span class=\"pull-left\">类别: </span><div class=\"pull-left dropdown\"><button id=\"mkEditor-dropdownMenu\" type=\"button\" data-toggle=\"dropzone\" aria-haspopup=\"true\" aria-expanded=\"true\" class=\"btn btn-default dropdown-toggle\">默认<span class=\"caret\"></span></button><ul aria-labelledby=\"mkEditor-dropdownMenu\" class=\"dropdown-menu\"><li><a href=\"#\">Action</a></li></ul></div></div><btn class=\"pull-left btn-tag-add\"><a href=\"#\">添加标签</a></btn><div class=\"pull-left article-tag-list\"></div></div><div class=\"pull-right article-preview\"><btn data-toggle=\"modal\"><a href=\"#\">预览</a></btn></div><div class=\"article-editor-toolbar\"></div><textarea rows=\"20\" placeholder=\"正文，请使用markdown语法编辑\" class=\"form-control article-content\"></textarea></form></div><div class=\"pull-right\"><button type=\"button\" class=\"btn btn-default btn-editor-exit\">退出编辑</button><button type=\"button\" class=\"btn btn-primary btn-editor-save\">保存文章</button></div></div><div tagindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" class=\"modal dialog-article-preview\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-body\"><p>预览内容</p></div></div></div></div>");;
        return buf.join("");
    }

    // 搜集文章编辑页输入的信息
    function _collectInput() {
        var article = {
                author: 'swordarchor',
                title: $('.article-title').val(),
                tags: [],
                date_created: new Date(),
                content: $('.article-content').val()
            },
            article_id = $('.article-editor .form-group').attr("id"),
            validate_info, tag_nodes, i, il;

        article.id = (article_id === undefined) ? -1 : article_id;
        validate_info = _validateArticleInfo(article);
        if (validate_info.success === false) return validate_info;

        tag_nodes = $('.article-tags').children();
        if (tag_nodes.length !== 0) {
            for (i = 0, il = tag_nodes.length; i < il; i++) {
                article.tags[i] = $(tag_nodes[i]).text();
            }
        }

        return {
            success: true,
            body: article
        };
    }

    // 解析用户输入的文章内容为HTML
    function _parseInputToHTML(article) {
        article.content = mkParser(article.content);
        article.date_created_HTML = _parseDate(article.date_created);
        article.titleHTML = "<div><h1 class='article-title'><a href='#'>" + article.title + "</a></h1><div class='article-meta'><span class='author'>作者：<a href='#'>" + article.author + "</a></span> &bull;<time class='article-date' datetime='" + article.date_created + "' title='" + article.created_date + "'>" + article.date_created_HTML + "</time></div></div>";

        article.tagHTML = [];
        $.each(article.tags, function(i, tag) {
            article.tagHTML[i] = '<a href="#">' + tag + '</a>';
        });
        article.tagHTML.join(",");
        article.contentHTML = "<section class='article-content'>" + article.content + "</section>";

        return '<article class="article">' + article.titleHTML + article.contentHTML + '<footer class="article-footer"><div class="pull-left tag-list">' + article.tagHTML + '</div></footer>' + '</article>';
    }

    // 验证用户输入是否有效
    function _validateArticleInfo(article) {
        var res = {
            success: true,
            body: ''
        };

        if (!article.title) {
            res.success = false;
            res.body = "请输入标题";
        }

        if (!article.content) {
            res.success = false;
            res.body = "请输入文章内容";
        }

        return res;
    }

    /**
     * [render description]
     * @param  {String} id            id of parent div
     * @return null
     */
    exports.render = function render(id) {
        var parent = $('#' + id),
            editor_html;

        if (!id || !parent) {
            console.log('invalid param for render method');
            return;
        }

        // 1. 加载编辑器节点
        editor_html = _template();
        parent.html(editor_html);

        // 2. 绑定事件
        // 预览文章，弹出模态框
        $('.article-editor').on('click', '.article-preview', function() {
            var valid = _collectInput(),
                preview_html,
                dialog_preview;

            if (valid.success === false) {
                preview_html = valid.body;
            } else {
                preview_html = _parseInputToHTML(valid.body);
            }
            preview_html = !preview_html ? '' : preview_html;
            dialog_preview = $('.dialog-article-preview');
            dialog_preview.find('.modal-body').html(preview_html);
            dialog_preview.modal();
        });

        // 点击 添加标签
        $('.article-editor').on('click', '.btn-tag-add a', function() {
            if ($('.article-tag-list input').length > 0) return;
            var tag_input = $('<input type="text" class="article-tag pull-left"></input>');
            $('.article-tag-list').prepend(tag_input);
            $(tag_input).focus();
        });

        // 输入标签转为a
        $('.article-editor').on('keydown', '.article-tag-list input', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                var tag_node = $('<a class="article-tag pull-left"></a>');
                $(tag_node).text(this.value);
                $('.article-editor .article-tag-list input').remove();
                $('.article-tag-list').prepend(tag_node);
            }
        });

        // 标签mouse over时浮动显示删除icon
        $('.article-editor').on('mouseenter', '.article-tag', function() {
            $(this).append('<i class="fa fa-times"></i>');
        });
        $('.article-editor').on('mouseleave', '.article-tag', function() {
            $(this).find('.fa-times').remove();
        });

        // 编辑模式下，点击标签的删除icon
        $('.article-editor').on('click', '.fa-times', function() {
            $(this).parents('.article-tag').remove();
        });

        // 编辑模式下，点击图片icon 插入图片
        $('.article-editor').on('click', '.btn-article-pic', function() {
            $('.upload-file-dialog').modal({
                keyboard: false
            });
        });
    };

    exports.remove = function remove() {
        // 1. 从页面移除editor节点

        // 2. 解除事件绑定
    };

    exports.collectInput = _collectInput;
});
