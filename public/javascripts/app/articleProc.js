/* 文章相关操作 */

define(['jquery', 'mkEditor', 'runtime', 'exports'], function(jquery, mkEditor, jade, exports) {
    exports.removeEditor = mkEditor.remove;
    exports.displayArticle = _displayArticle;
    exports.displayArticles = _displayArticles;
    exports.loadArticleInEditor = _loadArticleInEditor;
    exports.collectInput = _collectInput;

    /**
     * Display single article
     * @param  {Array} list [description]
     * @return null
     */
    function _displayArticle(list) {
        var article = list[0],
            articleNd = _generateArticleHTML(article),
            parent = $('#content-wrap');

        articleNd.find('.article-permalink').remove();
        parent.html('');
        parent.append(articleNd);
    }

    /**
     * Display multiple articles
     * @param  {Array} list [description]
     * @return {[type]}  [description]
     */
    function _displayArticles(list) {
        var parent = $('#content-wrap'),
            article, articleNd, content, i, il;

        if (list === undefined || list.length === undefined || list.length < 1) {
            parent.html('sorry...博主没有您想要的文章...');
            return;
        }

        parent.html('');
        for (i = 0, il = list.length; i < il; i++) {
            article = list[i];
            articleNd = _generateArticleHTML(article);
            parent.append(articleNd);
        }
    }

    /**
     * Load single article in editor
     * @param  {Array} list:  article list
     * @return {[type]}         [description]
     */
    function _loadArticleInEditor(list) {
        var article = {},
            tags = article.tags || [],
            cat_ndlist = $('#widget-cat-list').find('a'),
            cat_list = [],
            params = {};

        $.each(cat_ndlist, function(i, item) {
            cat_list.push($(item).text());
        });

        params.cat_list = cat_list;

        if (!!list && (list instanceof Object)) {
            article = list[0];
            params.title = article.article_title;
            params.category = article.category_name;
            params.tags = (article.tags !== '') ? article.tags.split(',') : [];
            params.content_raw = article.article_content_raw;
        }

        mkEditor.render('content-wrap', params);
        $('.mk-editor').attr('id', article.article_id);
    }

    /**
     * 属性对应不一致，转换
     * @return {[type]} [description]
     */
    function _collectInput() {
        var rawInput = mkEditor.collectInput(),
            date_collected = rawInput.date_collected;

        date_collected = (!date_collected.Format) ? date_collected : date_collected.Format('YYYY-mm-dd hh:ii:ss');
        return {
            'article_title': rawInput.title,
            'category_name': rawInput.category,
            'tags': rawInput.tags,
            'article_date_modified': date_collected,
            'article_content_raw': rawInput.content_raw,
            'article_content': rawInput.content
        };
    }

    /**
     * template of single article - article.js
     * @param  {Object} locals [description]
     * @return {String}        html
     */
    function _template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        ;var locals_for_with = (locals || {});(function (article) {
            buf.push("<article" + (jade.attrs(jade.merge([{"class": "article"},{'id': 'article-' + article.article_id}]), false)) + "><header class=\"article-header\"><h2 class=\"article-title\"><a href=\"#\">" + (jade.escape(null == (jade_interp = article.article_title) ? "" : jade_interp)) + "</a></h2><div class=\"article-meta entry-meta\"><span class=\"glyphicon glyphicon-user article-author\"><a>" + (jade.escape(null == (jade_interp = article.user_name) ? "" : jade_interp)) + "</a></span><span class=\"article-created-on\">创建于<a><time" + (jade.attrs(jade.merge([{"class": "created"},{'datetime': article.article_date_created}]), false)) + ">" + (jade.escape(null == (jade_interp = article.article_date_created) ? "" : jade_interp)) + "</time></a></span><span class=\"article-updated-on\">更新于 <a><time" + (jade.attrs(jade.merge([{"class": "updated"},{'datetime': article.article_date_modified}]), false)) + ">" + (jade.escape(null == (jade_interp = article.article_date_modified) ? "" : jade_interp)) + "</time></a></span></div></header><div class=\"article-content\">" + (null == (jade_interp = article.article_content) ? "" : jade_interp) + "</div><div class=\"article-permalink\"><a href=\"#\" class=\"btn btn-default\">阅读全文</a></div><footer class=\"article-footer entry-meta\"><span class=\"cat-links\"><span class=\"glyphicon glyphicon-folder-open\"><a href=\"#\">" + (jade.escape(null == (jade_interp = article.category_name) ? "" : jade_interp)) + "</a></span></span><span class=\"tag-links\"><span class=\"glyphicon glyphicon-tags\"><a>" + (jade.escape(null == (jade_interp = article.tags) ? "" : jade_interp)) + "</a></span></span><span class=\"glyphicon glyphicon-edit\"><a href=\"#\" class=\"edit-link\">编辑</a></span><span aria-hidden=\"true\" class=\"glyphicon glyphicon-trash\"><a href=\"#\" class=\"del-link\">删除</a></span></footer></article>");}.call(this,"article" in locals_for_with?locals_for_with.article:typeof article!=="undefined"?article:undefined));;return buf.join("");
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
        articleNd = $(_template({
            'article': article
        }));
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
        if (/(Y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
});
