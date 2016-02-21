/**
 * Widget - Pagination
 */

define(['jquery', 'runtime'], function(jquery, jade) {

    var PagiWidget = function PagiWidget(pageNum, curPageIdx) {
        if (this instanceof PagiWidget) {
            this.pageNum = pageNum || 0;
            this.curPageIdx = curPageIdx || 1;
            this._nd = $(_template({
                'pageNum': pageNum,
                'curPageIdx': curPageIdx
            }));
        } else {
            return new PagiWidget();
        }
    };

    PagiWidget.prototype = {
        show: function() {
            this._nd.style.display = 'block';
        },

        setCurPage: function(curPageIdx) {
            var _nd = this._nd;
            _nd.find('li.active').removeClass('active');
            _nd.find('li:nth-child(' + curPageIdx + ')').addClass('active');
        },

        hide: function() {
            this._nd.style.display = 'none';
        }
    };

    /**
     * Template of pagination widget
     * @param locals
     * @returns {string}
     * @private
     */
    function _template(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        ;var locals_for_with = (locals || {});(function (pageNum) {
            buf.push("<div class=\"content-pagination\"><nav>");
            if ( (pageNum > 0))
            {
                buf.push("<ul class=\"pagination\"><li class=\"disabled\"><a href=\"#\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>");
                var i = 1
                while (i <= pageNum)
                {
                    buf.push("<li><a href=\"#\">" + (jade.escape(null == (jade_interp = i++) ? "" : jade_interp)) + "</a></li>");
                }
                buf.push("<li class=\"disabled\"><a href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li></ul>");
            }
            buf.push("</nav></div>");}.call(this,"pageNum" in locals_for_with?locals_for_with.pageNum:typeof pageNum!=="undefined"?pageNum:undefined));;return buf.join("");
    }

    return PagiWidget;
});