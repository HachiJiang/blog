/* Process XHR events */
/* 对应后端的路由 */

define(['jquery', 'exports'], function($, exports) {
    var _version = '/v1';

    // GET: 获取主页所有数据

    // GET: 获取某页文章
    /**
     * [getArticlesByPageIdx description]
     * @param  {String}   page_idx [description]
     * @param  {Function} cb       [description]
     * @return null
     */
    exports.getArticlesByPageIdx = function(page_idx, cb) {
        $.ajax({
            type: "GET",
            url: _version + "/articles/page/" + page_idx,
            data: {},
            dataType: "json",
            success: function(res) {
                if (res.success === true && res.data && res.data.list) {
                    cb(res.data.list);
                } else {
                    console.log(data.message);
                    return;
                }
            },
            error: function(jqXHR) {
                //数据请求失败，弹出报错
                alert("连接失败");
            }
        });
    };

    // POST: 保存/更新单篇文章，并显示正文
    exports.saveArticle = function(article, cb) {
        $.ajax({
            type: "POST",
            url: _version + "/article/create",
            data: {
                article_id: article.id,
                article_title: article.title,
                category_name: article.category,
                article_date_created: article.date_created,
                article_date_modified: article.date_modified,
                user_name: article.author,
                status_id: article.status,
                article_content: article.content,
                article_statistics: article.article_statistics,
                tags: article.tags.join(','),
                comments: article.comments
            },
            dataType: "json",
            success: function(res) {
                if (res.success === true) {
                    //文章保存成功，执行回调函数
                    cb(res.data);
                } else {
                    console.log(data.message);
                }
            },
            error: function(jqXHR) {
                alert("连接失败");
            }
        });
    };
});
