/* 边栏相关操作 */

define(['jquery', 'mkEditor', 'exports'], function(jquery, mkEditor, exports) {
    var _catTpl = function(cat_id, cat_name) {
        return '<li class="filter-item cat-item" id=cat-' + cat_id + '><span class="glyphicon glyphicon-folder-open"><a href="#">' + cat_name + '</a></span></li>';
    };
    var _tagTpl = function(tag_id, tag_name) {
        return '<a href="#" class="filter-item tag-item" id=tag-' + tag_id + '>' + tag_name + '</a>';
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

    /**
     * 更新作为filter的节点状态
     * @param node
     */
    exports.updateFilterNd = function(node) {
        var activeFilters = $('.filter-item').find('.active');

        activeFilters.each(function(nd) {
            nd.removeClass('active');
        });

        $(node).addClass('active');
    };

    /**
     * 根据dom node的id属性返回id
     * @param id_str
     * @returns {*}
     */
    exports.extractId = function(id_str) {
        return id_str.split('-')[1];
    };
});
