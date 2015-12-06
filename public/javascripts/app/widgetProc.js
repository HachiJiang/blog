/* 边栏相关操作 */

define(['jquery', 'mkEditor', 'exports'], function(jquery, mkEditor, exports) {
    var _catTpl = function(cat_id, cat_name) {
        return '<li class="cat-item" id=cat-' + cat_id + '><a href="#">' + cat_name + '</a></li>';
    };
    var _tagTpl = function(tag_id, tag_name) {
        return '<span><a href="#" class="tag-link" id=' + tag_id + '>' + tag_name + '</a></span>';
    };

    /**
     * Add category list in side bar
     * @param  {Array} list [description]
     * @return null
     */
    exports.displayCategories = function(list) {
        var cat, htmlstr = '';
        for (var i = 0, il = list.length; i < il; i++) {
            cat = list[i];
            htmlstr += _catTpl(cat.category_id, cat.category_name);
        }
        $('#widget-cat-list').html(htmlstr);
    };

    /**
     * Add tag list in side bar
     * @param  {Array} list [description]
     * @return null
     */
    exports.displayTags = function(list) {
        var tag, htmlstr = '';
        for (var i = 0, il = list.length; i < il; i++) {
            tag = list[i];
            htmlstr += _tagTpl(tag.tag_id, tag.tag_name);
        }
        $('#widget-tag-list').html(htmlstr);
    };

});
