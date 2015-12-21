var express = require('express');
var async = require('async');
var router = express.Router();
var model = require('../models/model');
var version = '/v1';
var map_limit = 10; // map limit count

/* GET home page */
router.get('/', function(req, res, next) {
    res.redirect(version + '/home');
});
router.get('/home', function(req, res, next) {
    /*async.parallel([
        // get article list
        function(cb) {
            var page_idx = '0';
            model.getArticles(page_idx, function(err, json_str) {
                var article_list = _extractListFromRes(json_str);
                cb(null, article_list);
            });
        },
        // get category list
        function(cb) {
            model.getCategories(function(err, json_str) {
                var category_list = _extractListFromRes(json_str);
                cb(null, category_list);
            });
        },
        // get tag list
        function(cb) {
            model.getTags(function(err, json_str) {
                var tag_list = _extractListFromRes(json_str);
                cb(null, tag_list);
            });
        }
    ], function(err, results) {
        res.render('index', {
            'title': 'SWORDARCHOR',
            'connStr': '-',
            'desc': '和冬瓜一起努力',
            'article_list': results[0],
            'widgetsInfo': {
                'cat_list': results[1],
                'tag_list': results[2]
            }
        });
    });*/

    res.render('index', {
        'title': 'SWORDARCHOR',
        'connStr': '-',
        'desc': '和冬瓜一起努力'
    });
});

/* GET admin page */
router.get('/admin', function(req, res, next) {
    res.render('index_admin', {
        'title': 'SWORDARCHOR',
        'connStr': '>',
        'desc': '后台管理'
    });
});

/* GET articles (by page index) */
router.get(version + '/articles', function(req, res, next) {
    res.redirect(version + '/articles/page/0');
});
router.get(version + '/articles/page/:page_idx', function(req, res, next) {
    var page_idx = req.params.page_idx;
    console.log(req.params);
    model.getArticles(page_idx, function(err, json_str) {
        res.send(json_str);
    });
});

/* GET articles by category id */
router.get(version + '/articles/category/:category_id/page/:page_idx', function(req, res, next) {
    var params = req.params,
        page_idx = params.page_idx,
        category_id = params.category_id;

    console.log(req.params);
    model.getArticlesByCategory(category_id, page_idx, function(err, json_str) {
        res.send(json_str);
    });
});

/* GET articles by status */
router.get(version + '/articles/status/:status_id/page/:page_idx', function(req, res, next) {
    var params = req.params,
        page_idx = params.page_idx,
        status_id = params.status_id;

    console.log(req.params);
    model.getArticlesByStatus(status_id, page_idx, function(err, json_str) {
        res.send(json_str);
    });
});

/* GET single article by id */
router.get(version + '/article/:article_id', function(req, res, next) {
    var article_id = req.params.article_id;
    console.log(req.params);
    model.getArticleById(article_id, function(err, json_str) {
        res.send(json_str);
    });
});

/* GET articles by tag */
router.get(version + '/articles/tag/:tag_id/page/:page_idx', function(req, res, next) {
    var params = req.params,
        page_idx = params.page_idx,
        tag_id = params.tag_id;

    model.getArticlesByTag(tag_id, page_idx, function(err, json_str) {
        res.send(json_str);
    });
});

/* GET articles by Year/Month */
router.get(version + '/articles/year/:year/month/:month/page/:page_idx', function(req, res, next) {
    var params = req.params,
        page_idx = params.page_idx,
        year = params.year,
        month = params.month;

    model.getArticlesByDate(year, month, page_idx, function(err, json_str) {
        res.send(json_str);
    });
});

/* GET tag list */
router.get(version + '/tags', function(req, res, next) {
    model.getTags(function(err, json_str) {
        res.send(json_str);
    });
});

/* GET category list */
router.get(version + '/categories', function(req, res, next) {
    model.getCategories(function(err, json_str) {
        res.send(json_str);
    });
});

/* Create a new article */
router.post(version + '/article/create', function(req, res, next) {
    _saveArticleToDB(req.body, res);
});

/* Update an existing article */
router.post(version + '/article/update/:id', function(req, res, next) {
    _saveArticleToDB(req.body, res);
});

/* Delete an existing article by id */
router.post(version + '/article/delete/:id', function(req, res, next) {

});

/* Create a new category */
router.post(version + '/category/create', function(req, res, next) {
    model.insertNewCat(article, function(err, json_str) {
        res.send(json_str);
    });
});

/* test */
router.get(version + '/test', function(req, res, next) {
    model.test(function(err, json_str) {
        res.send(json_str);
    });
});

module.exports = router;

/**
 * Save single article to database
 * @param  {Object} article [description]
 * @return {[type]}         [description]
 */
function _saveArticleToDB(article, res) {
    model.saveArticle(article, function(err, json_str) {
        res.send(json_str);
    });
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
