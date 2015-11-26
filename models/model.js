var mysql = require('mysql');
var async = require('async');
var db = require('./db');
var pool = mysql.createPool(db.setting);
var unit = 10; // article count in each page
var map_limit = 10; // map limit count
var sql_tpl_artciles = 'SELECT tbl_articles.article_id as article_id,article_title,category_name,article_date_created,article_date_modified,user_name,status_name,article_content,article_statistics FROM tbl_articles LEFT JOIN (tbl_categories) ON (tbl_articles.category_id=tbl_categories.category_id) LEFT JOIN (tbl_users) ON (tbl_articles.user_id=tbl_users.user_id) JOIN tbl_status ON (tbl_articles.status_id=tbl_status.status_id)';


/**
 * Achieve articles by page
 * @param  {[String]}   page_idx [description]
 * @param  {Function}   resCalbk       [description]
 * @return null
 */
exports.getArticles = function(page_idx, resCalbk) {
    var sql = sql_tpl_artciles + _queryOrder() + _queryLimitedByPage(page_idx),
        data = {
            'info': {
                'page_idx': page_idx
            },
            'list': []
        };
    console.log('query: ' + sql);
    _sendArticles(sql, data, resCalbk);
};

/**
 * Achieve articles by category and page
 * @param  {String}   category_id [description]
 * @param  {String}   page_idx    [description]
 * @param  {Function} resCalbk       [description]
 * @return null
 */
exports.getArticlesByCategory = function(category_id, page_idx, resCalbk) {
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
};

/**
 * Achieve articles by status and page
 * @param  {String}   status_id [description]
 * @param  {String}   page_idx  [description]
 * @param  {Function} resCalbk  [description]
 * @return null
 */
exports.getArticlesByStatus = function(status_id, page_idx, resCalbk) {
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
};

/**
 * Achieve article by id
 * @param  {String}   id [description]
 * @param  {Function} resCalbk   [description]
 * @return null
 */
exports.getArticleById = function(article_id, resCalbk) {
    var sql = sql_tpl_artciles + ' WHERE tbl_articles.article_id="' + article_id + '"',
        data = {
            'info': {
                'article_id': article_id
            },
            'list': []
        };
    console.log('sql: ' + sql);
    _sendArticles(sql, data, resCalbk);
};

/**
 * Achieve articles by tag and page
 * @param  {String}   tag_id   [description]
 * @param  {String}   page_idx [description]
 * @param  {Function} resCalbk [description]
 * @return null
 */
exports.getArticlesByTag = function(tag_id, page_idx, resCalbk) {
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
};

/**
 * Achieve the list of articles in specific year/month
 * @param  {String} year     [description]
 * @param  {String} month    [description]
 * @param  {String} page_idx [description]
 * @param  {String} resCalbk [description]
 * @return null
 */
exports.getArticlesByDate = function(year, month, page_idx, resCalbk) {
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
};

/**
 * Achieve the list of tags
 * @param  {Function} resCalbk [description]
 * @return null
 */
exports.getTags = function(resCalbk) {
    var sql = 'SELECT * FROM tbl_tags',
        data = {
            'list': []
        };
    console.log('sql: ' + sql);
    _achieveData(sql, data, resCalbk);
};

/**
 * Achieve the list of categories
 * @param  {Function} resCalbk [description]
 * @return {[type]}            [description]
 */
exports.getCategories = function(resCalbk) {
    var sql = 'SELECT * FROM tbl_categories',
        data = {
            'list': []
        };
    console.log('sql: ' + sql);
    _achieveData(sql, data, resCalbk);
};

function _errorHandler(err, results, resCalbk) {
    if (err) {
        console.err('error connecting' + err.stack);
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
    var msg = (data && data.list && data.list.length > 0) ? 'Achieve data successfully' : 'No data returned';
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
