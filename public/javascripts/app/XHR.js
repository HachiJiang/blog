/* Process XHR events */
/* 对应后端的路由 */

define(['jquery', 'exports'], function($, exports) {
    var _version = '/v1';

    // GET: 获取主页所有数据

    // GET: 获取某页文章
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

        // POST: 保存单篇文章，并显示正文
        
    };
});
