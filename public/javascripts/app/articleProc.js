/* 文章相关操作 */

define(['jquery', 'mkEditor', 'runtime', 'exports'], function(jquery, mkEditor, jade, exports) {
    exports.renderEditor = mkEditor.render;
    exports.removeEditor = mkEditor.remove;

    /**
     * Display single article
     * @param  {Array} list [description]
     * @return null
     */
    exports.displayArticle = function(list) {
        var article = list[0],
            articleNd = _generateArticleHTML(article),
            parent = $('#primary');

        articleNd.find('.article-permalink').remove();
        parent.html('');
        parent.append(articleNd);
        // @TO_DO: 暂时忽略login, 添加编辑入口，应放入login验证通过方法
        $('.article-footer').append('<span class="edit-link"><a href="#">编辑</a></span>');
        $('.article-footer').append('<span class="delete-link"><a href="#">删除</a></span>');
    };

    /**
     * Display multiple articles
     * @param  {Array} list [description]
     * @return {[type]}              [description]
     */
    exports.displayArticles = function(list) {
        var parent = $('#content-wrap'),
            article, articleNd, content, i, il;

        if (list === undefined || list.length === undefined || list.length < 1) {
            $('#primary').html('博主未发布任何文章...');
            return;
        }

        parent.html('');
        for (i = 0, il = list.length; i < il; i++) {
            article = list[i];
            articleNd = _generateArticleHTML(article);
            parent.append(articleNd);
        }

        // @TO_DO: 暂时忽略login, 添加编辑入口
        $('.article-footer').append('<span class="edit-link"><a href="#">编辑</a></span>');
        $('.article-footer').append('<span class="delete-link"><a href="#">删除</a></span>');
    };

    /**
     * Load single article in editor
     * @param  {[type]} article [description]
     * @return {[type]}         [description]
     */
    exports.loadArticleInEditor = function(list) {
        var article = list[0],
            tags = article.tags;
        mkEditor.render('primary', {
            'title': article.article_title,
            'category': article.category_name,
            'tags': (tags !== '') ? article.tags.split(',') : [],
            'content': article.article_content
        });
        $('.article-editor').attr('id', article.article_id);
    };

    /**
     * 属性对应不一致，转换
     * @return {[type]} [description]
     */
    exports.collectInput = function() {
        var rawInput = mkEditor.collectInput(),
            date_collected = rawInput.date_collected;
        date_collected = (!date_collected.Format) ? date_collected : date_collected.Format('YYYY-mm-dd hh:ii:ss');
        return {
            'article_title': rawInput.title,
            'category_name': rawInput.category,
            'tags': rawInput.tags,
            'article_date_modified': date_collected,
            'article_content': rawInput.content
        };
    };

    /**
     * template of single article
     * @param  {Object} locals [description]
     * @return {String}        html
     */
    function _template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;;
        var locals_for_with = (locals || {});
        (function(article) {
            buf.push("<article" + (jade.attrs(jade.merge([{
                "class": "article"
            }, {
                'id': 'article-' + article.article_id
            }]), false)) + "><header class=\"article-header\"><h1 class=\"article-title\"><a href=\"#\">" + (jade.escape((jade_interp = article.article_title) == null ? '' : jade_interp)) + "</a></h1><div class=\"article-meta\"><span class=\"article-author\">作者:<a href=\"#\">" + (jade.escape((jade_interp = article.user_name) == null ? '' : jade_interp)) + "</a></span><span> · </span><span class=\"article-created-on\">更新于 <a><time class=\"article-date-created\"></time><time" + (jade.attrs(jade.merge([{
                "class": "updated"
            }, {
                'datetime': article.article_date_modified
            }]), false)) + ">" + (jade.escape((jade_interp = article.article_date_modified) == null ? '' : jade_interp)) + "</time></a></span></div></header><div class=\"article-content\"></div><div class=\"article-permalink\"><a href=\"#\" class=\"btn btn-default\">阅读全文</a></div><footer class=\"article-footer\"><span class=\"cat-links\"><a>" + (jade.escape((jade_interp = article.category_name) == null ? '' : jade_interp)) + "</a></span><div class=\"pull-left tag-list\"><i class=\"fa fa-footer clearfix\"></i><a href=\"#\"></a></div><span class=\"tag-links\"><a>" + (jade.escape((jade_interp = article.tags) == null ? '' : jade_interp)) + "</a></span></footer></article>");
        }.call(this, "article" in locals_for_with ? locals_for_with.article : typeof article !== "undefined" ? article : undefined));;
        return buf.join("");
    }

    /**
     * 生成单篇文章html
     * @param  {[type]} article [description]
     * @return {[type]}         根节点
     */
    function _generateArticleHTML(article) {
        var articleNd;
        if (article.article_date_created !== undefined) {
            article.article_date_created = _convertDate(article.article_date_created);
        }
        article.article_date_modified = _convertDate(article.article_date_modified);
        content = mkEditor.parseContent(article.article_content);
        articleNd = $(_template({
            article: article
        }));
        articleNd.find('.article-content').html(content);
        return articleNd;
    }

    /**
     * 从数据库返回的格式为：2015-12-06T12:31:45.000Z，需要转换
     * @param  {[type]} d [description]
     * @return {[type]}   [description]
     */
    function _convertDate(d) {
        return new Date(d).Format('YYYY-mm-dd hh:ii:ss');
    }

    // 对Date的扩展，将 Date 转化为指定格式的String 
    // 月(m)、日(d)、小时(h)、分(i)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(Y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("YYYY-mm-dd hh:ii:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("YYYY-m-d h:i:s.S")      ==> 2006-7-2 8:9:4.18 
    Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "m+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "i+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(Y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
});
