function template(locals) {
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