/**
 * Widget - Pagination
 */

define(['jquery', 'runtime', 'XHR', 'articleProc'], function(jquery, jade, XHR, articleProc) {

    var PagiWidget = function PagiWidget(parentNd, pageTotal) {
        if (this instanceof PagiWidget) {
            this.pageTotal = pageTotal || 0;
            this.curPageIdx = 1;
            this._nd = $(_template({
                'pageTotal': pageTotal,
                'curPageIdx': this.curPageIdx
            }));
            parentNd.append(this._nd[0]);
        } else {
            return new PagiWidget();
        }
    };

    PagiWidget.prototype = {
        show: function() {
            this._nd[0].style.display = 'block';
        },

        setCurPage: function(curPageIdx) {
            var _nd = this._nd,
                keyPrevious = _nd.find('.key-previous'),
                keyNext = _nd.find('.key-next'),
                pageTotal = this.pageTotal;

            _nd.find('li.active').removeClass('active');
            $(_nd.find('.pagi-item')[curPageIdx - 1]).addClass('active');

            this.curPageIdx = curPageIdx;
            if (curPageIdx === 1 && keyPrevious.hasClass('disabled') === false) {
                // disable previous button
                keyPrevious.addClass('disabled');
            }

            if (curPageIdx === pageTotal && keyNext.hasClass('disabled') === false) {
                // disable next button
                keyNext.addClass('disabled');
            }

            if (curPageIdx > 1 && curPageIdx < pageTotal) {
                keyPrevious.removeClass('disabled');
                keyNext.removeClass('disabled');
            }

            XHR.getArticlesByPageIdx(curPageIdx - 1, articleProc.displayArticles);
        },

        hide: function() {
            this._nd[0].style.display = 'none';
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
        ;var locals_for_with = (locals || {});(function (curPageIdx, pageTotal) {
            buf.push("<div class=\"content-pagination\"><nav>");
            if ( (pageTotal > 0))
            {
                buf.push("<ul class=\"pagination\"><li class=\"key-previous\"><a href=\"#\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span></a></li>");
                var i = 1
                while (i <= pageTotal)
                {
                    if ( (i !== curPageIdx))
                    {
                        buf.push("<li class=\"pagi-item\"><a href=\"#\">" + (jade.escape(null == (jade_interp = i++) ? "" : jade_interp)) + "</a></li>");
                    }
                    else
                    {
                        buf.push("<li class=\"active pagi-item\"><a href=\"#\">" + (jade.escape(null == (jade_interp = i++) ? "" : jade_interp)) + "</a></li>");
                    }
                }
                buf.push("<li class=\"key-next\"><a href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span></a></li></ul>");
            }
            buf.push("</nav></div>");}.call(this,"curPageIdx" in locals_for_with?locals_for_with.curPageIdx:typeof curPageIdx!=="undefined"?curPageIdx:undefined,"pageTotal" in locals_for_with?locals_for_with.pageTotal:typeof pageTotal!=="undefined"?pageTotal:undefined));;return buf.join("");
    }

    return PagiWidget;
});