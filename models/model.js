var mysql = require('mysql');
var async = require('async');
var db = require('./db');
var pool = mysql.createPool(db.setting);
var unit = 20; // article count in each page
var map_limit = 10; // map limit count
var sql_tpl_artciles = 'SELECT tbl_articles.article_id as article_id,article_title,category_name,article_date_created,article_date_modified,user_name,status_name,article_content_raw,article_content,article_statistics FROM tbl_articles LEFT JOIN (tbl_categories) ON (tbl_articles.category_id=tbl_categories.category_id) LEFT JOIN (tbl_users) ON (tbl_articles.user_id=tbl_users.user_id) JOIN tbl_status ON (tbl_articles.status_id=tbl_status.status_id)';

exports.getArticles = _getArticles;
exports.getArticlesByCategory = _getArticlesByCategory;
exports.getArticlesByStatus = _getArticlesByStatus;
exports.getArticleById = _getArticleById;
exports.getArticlesByTag = _getArticlesByTag;
exports.getArticlesByDate = _getArticlesByDate;
exports.getTags = _getTags;
exports.getCategories = _getCategories;
exports.getInfoForHomePage = _getInfoForHomePage;
exports.saveArticle = _saveArticle;
exports.deleteArticle = _deleteArticle;

/**
 * Achieve articles by page
 * @param  {[String]}   page_idx [description]
 * @param  {Function}   resCalbk       [description]
 * @return null
 */
function _getArticles(page_idx, resCalbk) {
    var sql = sql_tpl_artciles + _queryOrder() + _queryLimitedByPage(page_idx),
        data = {
            'info': {
                'page_idx': page_idx
            },
            'list': []
        };
    console.log('query: ' + sql);
    _sendArticles(sql, data, resCalbk);
}

/**
 * Achieve articles by category and page
 * @param  {String}   category_id [description]
 * @param  {String}   page_idx    [description]
 * @param  {Function} resCalbk       [description]
 * @return null
 */
function _getArticlesByCategory(category_id, page_idx, resCalbk) {
    var sql = sql_tpl_artciles + ' WHERE tbl_categories.category_id="' + category_id + '"' + _queryOrder() + _queryLimitedByPage(page_idx),
        data = {
            'info': {
                'category_id': category_id,
                'page_idx': page_idx
            },
            'list': []
        };
    console.log('sql: ' + sql);
    _sendArticles(sql, data, resCalbk);
}

/**
 * Achieve articles by status and page
 * @param  {String}   status_id [description]
 * @param  {String}   page_idx  [description]
 * @param  {Function} resCalbk  [description]
 * @return null
 */
function _getArticlesByStatus(status_id, page_idx, resCalbk) {
    var sql = sql_tpl_artciles + ' WHERE tbl_status.status_id="' + status_id + '"' + _queryOrder() + _queryLimitedByPage(page_idx),
        data = {
            'info': {
                'status_id': status_id,
                'page_idx': page_idx
            },
            'list': []
        };
    console.log('sql: ' + sql);
    _sendArticles(sql, data, resCalbk);
}

/**
 * Achieve article by id
 * @param  {String}   id [description]
 * @param  {Function} resCalbk   [description]
 * @return null
 */
function _getArticleById(article_id, resCalbk) {
    var sql = sql_tpl_artciles + ' WHERE tbl_articles.article_id="' + article_id + '"',
        data = {
            'info': {
                'article_id': article_id
            },
            'list': []
        };
    console.log('sql: ' + sql);
    _sendArticles(sql, data, resCalbk);
}

/**
 * Achieve articles by tag and page
 * @param  {String}   tag_id   [description]
 * @param  {String}   page_idx [description]
 * @param  {Function} resCalbk [description]
 * @return null
 */
function _getArticlesByTag(tag_id, page_idx, resCalbk) {
    pool.getConnection(function(err, connection) {
        var getArticleIdsByTagId = function(sql, cb) {
            connection.query(sql, function(err, results) {
                _errorHandler(err, results, resCalbk);
                console.log(results);
                cb(null, results);
            });
        };

        var collect = async.compose(getArticleIdsByTagId),
            sql_0 = 'SELECT article_id FROM tbl_article_tag WHERE tag_id="' + tag_id + '"' + _queryLimitedByPage(page_idx);

        collect(sql_0, function(err, articleIdArr) {
            var sql = sql_tpl_artciles + ' WHERE tbl_articles.article_id in(',
                idArr = [],
                data = {
                    'info': {
                        'tag_id': tag_id,
                        'page_idx': page_idx
                    },
                    'list': []
                };

            if (articleIdArr.length !== 0) {
                for (var i = 0, il = articleIdArr.length; i < il; i++) {
                    idArr.push(articleIdArr[i].article_id);
                }
                sql += idArr.join(',') + ')';
                _sendArticles(sql, data, resCalbk);
            } else {
                resCalbk(err, _generateSuccessResJson(data));
            }
            connection.release();
        });
    });
}

