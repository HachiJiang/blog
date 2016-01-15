var frisby = require('frisby');
var async = require('async');

exports.run = function(apiArr) {
    console.log('API testing START!');
    async.each(apiArr, function(api, res) {
        var url = api.url;
        console.log('Testing on: ' + url);
        frisby.create('Testing on: ' + url)
            .get(url)
            .inspectJSON()
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON(api.expect)
            .toss();
        }, function(err) {
            if (err) {
                console.log('err: ' + err);
            }
        });
};