var mysql = require('mysql');
var async = require('async');
var db = require('./db');
var tbl = db.tbl;
var pool = mysql.createPool(db.setting);
var unit = 10; // article count in each page
var map_limit = 10; // map limit count

/**
 * common method: achieve data from database
 * @param  {String}   query    [mysql sentence]
 * @param  {Function} cb 
 * @return null
 */
function _achieveData(sql, cb) {
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query(sql, function(err, results) {
            if (err) {
                console.err('error connecting' + err.stack);
                return;
            }

            cb(null, results);
        });
    });
}

/**
 * Collect articles with complete info, including reading foreign keys
 * @param  {[type]}   sql          [description]
 * @param  {Function} resCalbk     [description]
 * @return {[type]}                [description]    
 */
function _sendArticles(sql, resCalbk) {
    pool.getConnection(function(err, connection) {
        var getArticles = function(sql, cb1) {
            connection.query(sql, function(err, results) {
                if (err) {
                    console.err('error connecting' + err.stack);
                    return;
                }

                cb1(null, results);
            });
        };

        var addCategory = function(articleArr, cb1) {
            connection.query(sql, function(err, results) {
                if (err) {
                    console.err('error connecting' + err.stack);
                    return;
                }

                cb1(null, results);
            });
        };

        var collect = async.compose(getRawArticles);
        collect(sql, function(err, articleArr) {
            console.log(articleArr);
            connection.release();

            resCalbk(err, JSON.stringify(articleArr));
        });
    });
}

/**
 * Generate query of WHERE contition, support multi-condition
 * @param  {JSON} params [description]
 * @return {String}        [description]
 */
function _queryWhereCondition(params) {
    if (!params) {
        return ''; // default value
    }

    var arr = [],
        val;
    for (var key in params) {
        val = params[key];
        val = (!val) ? 0 : val;
        arr.push(key + '="' + val + '"');
    }

    return ' WHERE ' + arr.join(' AND ')  + ' ORDER BY date_created DESC';
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

/**
 * Achieve articles by page
 * @param  {[String]}   page_idx [description]
 * @param  {Function}   cb       [description]
 * @return null
 */
exports.getArticles = function(page_idx, resCalbk) {
    var sql = 'SELECT * FROM ' + tbl.articles;
    sql += _queryLimitedByPage(page_idx);
    _sendArticles(sql, resCalbk);
};

/**
 * Achieve articles by category and page
 * @param  {String}   category_id [description]
 * @param  {String}   page_idx    [description]
 * @param  {Function} resCb       [description]
 * @return null
 */
exports.getArticlesByCategory = function(category_id, page_idx, resCb) {
    var query = 'SELECT * FROM ' + tbl.articles;
    query += _queryWhereCondition({
        'category_id': category_id
    });
    query += _queryLimitedByPage(page_idx);
    console.log('query: ' + query);
    _achieveCompleteArticleInfo(query, resCb);
};

/**
 * Achieve articles by status and page
 * @param  {String}   status_id [description]
 * @param  {String}   page_idx  [description]
 * @param  {Function} resCb  [description]
 * @return null
 */
exports.getArticlesByStatus = function(status_id, page_idx, resCb) {
    var query = 'SELECT * FROM ' + tbl.articles;
    query += _queryWhereCondition({
        'status_id': status_id
    });
    query += _queryLimitedByPage(page_idx);
    console.log('query: ' + query);
    _achieveCompleteArticleInfo(query, resCb);
};

/**
 * Achieve article by id
 * @param  {String}   id [description]
 * @param  {Function} resCb   [description]
 * @return null
 */
exports.getArticleById = function(id, resCb) {
    var query = 'SELECT * FROM ' + tbl.articles;
    query += _queryWhereCondition({
        'id': id
    });
    console.log('query: ' + query);
    _achieveCompleteArticleInfo(query, resCb);
};

/**
 * Achieve articles by tag and page
 * @param  {String}   id   [description]
 * @param  {String}   page_idx [description]
 * @param  {Function} resCb [description]
 * @return null
 */
exports.getArticlesByTag = function(name, page_idx, resCb) {
    var sql0 = 'SELECT * FROM ' + tbl.tags + _queryWhereCondition({
        'name': name
    });

    pool.getConnection(function(err, connection) {
        var conn0 = function(sql, cb) {
            connection.query(sql, function(err, results) {
                if (err) {
                    console.err('error connecting' + err.stack);
                    return;
                }

                var sql1 = 'SELECT * FROM ' + tbl.article_tag + _queryWhereCondition({
                    'tag_id': results[0].id
                });

                cb(null, sql1);
            });
        };

        var conn1 = function(sql, cb) {
            connection.query(sql, function(err, results) {
                if (err) {
                    console.err('error connecting' + err.stack);
                    return;
                }

                var idArr = [],
                    start = page_idx * unit,
                    end = Math.min(start + unit, results.length);
                for (var i = start; i < end; i++) {
                    idArr.push(results[i].article_id);
                }
                cb(null, idArr);
            });
        };

        var test = async.compose(conn1, conn0);
        test(sql0, function(err, idArr) {
            console.log(idArr);
            connection.release();

            async.mapLimit(idArr, 10, function(id, cb) {
                var sql = 'SELECT * FROM ' + tbl.articles + _queryWhereCondition({
                    'id': id
                });

                connection.query(sql, function(err, results) {
                    if (err) {
                        console.err('error connecting' + err.stack);
                        return;
                    }

                    console.log('query2: ' + JSON.stringify(results));
                    cb(null, results);
                });
            }, function(err, results) {
                resCb(err, JSON.stringify(results));
            });
        });
    });
};

exports.getArticlesByDate = function(year, month, page_idx, resCb) {

};

/**
 * Achieve the list of tags
 * @param  {Function} resCb [description]
 * @return null
 */
exports.getTags = function(resCb) {
    var query = 'SELECT * FROM tbl_tags';
    console.log('query: ' + query);
    _achieveData(query, resCb);
};

/**
 * Achieve the list of categories
 * @param  {Function} resCb [description]
 * @return {[type]}            [description]
 */
exports.getCategories = function(resCb) {
    var query = 'SELECT * FROM tbl_categories';
    console.log('query: ' + query);
    _achieveData(query, resCb);
};

// testing
exports.test = function(resCb) {
    var query = 'SELECT tbl_articles.article_id as article_id,article_title,category_name,article_date_created,article_date_modified,user_name,status_name,article_content,article_statistics FROM tbl_articles LEFT JOIN (tbl_categories) ON (tbl_articles.category_id=tbl_categories.category_id) LEFT JOIN (tbl_users) ON (tbl_articles.user_id=tbl_users.user_id) JOIN tbl_status ON (tbl_articles.status_id=tbl_status.status_id);';
    console.log('query: ' + query);
    _achieveData(query, resCb);
};
