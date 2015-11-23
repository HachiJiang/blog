var express = require('express');
var router = express.Router();
var model = require('../models/model');
var version = '/v1';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title_text: 'Swordarchor',
        description: '和冬瓜一起努力'
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
    
});

/* Update an existing article */
router.post(version + '/article/update/:id', function(req, res, next) {
    
});

/* Delete an existing article by id */
router.post(version + '/article/delete/:id', function(req, res, next) {
    
});


/* test */
router.get(version + '/test', function(req, res, next) {
    model.test(function(err, json_str) {
        res.send(json_str);
    });
});

module.exports = router;
