function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (article, undefined) {
buf.push("<link rel=\"stylesheet\" href=\"/mkEditor/styles/font-awesome.min.css\"/><div class=\"article-editor\"><h4>文章编辑</h4><div><form class=\"form-group\">");
if ( article && article.title)
{
buf.push("<input" + (jade.attrs(jade.merge([{"placeholder": "标题","class": "form-control article-title"},{'value': article.title}]), false)) + "/>");
}
else
{
buf.push("<input placeholder=\"标题\" class=\"form-control article-title\"/>");
}
buf.push("<div class=\"article-meta-wrap\"><div class=\"pull-left article-cat-wrap\"><div class=\"pull-left\"><span>类别: </span></div><div class=\"pull-left dropdown\"><a id=\"dropdown-cat-menu\" href=\"#\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-default btn-xs dropdown-toggle\">默认<span class=\"caret\"></span></a><ul aria-labelledby=\"dropdown-cat-menu\" class=\"dropdown-menu\"><li><a role=\"separator\" class=\"divider\"></a></li><li class=\"cat-add-link\"><a href=\"#\">Add...</a></li></ul></div></div><btn class=\"pull-left btn-tag-add\"><a href=\"#\">添加标签</a></btn><div class=\"pull-left article-tag-list\">");
if ( article && article.tags)
{
// iterate article.tags
;(function(){
  var $$obj = article.tags;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var tag = $$obj[$index];

buf.push("<a class=\"article-tag pull-left\">" + (jade.escape(null == (jade_interp = tag) ? "" : jade_interp)) + "</a>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var tag = $$obj[$index];

buf.push("<a class=\"article-tag pull-left\">" + (jade.escape(null == (jade_interp = tag) ? "" : jade_interp)) + "</a>");
    }

  }
}).call(this);

}
buf.push("</div></div><div class=\"pull-right article-preview\"><btn data-toggle=\"modal\"><a href=\"#\">预览</a></btn></div></form><div style=\"clear:both\" class=\"article-editor-toolbar\"><div class=\"btn btn-default btn-xs btn-article-pic\"><span aria-hidden=\"true\" class=\"fa fa-file-image-o\"></span></div></div>");
if ( article && article.content)
{
buf.push("<textarea rows=\"20\" placeholder=\"正文，请使用markdown语法编辑\" class=\"form-control article-content\">" + (jade.escape(null == (jade_interp = article.content) ? "" : jade_interp)) + "</textarea>");
}
else
{
buf.push("<textarea rows=\"20\" placeholder=\"正文，请使用markdown语法编辑\" class=\"form-control article-content\"></textarea>");
}
buf.push("<div class=\"pull-right\"><button type=\"button\" class=\"btn btn-default btn-editor-exit\">退出编辑</button><button type=\"button\" class=\"btn btn-primary btn-editor-save\">发布文章</button></div><div tagindex=\"-1\" role=\"dialog\" aria-hidden=\"true\" class=\"modal dialog-article-preview\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-body\"><p>预览内容</p></div></div></div></div><div tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" class=\"modal dialog-upload-file\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" data-dismiss=\"modal\" aria-label=\"Close\" class=\"close\"><span aria-hidden=\"true\">&times;</span></button><h4 class=\"modal-title\">插入图片</h4></div><div class=\"modal-body\"><input type=\"file\" accept=\"image/png,image/gif,image/jpg,image/jpeg\" multiple=\"multiple\" style=\"display:none\" class=\"input-upload-img\"/><div class=\"input-group\"><span class=\"input-group-addon\"><span class=\"fa fa-file-image-o\"></span></span><input type=\"text\" class=\"form-control input-img-links\"/><span class=\"input-group-btn\"><button type=\"button\" onclick=\"$(&quot;input[class=input-upload-img]&quot;).click();\" class=\"btn\">...</button></span></div></div><div class=\"modal-footer\"><button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-default\">取消</button><button type=\"button\" class=\"btn btn-primary btn-confirm btn-upload-img\">确定</button></div></div></div></div></div></div>");}.call(this,"article" in locals_for_with?locals_for_with.article:typeof article!=="undefined"?article:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
}