function template(locals) {
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