/**
 * Achieve the list of articles in specific year/month
 * @param  {String} year     [description]
 * @param  {String} month    [description]
 * @param  {String} page_idx [description]
 * @param  {String} resCalbk [description]
 * @return null
 */
function _getArticlesByDate(year, month, page_idx, resCalbk) {
    var sql = sql_tpl_artciles + ' WHERE article_date_created LIKE "' + year + '-' + month + '%"' + _queryOrder() + _queryLimitedByPage(page_idx),
        data = {
            'info': {
                'year': year,
                'month': month,
                'page_idx': page_idx
            },
            'list': []
        };
    console.log('sql: ' + sql);
    _sendArticles(sql, data, resCalbk);
}

/**
 * Achieve the list of tags
 * @param  {Function} resCalbk [description]
 * @return null
 */
function _getTags(resCalbk) {
    var sql = 'SELECT * FROM tbl_tags',
        data = {
            'list': []
        };
    console.log('sql: ' + sql);
    _achieveData(sql, data, resCalbk);
}

/**
 * Achieve the list of categories
 * @param  {Function} resCalbk [description]
 * @return {[type]}            [description]
 */
function _getCategories(resCalbk) {
    var sql = 'SELECT * FROM tbl_categories',
        data = {
            'list': []
        };
    console.log('sql: ' + sql);
    _achieveData(sql, data, resCalbk);
}

/**
 * Achieve articles, categories, tags for home page
 * @param  {[type]} page_idx [description]
 * @param  {[type]} resCalbk [description]
 * @return {[type]}          [description]
 */
/*function _getInfoForHomePage(page_idx, resCalbk) {
    async.parallel([
        // get article list
        function(cb) {
            _getArticles(page_idx, function(err, json_str) {
                var article_list = _extractListFromRes(json_str);
                cb(null, article_list);
            });
        },
        // get category list
        function(cb) {
            _getCategories(function(err, json_str) {
                var category_list = _extractListFromRes(json_str);
                cb(null, category_list);
            });
        },
        // get tag list
        function(cb) {
            _getTags(function(err, json_str) {
                var tag_list = _extractListFromRes(json_str);
                cb(null, tag_list);
            });
        }
    ], function(err, results) {
        resCalbk(err, results);
    });
}*/

/**
 * 保存单篇文章
 * @param  {Object} article  [description]
 * {
 *     article_id:
 *     article_title:
 *     category_name:
 *     article_date_created:
 *     article_date_modified:
 *     user_name:
 *     status_id:
 *     article_content_raw:
 *     article_content:
 *     article_statistics:
 *     tags:
 *     comments:
 * }
 * @param  {Funtion} resCalbk [description]
 * @return null
 */
