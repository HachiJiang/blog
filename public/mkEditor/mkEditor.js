/* Markdown Editor: Main module */

define([
    'mkEditor/lib/jquery.min.js',
    'mkEditor/lib/bootstrap.min.js',
    'mkEditor/lib/runtime.js',
    'mkEditor/mkParser.js',
    'exports',
    'mkEditor/lib/jquery-extend.js'
], function(jquery, bootstrap, jade, mkParser, exports) {
    $.noConflict();

    /**
     * Collect input info
     * @return {Object}
     * {
     *     title: $('.article-title').val(),
     *     category: ,
     *     tags: [],
     *     date_collected: new Date(),
     *     content: $('.article-content').val()
     * }
     */
    exports.collectInput = function() {
        var res = _collectInput();
        return (res.success === true) ? res.body : {};
    };
    exports.render = render;
    exports.remove = remove;
    exports.parseContent = mkParser;

    /**
     * Render
     * @param  {String} id      [description]
     * @param  {Object} article [description]
     * {
     *     title:
     *     category:
     *     tags: [Array]
     *     content:
     * }
     * @return {[type]}         [description]
     */
    function render(id, article) {
        var parent = $('#' + id),
            editor_html;

        if (!id || !parent) {
            console.log('invalid param for render method');
            return;
        }

        // 1. 加载编辑器节点
        if (!article) {
            editor_html = _template();
        } else {
            editor_html = _template({
                'article': article
            });
        }
        parent.html(editor_html);

        // 2. 绑定事件
        _attachEventListeners();
    }

    function remove(id) {
        // 1. 解除事件绑定

        // 2. 从页面移除editor节点
        $('#' + id + ' .article-editor').remove();
    }

    // 获取markdown编辑器模板
    function _template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;;
        var locals_for_with = (locals || {});
        (function(article, undefined) {
            buf.push("<link rel=\"stylesheet\" href=\"/mkEditor/styles/font-awesome.min.css\"/><div class=\"article-editor\"><h4>文章编辑</h4><div><form class=\"form-group\">");
            if (article && article.title) {
                buf.push("<input" + (jade.attrs(jade.merge([{
                    "placeholder": "标题",
                    "class": "form-control article-title"
                }, {
                    'value': article.title
                }]), false)) + "/>");
            } else {
                buf.push("<input placeholder=\"标题\" class=\"form-control article-title\"/>");
            }
            buf.push("<div class=\"article-meta-wrap\"><div class=\"pull-left article-cat-wrap\"><div class=\"pull-left\"><span>类别: </span></div><div class=\"pull-left dropdown\"><button id=\"dropdown-cat-menu\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\" class=\"btn btn-default dropdown-toggle\">默认<span class=\"caret\"></span></button><ul aria-labelledby=\"dropdown-cat-menu\" class=\"dropdown-menu\"><li><a href=\"#\">Action</a></li><li><a href=\"#\">Another action</a></li></ul></div></div><btn class=\"pull-left btn-tag-add\"><a href=\"#\">添加标签</a></btn><div class=\"pull-left article-tag-list\">");
            if (article && article.tags) {
                // iterate article.tags
                ;
                (function() {
                    var $$obj = article.tags;
                    if ('number' == typeof $$obj.length) {

                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var tag = $$obj[$index];

                            buf.push("<a class=\"article-tag pull-left\">" + (jade.escape(null == (jade_interp = tag) ? "" : jade_interp)) + "</a>");
                        }

                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var tag = $$obj[$index];

                            buf.push("<a class=\"article-tag pull-left\">" + (jade.escape(null == (jade_interp = tag) ? "" : jade_interp)) + "</a>");
                        }

                    }
                }).call(this);

            }
            buf.push("</div></div><div class=\"pull-right article-preview\"><btn data-toggle=\"modal\"><a href=\"#\">预览</a></btn></div></form><div style=\"clear:both\" class=\"article-editor-toolbar\"><div class=\"btn btn-default btn-xs btn-article-pic\"><span aria-hidden=\"true\" class=\"fa fa-file-image-o\"></span></div></div>");
            if (article && article.content) {
                buf.push("<textarea rows=\"20\" placeholder=\"正文，请使用markdown语法编辑\" class=\"form-control article-content\">" + (jade.escape(null == (jade_interp = article.content) ? "" : jade_interp)) + "</textarea>");
            } else {
                buf.push("<textarea rows=\"20\" placeholder=\"正文，请使用markdown语法编辑\" class=\"form-control article-content\"></textarea>");
            }
            buf.push("</div><div class=\"pull-right\"><button type=\"button\" class=\"btn btn-default btn-editor-exit\">退出编辑</button><button type=\"button\" class=\"btn btn-primary btn-editor-save\">发布文章</button></div><div tagindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" class=\"modal dialog-article-preview\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-body\"><p>预览内容</p></div></div></div></div><div tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" class=\"modal dialog-upload-file\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\" class=\"close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">插入图片</h4></div><div class=\"modal-body\"><input type=\"file\" accept=\"image/png,image/gif,image/jpg,image/jpeg\" multiple=\"multiple\" style=\"display:none\" class=\"input-upload-img\"/><div class=\"input-group\"><span class=\"input-group-addon\"><span class=\"fa fa-file-image-o\"></span></span><input type=\"text\" class=\"form-control input-img-links\"/><span class=\"input-group-btn\"><button type=\"button\" onclick=\"$(&quot;input[class=input-upload-img]&quot;).click();\" class=\"btn\">...</button></span></div></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button type=\"button\" class=\"btn btn-primary btn-confirm btn-upload-img\">确定</button></div></div></div></div></div>");
        }.call(this, "article" in locals_for_with ? locals_for_with.article : typeof article !== "undefined" ? article : undefined, "undefined" in locals_for_with ? locals_for_with.undefined : typeof undefined !== "undefined" ? undefined : undefined));;
        return buf.join("");
    }

    // 搜集文章编辑页输入的信息
    function _collectInput() {
        var article = {
                title: $('.article-title').val(),
                category: $('#dropdown-cat-menu').text(),
                tags: [],
                date_collected: new Date(),
                content: $('.article-content').val()
            },
            validate_info, tag_nodes, i, il;

        validate_info = _validateArticleInfo(article);
        if (validate_info.success === false) return validate_info;

        tag_nodes = $('.article-tag-list').children();
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
        article.date_collected_HTML = article.date_collected;
        article.titleHTML = "<div><h1 class='article-title'><a href='#'>" + article.title + "</a></h1><div class='article-meta'><span class='author'>类别：<a href='#'>" + article.category + "</a></span> &bull;<time class='article-date' datetime='" + article.date_collected + "' title='" + article.date_collected + "'>" + article.date_collected_HTML + "</time></div></div>";

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

    // 在光标处插入字符串
    function _insertAtPos(str, extrastr, pos) {
        return str.substr(0, pos) + extrastr + str.substr(pos, str.length - pos);
    }

    // 绑定事件
    function _attachEventListeners() {
        // 预览文章，弹出模态框
        $('.article-editor').on('click', '.article-preview', function() {
            var valid = _collectInput(),
                preview_html,
                dialog_preview;

            preview_html = (valid.success === true) ? _parseInputToHTML(valid.body) : valid.body;
            preview_html = (!preview_html) ? '' : preview_html;
            dialog_preview = $('.dialog-article-preview');
            dialog_preview.find('.modal-body').html(preview_html);
            dialog_preview.modal();
        });

        // 点击 添加标签
        $('.article-editor').on('click', '.btn-tag-add a', function(e) {
            e.preventDefault();
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

        // 点击标签的删除icon
        $('.article-editor').on('click', '.fa-times', function() {
            $(this).parents('.article-tag').remove();
        });

        // 点击图片icon 插入图片
        $('.article-editor').on('click', '.btn-article-pic', function() {
            $('.dialog-upload-file').modal({
                keyboard: false
            });
        });

        // 显示前重置上传表单
        $('.dialog-upload-file').on('hidden.bs.modal', function() {
            $(this).find('.input-upload-img').val("");
            $(this).find('.input-img-links').val("");
        });

        // 上传文件时，显示文件列表
        $('.dialog-upload-file').on('change', '.input-upload-img', function() {
            var files = $(this).prop('files');
            var len = files.length;
            var filenames = files[0].name;
            for (var i = 1; i < len; i++) {
                filenames += ";" + files[i].name;
            }
            $('.input-img-links').val(filenames);
        });

        // 生成文件链接内容
        $('.dialog-upload-file').on('click', '.btn-upload-img', function() {
            var files = $('.input-upload-img').prop('files'),
                len = files.length,
                imgHTML = '',
                contentnode, content, i;

            if (len === 0) {
                $('.dialog-upload-file .modal-body').append('<p>未上传任何文件</p>');
                return;
            }

            for (i = 0; i < len; i++) {
                imgHTML += '![Alt text](./images/' + new Date().getTime() + '_' + files[i].name + ')\n';
            }

            contentnode = $('.article-content');
            content = _insertAtPos(contentnode.val(), imgHTML, contentnode.getCurPos());
            contentnode.val(content);
            $('.dialog-upload-file').modal('hide');
        });
    }
});
