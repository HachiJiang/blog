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
     *     content_raw: $('.article-content').val(),
     *     content: content for display
     * }
     */
    exports.collectInput = function() {
        var res = _collectInput();
        return (res.success === true) ? res.body : {};
    };
    exports.render = render;
    exports.remove = remove;
    /*exports.parseContent = mkParser;*/

    /**
     * Render
     * @param  {String} id      [description]
     * @param  {Object} article [description]
     * {
     *     title:
     *     category:
     *     tags: [Array]
     *     content_raw:
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

        parent.html();
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
        $('#' + id + ' .mk-editor').remove();
    }

    // 获取markdown编辑器模板
    function _template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;;
        var locals_for_with = (locals || {});
        (function(article, undefined, 默认) {
            buf.push("<link rel=\"stylesheet\" href=\"/mkEditor/styles/font-awesome.min.css\"/><link rel=\"stylesheet\" href=\"/mkEditor/styles/mkEditor.css\"/><div class=\"mk-editor\"><h4>文章编辑</h4><div><form class=\"form-group\"><input" + (jade.attrs(jade.merge([{
                "placeholder": "标题",
                "class": "form-control article-title"
            }, {
                'value': (article && article.title) ? article.title : ''
            }]), false)) + "/><div class=\"article-meta-wrap\"><div class=\"pull-left article-cat-wrap\"><div class=\"pull-left\"><span>类别: </span></div><div class=\"pull-left dropdown\"><a id=\"dropdown-cat-menu\" href=\"#\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" idx=\"0\" class=\"btn btn-default btn-xs dropdown-toggle\">" + (jade.escape(null == (jade_interp = (article && article.category) ? article.category : '默认') ? "" : jade_interp)) + "<span class=\"caret\"></span></a><ul aria-labelledby=\"dropdown-cat-menu\" class=\"dropdown-menu dropdown-cat-list\">");
            if (article && article.cat_list) {
                // iterate article.cat_list
                ;
                (function() {
                    var $$obj = article.cat_list;
                    if ('number' == typeof $$obj.length) {

                        for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                            var cat = $$obj[$index];

                            if (cat !== article.category) {
                                buf.push("<li class=\"cat-item\"><a href=\"#\">" + (jade.escape(null == (jade_interp = cat) ? "" : jade_interp)) + "</a></li>");
                            } else {
                                buf.push("<li class=\"cat-item hide\"><a href=\"#\">" + (jade.escape(null == (jade_interp = cat) ? "" : jade_interp)) + "</a></li>");
                            }
                        }

                    } else {
                        var $$l = 0;
                        for (var $index in $$obj) {
                            $$l++;
                            var cat = $$obj[$index];

                            if (cat !== article.category) {
                                buf.push("<li class=\"cat-item\"><a href=\"#\">" + (jade.escape(null == (jade_interp = cat) ? "" : jade_interp)) + "</a></li>");
                            } else {
                                buf.push("<li class=\"cat-item hide\"><a href=\"#\">" + (jade.escape(null == (jade_interp = cat) ? "" : jade_interp)) + "</a></li>");
                            }
                        }

                    }
                }).call(this);

            } else {
                buf.push("<li class=\"cat-item hide\"><a href=\"#\">" + (jade.escape(null == (jade_interp = 默认) ? "" : jade_interp)) + "</a></li>");
            }
            buf.push("<li class=\"cat-add-link\"><a href=\"#\">Add...</a></li></ul></div></div><div class=\"pull-left btn-tag-add\"><a href=\"#\">添加标签</a></div><div class=\"pull-left article-tag-list\">");
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
            buf.push("</div></div><div class=\"pull-right article-preview\"><btn data-toggle=\"modal\"><a href=\"#\">预览</a></btn></div></form><div style=\"clear:both\" class=\"article-editor-toolbar\"><div class=\"btn btn-default btn-xs btn-article-pic\"><span aria-hidden=\"true\" class=\"fa fa-file-image-o\"></span></div></div><textarea rows=\"20\" placeholder=\"正文，请使用markdown语法编辑\" class=\"form-control article-content\">" + (jade.escape(null == (jade_interp = (article && article.content_raw) ? article.content_raw : '') ? "" : jade_interp)) + "</textarea><div class=\"pull-right\"><button type=\"button\" class=\"btn btn-default btn-editor-exit\">退出编辑</button><button type=\"button\" class=\"btn btn-primary btn-editor-save\">发布文章</button></div><div tagindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" class=\"modal dialog-article-preview\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-body\"><p>预览内容</p></div></div></div></div><div tagindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" class=\"modal dialog-cat-input\"><div class=\"modal-dialog modal-sm\"><div class=\"modal-content\"><div class=\"modal-body\"><input id=\"cat-name\" type=\"text\" class=\"form-control\"/><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default btn-exit\">Cancel</button><button type=\"button\" class=\"btn btn-primary btn-save\">OK</button></div></div></div></div><div tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" class=\"modal dialog-upload-file\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\" class=\"close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">插入图片</h4></div><div class=\"modal-body\"><input type=\"file\" accept=\"image/png,image/gif,image/jpg,image/jpeg\" multiple=\"multiple\" style=\"display:none\" class=\"input-upload-img\"/><div class=\"input-group\"><span class=\"input-group-addon\"><span class=\"fa fa-file-image-o\"></span></span><input type=\"text\" class=\"form-control input-img-links\"/><span class=\"input-group-btn\"><button type=\"button\" onclick=\"$(&quot;input[class=input-upload-img]&quot;).click();\" class=\"btn\">...</button></span></div></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button type=\"button\" class=\"btn btn-primary btn-confirm btn-upload-img\">确定</button></div></div></div></div></div></div>");
        }.call(this, "article" in locals_for_with ? locals_for_with.article : typeof article !== "undefined" ? article : undefined, "undefined" in locals_for_with ? locals_for_with.undefined : typeof undefined !== "undefined" ? undefined : undefined, "默认" in locals_for_with ? locals_for_with.默认 : typeof 默认 !== "undefined" ? 默认 : undefined));;
        return buf.join("");
    }

    // 搜集文章编辑页输入的信息
    function _collectInput() {
        var content_raw = $('.article-content').val(),
            article = {
                'title': $('.article-title').val(),
                'category': $('#dropdown-cat-menu').text(),
                'tags': [],
                'date_collected': new Date(),
                'content_raw': content_raw,
                'content': mkParser(content_raw)
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

    // 解析用户输入的文章内容为HTML，并用于预览
    function _parseInputToHTML(article) {
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

        if (!article.content_raw) {
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
        var editor_div = $('.mk-editor'),
            dialog_upload_div = $('.dialog-upload-file');

        // 预览文章，弹出模态框
        editor_div.on('click', '.article-preview', function() {
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
        editor_div.on('click', '.btn-tag-add a', function(e) {
            e.preventDefault();
            if ($('.article-tag-list input').length > 0) return;
            var tag_input = $('<input type="text" class="article-tag pull-left"></input>');
            $('.article-tag-list').append(tag_input);
            $(tag_input).focus();
        });

        // 输入标签转为a
        editor_div.on('keydown', '.article-tag-list input', function(e) {
            if (e.which === 13) {
                if (!this.value) {
                    this.remove();
                    return;
                }
                e.preventDefault();
                var tag_node = $('<a class="article-tag pull-left"></a>');
                $(tag_node).text(this.value);
                editor_div.find('.article-tag-list input').remove();
                $('.article-tag-list').append(tag_node);
            }
        });

        // 标签mouse over时浮动显示删除icon
        editor_div.on('mouseenter', '.article-tag', function() {
            $(this).append('<i class="fa fa-times"></i>');
        });
        editor_div.on('mouseleave', '.article-tag', function() {
            $(this).find('.fa-times').remove();
        });

        // 点击标签的删除icon
        editor_div.on('click', '.fa-times', function() {
            $(this).parents('.article-tag').remove();
        });

        // 类别选择
        $('#dropdown-cat-menu').dropdown();

        // 切换类别
        editor_div.on('click', '.cat-item', function() {
            var cat_name = $(this).find('a').text(),
                cat_selected = $('.dropdown-cat-list').find('.cat-item.hide');

            $(this).addClass('hide');
            $('#dropdown-cat-menu').html(cat_name + '<span class="caret"></span>');
            // 将原选中item重新显示在下拉菜单中
            $.each(cat_selected, function(i, cat) {
                $(cat).removeClass('hide');
            });
        });
        // 新增category item
        editor_div.on('click', '.cat-add-link a', function() {
            $('.dialog-cat-input').modal({
                keyboard: false
            });
        });
        editor_div.on('click', '.dialog-cat-input .btn-save', function() {
            var cat_name = $('#cat-name').val(), // 输入的类别名称
                cat_selected; // 选中cat在下拉菜单中的item
            if (!cat_name) {
                $('.dialog-cat-input .modal-body').append('<span class="msg">输入为空!</span>');
                return;
            }

            // 将原选中item重新显示在下拉菜单中
            cat_selected = $('.dropdown-cat-list').find('.cat-item.hide');
            $.each(cat_selected, function(i, cat) {
                $(cat).removeClass('hide');
            });

            // 插入新的item并隐藏
            $('<li class="cat-item hide"><a href="#">' + cat_name + '</a></li>').insertBefore('.cat-add-link');
            // 显示新增item于显示框
            $('#dropdown-cat-menu').html(cat_name + '<span class="caret"></span>');
            $('.dialog-cat-input').modal('hide');
        });
        // 输入框显示时，focus输入框
        $('.dialog-cat-input').on('shown.bs.modal', function() {
            $('#cat-name').focus();
        });
        // 输入框隐藏时，移除提示语句
        $('.dialog-cat-input').on('hidden.bs.modal', function() {
            var msg = $(this).find('.msg');
            if (msg) {
                msg.remove();
            }
            $(this).find('#cat-name').val('');
        });

        // 点击图片icon 插入图片
        editor_div.on('click', '.btn-article-pic', function() {
            $('.dialog-upload-file').modal({
                keyboard: false
            });
        });

        // 显示前重置上传表单
        dialog_upload_div.on('hidden.bs.modal', function() {
            $(this).find('.input-upload-img').val("");
            $(this).find('.input-img-links').val("");
        });

        // 上传文件时，显示文件列表
        dialog_upload_div.on('change', '.input-upload-img', function() {
            var files = $(this).prop('files');
            var len = files.length;
            var filenames = files[0].name;
            for (var i = 1; i < len; i++) {
                filenames += ";" + files[i].name;
            }
            $('.input-img-links').val(filenames);
        });

        // 生成文件链接内容
        dialog_upload_div.on('click', '.btn-upload-img', function() {
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