function _saveArticle(article, resCalbk) {
    pool.getConnection(function(err, connection) {
        var content_raw = connection.escape(article.article_content_raw),
            content = connection.escape(article.article_content),
            date_created = connection.escape(article.article_date_created),
            date_modified = connection.escape(article.article_date_modified),
            tags = article.tags;

        //content = content.substr(1, content.length - 2);
        // get user_id by user_name
        var getUserIdByName = function(sql, cb1) {
            connection.query(sql, function(err, results) {
                console.log('get user_id: ' + results[0].user_id);
                _errorHandler(err, results, cb1);
                cb1(null, results[0].user_id);
            });
        };

        // insert category_id by category_name
        var insertCatIdByName = function(user_id, cb1) {
            var sql_0 = 'INSERT IGNORE INTO tbl_categories (category_name) VALUES ("' + article.category_name + '")';
            connection.query(sql_0, function(err, results) {
                _errorHandler(err, results, cb1);
                cb1(null, user_id);
            });
        };

        // get category_id by category_name
        var getCatIdByName = function(user_id, cb1) {
            var sql_0 = 'SELECT category_id FROM tbl_categories WHERE category_name="' + article.category_name + '"';
            connection.query(sql_0, function(err, results) {
                _errorHandler(err, results, cb1);
                cb1(null, {
                    'user_id': user_id,
                    'category_id': results[0].category_id
                });
            });
        };

        // 保存文章
        var updateTblArticle = function(info, cb1) {
            var user_id = info.user_id,
                category_id = info.category_id,
                article_id = article.article_id,
                sql_0 = '';

            if (article_id === '-1') {
                // 新建
                sql_0 = "INSERT tbl_articles (article_title, category_id, article_date_created, article_date_modified, user_id, status_id, article_content_raw, article_content, article_statistics) VALUES " +
                    "('" + article.article_title + "', '" + category_id + "', " + date_created + ", " + date_modified + ", '" +
                    user_id + "', '" + article.status_id + "', " + content_raw + ", " + content + ", '" + article.article_statistics + "')";
            } else {
                sql_0 = "UPDATE tbl_articles SET article_title='" + article.article_title + "', category_id='" + category_id +
                    "', article_date_modified=" + date_modified + ", user_id='" + user_id + "', status_id='" + article.status_id +
                    "', article_content_raw=" + content_raw + ", article_content=" + content + ", article_statistics='" + article.article_statistics + "' WHERE article_id='" + article_id + "'";
            }

            connection.query(sql_0, function(err, results) {
                console.log(sql_0);
                console.log(results);
                article_id = (article_id !== '-1') ? article.article_id : results.insertId;
                _errorHandler(err, results, cb1);
                console.log('save the article as id=' + article_id + ' successfully');
                cb1(null, article_id);
            });
        };

        // 更新tbl_tags
        var updateTblTags = function(article_id, cb1) {
            var sql_0, tagArr, i, il;
            if (tags !== '') {
                sql_0 = 'INSERT IGNORE INTO tbl_tags (tag_name) VALUES';
                tagArr = tags.split(',');

                for (i = 0, il = tagArr.length; i < il; i++) {
                    tagArr[i] = '("' + tagArr[i] + '")';
                }

                sql_0 += tagArr.join(',');
                connection.query(sql_0, function(err, results) {
                    _errorHandler(err, results, cb1);
                    console.log('update tbl_tags successfully.');
                    cb1(null, article_id);
                });
            } else {
                setTimeout(function() {
                    console.log('no need to update tbl_tags.');
                    cb1(null, article_id);
                }, 1);
            }
        };

        // 获取tags id
        var getTagIdsByNames = function(article_id, cb1) {
            var sql_0, tagArr, tagIdArr, i, il;

            if (tags !== '') {
                sql_0 = 'SELECT tag_id FROM tbl_tags WHERE tag_name IN(';
                tagArr = tags.split(',');

                for (i = 0, il = tagArr.length; i < il; i++) {
                    tagArr[i] = '"' + tagArr[i] + '"';
                }
                sql_0 += tagArr.join(',') + ')';
                connection.query(sql_0, function(err, results) {
                    tagIdArr = [];
                    _errorHandler(err, results, cb1);

                    for (i = 0, il = results.length; i < il; i++) {
                        tagIdArr[i] = results[i].tag_id;
                    }
                    cb1(null, {
                        'article_id': article_id,
                        'tagIdArr': tagIdArr
                    });
                });
            } else {
                setTimeout(function() {
                    console.log('no tags for article ' + article_id);
                    cb1(null, {
                        'article_id': article_id
                    });
                }, 1);
            }
        };

        // 更新tbl_article_tag
        // 1). 删除已有tag对应关系
        var deleteFromTblArticleTag = function(info, cb1) {
            var article_id = info.article_id,
                sql_0 = 'DELETE FROM tbl_article_tag WHERE article_id="' + article_id + '"';

            connection.query(sql_0, function(err, results) {
                _errorHandler(err, results, cb1);
                cb1(null, info);
            });
        };
        // 2). 插入新的tag对应关系
        var insertTblArticleTag = function(info, cb1) {
            var article_id = info.article_id,
                arr, sql_0;
            if (tags !== '') {
                arr = info.tagIdArr;
                sql_0 = 'INSERT INTO tbl_article_tag (article_id,tag_id) VALUES';

                for (i = 0, il = arr.length; i < il; i++) {
                    arr[i] = '("' + article_id + '","' + arr[i] + '")';
                }
                sql_0 += arr.join(',');
                connection.query(sql_0, function(err, results) {
                    _errorHandler(err, results, cb1);
                    cb1(null, article_id);
                });
            } else {
                setTimeout(function() {
                    console.log('no need to update tbl_article_tag.');
                    cb1(null, article_id);
                }, 1);
            }
        };

        // @TO_DO: 更新tbl_article_comment, tbl_article_statistics

        var update = async.compose(
                insertTblArticleTag,
                deleteFromTblArticleTag,
                getTagIdsByNames,
                updateTblTags,
                updateTblArticle,
                getCatIdByName,
                insertCatIdByName,
                getUserIdByName
            ),
            sql = 'SELECT user_id FROM tbl_users WHERE user_name = "' + article.user_name + '"';

        update(sql, function(err, article_id) {
            _errorHandler(err, article_id, resCalbk);
            connection.release();
            resCalbk(null, _generateSuccessResJson({
                'article_id': article_id
            }));
        });
    });
}

