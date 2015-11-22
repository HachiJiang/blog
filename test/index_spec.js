var apitest = require('./apitest');

var apiArr = [
    /* GET home page. */
    {
        url: 'http://localhost:8080/v1/articles',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                article_id: 3,
                article_title: "test4",
                category_name: "Life",
                article_date_created: "2015-11-16T16:00:00.000Z",
                article_date_modified: "2015-11-17T16:00:00.000Z",
                user_name: "guai",
                status_name: "posted",
                article_content: "ttttttttttttttttttttttt",
                article_statistics: null,
                tags: "mojo"
            }, {
                article_id: 2,
                article_title: "test3",
                category_name: "Life",
                article_date_created: "2015-11-15T16:00:00.000Z",
                article_date_modified: "2015-11-15T16:00:00.000Z",
                user_name: "guai",
                status_name: "posted",
                article_content: "zzzzzzzzzzzzzzzzzzzzzz",
                article_statistics: null,
                tags: "mongodb,javascript,php"
            }, {
                article_id: 1,
                article_title: "test2",
                category_name: "Study",
                article_date_created: "2015-11-11T16:00:00.000Z",
                article_date_modified: "2015-11-11T16:00:00.000Z",
                user_name: "guai",
                status_name: "draft",
                article_content: "yyyyyyyyyyyyyyyyyyyyyyy",
                article_statistics: null,
                tags: "javascript,php"
            }, {
                article_id: 6,
                article_title: "test1",
                category_name: "Study",
                article_date_created: "2015-11-08T16:00:00.000Z",
                article_date_modified: "2015-11-09T16:00:00.000Z",
                user_name: "hansi",
                status_name: "draft",
                article_content: "xxxxxxxxxxxxxxxxxxxxx",
                article_statistics: null,
                tags: ""
            }, {
                article_id: 7,
                article_title: "test7",
                category_name: "Study",
                article_date_created: "2015-10-12T16:00:00.000Z",
                article_date_modified: "2015-10-19T16:00:00.000Z",
                user_name: "hansi",
                status_name: "posted",
                article_content: "kkkkkk",
                article_statistics: null,
                tags: ""
            }]
        }
    },
    /* GET articles (by page index) */
    {
        url: 'http://localhost:8080/v1/articles/page/1',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: []
        }
    },
    /* GET articles by category id */
    {
        url: 'http://localhost:8080/v1/articles/category/2/page/0',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                article_id: 3,
                article_title: "test4",
                category_name: "Life",
                article_date_created: "2015-11-16T16:00:00.000Z",
                article_date_modified: "2015-11-17T16:00:00.000Z",
                user_name: "guai",
                status_name: "posted",
                article_content: "ttttttttttttttttttttttt",
                article_statistics: null,
                tags: "mojo"
            }, {
                article_id: 2,
                article_title: "test3",
                category_name: "Life",
                article_date_created: "2015-11-15T16:00:00.000Z",
                article_date_modified: "2015-11-15T16:00:00.000Z",
                user_name: "guai",
                status_name: "posted",
                article_content: "zzzzzzzzzzzzzzzzzzzzzz",
                article_statistics: null,
                tags: "mongodb,javascript,php"
            }]
        }
    },
    /* GET articles by status */
    {
        url: 'http://localhost:8080/v1/articles/status/1/page/0',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                article_id: 1,
                article_title: "test2",
                category_name: "Study",
                article_date_created: "2015-11-11T16:00:00.000Z",
                article_date_modified: "2015-11-11T16:00:00.000Z",
                user_name: "guai",
                status_name: "draft",
                article_content: "yyyyyyyyyyyyyyyyyyyyyyy",
                article_statistics: null,
                tags: "javascript,php"
            }, {
                article_id: 6,
                article_title: "test1",
                category_name: "Study",
                article_date_created: "2015-11-08T16:00:00.000Z",
                article_date_modified: "2015-11-09T16:00:00.000Z",
                user_name: "hansi",
                status_name: "draft",
                article_content: "xxxxxxxxxxxxxxxxxxxxx",
                article_statistics: null,
                tags: ""
            }]
        }
    },
    /* GET single article by id */
    {
        url: 'http://localhost:8080/v1/article/1',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                article_id: 1,
                article_title: "test2",
                category_name: "Study",
                article_date_created: "2015-11-11T16:00:00.000Z",
                article_date_modified: "2015-11-11T16:00:00.000Z",
                user_name: "guai",
                status_name: "draft",
                article_content: "yyyyyyyyyyyyyyyyyyyyyyy",
                article_statistics: null,
                tags: "javascript,php"
            }]
        }
    },
    /* GET articles by tag */
    {
        url: 'http://localhost:8080/v1/articles/tag/1/page/0',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                article_id: 1,
                article_title: "test2",
                category_name: "Study",
                article_date_created: "2015-11-11T16:00:00.000Z",
                article_date_modified: "2015-11-11T16:00:00.000Z",
                user_name: "guai",
                status_name: "draft",
                article_content: "yyyyyyyyyyyyyyyyyyyyyyy",
                article_statistics: null,
                tags: "javascript,php"
            }, {
                article_id: 2,
                article_title: "test3",
                category_name: "Life",
                article_date_created: "2015-11-15T16:00:00.000Z",
                article_date_modified: "2015-11-15T16:00:00.000Z",
                user_name: "guai",
                status_name: "posted",
                article_content: "zzzzzzzzzzzzzzzzzzzzzz",
                article_statistics: null,
                tags: "mongodb,javascript,php"
            }]
        }
    },
    /* GET articles by Year/Month */
    {
        url: 'http://localhost:8080/v1/articles/year/2015/month/10/page/0',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                article_id: 7,
                article_title: "test7",
                category_name: "Study",
                article_date_created: "2015-10-12T16:00:00.000Z",
                article_date_modified: "2015-10-19T16:00:00.000Z",
                user_name: "hansi",
                status_name: "posted",
                article_content: "kkkkkk",
                article_statistics: null,
                tags: ""
            }]
        }
    },
    /* GET tag list */
    {
        url: 'http://localhost:8080/v1/tags',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                tag_id: 1,
                tag_name: "javascript",
                tag_article_num: null
            }, {
                tag_id: 2,
                tag_name: "php",
                tag_article_num: null
            }, {
                tag_id: 3,
                tag_name: "mojo",
                tag_article_num: null
            }, {
                tag_id: 6,
                tag_name: "mongodb",
                tag_article_num: null
            }]
        }
    },
    /* GET category list */
    {
        url: 'http://localhost:8080/v1/categories',
        expect: {
            success: true,
            message: "Achieve data successfully",
            data: [{
                category_id: 1,
                category_name: "Study",
                category_article_num: 0
            }, {
                category_id: 2,
                category_name: "Life",
                category_article_num: 0
            }, {
                category_id: 3,
                category_name: "Work",
                category_article_num: 0
            }]
        }
    },
];

apitest.run(apiArr);
