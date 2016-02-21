/* Process XHR events */
/* 对应后端的路由 */

define(['jquery', 'exports'], function($, exports) {
    var _version = '/v1';

    /**
     * GET: 获取某页文章
     * @param  {String}   page_idx [description]
     * @param  {Function} cb       [description]
     * @return null
     */
    exports.getArticlesByPageIdx = function(page_idx, cb) {
        _getXhrTpl(_version + "/articles/page/" + page_idx, cb);
    };

    /**
     * GET: 某id文章
     * @param  {String}   id [description]
     * @param  {Function} cb [description]
     * @return null
     */
    exports.getArticleById = function(id, cb) {
        _getXhrTpl(_version + "/article/" + id, cb);
    };

    /**
     * GET: 获取某tag文章的某页
     * @param tad_id
     * @param page_idx
     * @param cb
     */
    exports.getArticlesByTagId = function(tad_id, page_idx, cb) {
        _getXhrTpl(_version + "/articles/tag/" + tad_id + "/page/" + page_idx, cb);
    };

    /**
     * GET: 获取某类别文章的某页
     * @param cat_id
     * @param page_idx
     * @param cb
     */
    exports.getArticlesByCatId = function(cat_id, page_idx, cb) {
        _getXhrTpl(_version + "/articles/category/" + cat_id + "/page/" + page_idx, cb);
    };

    /**
     * GET: category list
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    exports.getCategories = function(cb) {
        _getXhrTpl(_version + "/categories", cb);
    };

    /**
     * Get tag list
     * @param  {Function} cb [description]
     * @return null
     */
    exports.getTags = function (cb) {
        _getXhrTpl(_version + "/tags", cb);
    };

    /**
     * 获取文章总页数
     */
    exports.getPageCount = function getPageCount(cb) {
        $.ajax({
            type: "GET",
            url: _version + "/article/getPageCount",
            dataType: "json",
            success: function(res) {
                if (res.success === true) {
                    // 成功获取页数，执行回调函数
                    cb(pageCountTotal);
                } else {
                    console.log(res.message);
                }
            },
            error: function() {
                alert("连接失败");
            }
        });
    };

    // POST: 保存/更新单篇文章，并显示正文
    exports.saveArticle = function (article, cb) {
        $.ajax({
            type: "POST",
            url: _version + "/article/create",
            data: {
                'article_id': article.article_id,
                'article_title': article.article_title,
                'category_name': article.category_name,
                'article_date_created': article.article_date_created,
                'article_date_modified': article.article_date_modified,
                'user_name': article.user_name,
                'status_id': article.status_id,
                'article_content_raw': article.article_content_raw,
                'article_content': article.article_content,
                'article_statistics': article.article_statistics,
                'tags': article.tags.join(','),
                'comments': article.comments
            },
            dataType: "json",
            success: function(res) {
                if (res.success === true) {
                    //文章保存成功，执行回调函数
                    article.article_id = res.data.article_id;
                    cb([article]);
                } else {
                    console.log(res.message);
                }
            },
            error: function(jqXHR) {
                alert("连接失败");
            }
        });
    };

    // POST: 删除单篇文章，并回到首页
    exports.deleteArticleById = function(article_id) {
        $.ajax({
            type: "POST",
            url: _version + "/article/delete",
            data: {
                'article_id': article_id
            },
            dataType: "json",
            success: function(res) {
                if (res.success === true) {
                    //文章删除成功，执行回调函数
                    console.log(res.message);
                } else {
                    console.log(res.message);
                }
            },
            error: function(jqXHR) {
                alert("连接失败");
            }
        });
    };

    /**
     * Always get res.data.list
     * @param  {[type]}   url [description]
     * @param  {Function} cb  [description]
     * @return {[type]}       [description]
     */
    function _getXhrTpl(url, cb) {
        $.ajax({
            type: "GET",
            url: url,
            data: {},
            dataType: "json",
            success: function(res) {
                if (res.success === true && res.data && res.data.list) {
                    cb(res.data.list);
                } else {
                    console.log(data.message);
                }
            },
            error: function(jqXHR) {
                //数据请求失败，弹出报错
                alert("连接失败");
            }
        });
    }
});