// 删除单篇文章
function _deleteArticle(id, resCalbk) {
    console.log(id);

    // delete article from tbl_articles
    
    // delete tag records from tbl_article_tag
}

/**
 * [_errorHandler description]
 * @param  {[type]} err      [description]
 * @param  {[type]} results  [description]
 * @param  {[type]} resCalbk [description]
 * @return {[type]}          [description]
 */
function _errorHandler(err, results, resCalbk) {
    if (err) {
        console.log('error connecting' + err.stack);
        resCalbk(err, _generateErrorResJson(results));
        return;
    }
}

/**
 * common method: achieve data from database
 * @param  {String}   query    [mysql sentence]
 * @param  {[type]}   data         [description]
 * @param  {Function} cb 
 * @return null
 */
function _achieveData(sql, data, cb) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, function(err, results) {
            _errorHandler(err, results, cb);
            data.list = results;
            cb(null, _generateSuccessResJson(data));
        });
    });
}

/**
 * Collect articles with complete info, including reading foreign keys
 * @param  {[type]}   sql          [description]
 * @param  {[type]}   data         [description]
 * @param  {Function} resCalbk     [description]
 * @return {[type]}                [description]    
 */
function _sendArticles(sql, data, resCalbk) {
    pool.getConnection(function(err, connection) {
        var getArticleArr = function(sql, cb1) {
            connection.query(sql, function(err, results) {
                _errorHandler(err, results, resCalbk);
                cb1(null, results);
            });
        };

        var addArticleTags = function(articleArr, cb1) {
            async.mapLimit(articleArr, map_limit, function(article, cb2) {
                var sql = 'SELECT tbl_tags.tag_name FROM tbl_tags JOIN tbl_article_tag ON tbl_article_tag.article_id=' + article.article_id + ' AND tbl_article_tag.tag_id=tbl_tags.tag_id';
                connection.query(sql, function(err, tagArr) {
                    _errorHandler(err, tagArr, resCalbk);

                    article.tags = '';
                    if (tagArr.length !== 0) {
                        var tags = [];
                        for (var i = 0, il = tagArr.length; i < il; i++) {
                            tags.push(tagArr[i].tag_name);
                        }
                        article.tags = tags.join(',');
                    }
                    cb2(null, article);
                });
            }, function(err, articleArr) {
                _errorHandler();
                cb1(null, articleArr);
            });
        };

        var collect = async.compose(addArticleTags, getArticleArr);
        collect(sql, function(err, articleInfoArr) {
            _errorHandler(err, articleInfoArr, resCalbk);
            connection.release();
            data.list = articleInfoArr;
            resCalbk(null, _generateSuccessResJson(data));
        });
    });
}

/**
 * Generate query with order by date_created
 * @return {[type]} [description]
 */
function _queryOrder(col) {
    return ' ORDER BY article_date_created DESC';
}

/**
 * Generate query with page_idx limit
 * @param  {String} page_idx [description]
 * @return {String}          [description]
 */
function _queryLimitedByPage(page_idx) {
    if (!page_idx) {
        page_idx = 0; // default value
    }

    var offset = page_idx * unit;
    return ' LIMIT ' + offset + ',' + unit;
}

function _generateSuccessResJson(data) {
    var msg = (data && data.list && data.list.length > 0) ? 'Achieve data successfully' : 'No data returned/POST successfully';
    return {
        'success': true,
        'message': msg,
        'data': data
    };
}

function _generateErrorResJson(data) {
    return {
        'success': false,
        'message': 'Fail to achieve data from database',
        'data': data
    };
}

/**
 * Extract
 * @param  {Object} res [description]
 * @return {[type]}     [description]
 */
function _extractListFromRes(res) {
    var data = res.data;
    return ((res.success === true) && (data !== undefined) && (data.list !== undefined)) ? data.list : [];
}