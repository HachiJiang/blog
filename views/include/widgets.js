function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (undefined, widgets) {
buf.push("<aside class=\"widget widget-category\"><h3 class=\"widget-title\">分类</h3><ul id=\"widget-cat-list\">");
if ( widgets && widgets.cat_list)
{
var cat_list = widgets.cat_list
// iterate cat_list
;(function(){
  var $$obj = cat_list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var cat = $$obj[$index];

buf.push("<li" + (jade.attrs(jade.merge([{"class": "cat-item"},{'id': 'cat-' + cat.category_id}]), false)) + "><a href=\"#\">" + (jade.escape(null == (jade_interp = cat.category_name) ? "" : jade_interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var cat = $$obj[$index];

buf.push("<li" + (jade.attrs(jade.merge([{"class": "cat-item"},{'id': 'cat-' + cat.category_id}]), false)) + "><a href=\"#\">" + (jade.escape(null == (jade_interp = cat.category_name) ? "" : jade_interp)) + "</a></li>");
    }

  }
}).call(this);

}
buf.push("</ul></aside><aside class=\"widget widget-archive\"><h3 class=\"widget-title\">存档页</h3><ul id=\"widget-archive-list\"></ul></aside><aside class=\"widget widget-tag\"><h3 class=\"widget-title\">标签</h3><div id=\"widget-tag-list\">");
if ( widgets && widgets.tag_list)
{
var tag_list = widgets.tag_list
// iterate tag_list
;(function(){
  var $$obj = tag_list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var tag = $$obj[$index];

buf.push("<span><a" + (jade.attrs(jade.merge([{"href": "#","class": "tag-link"},{'id': 'tag-' + tag.tag_id}]), false)) + ">" + (jade.escape(null == (jade_interp = tag.tag_name) ? "" : jade_interp)) + "</a></span>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var tag = $$obj[$index];

buf.push("<span><a" + (jade.attrs(jade.merge([{"href": "#","class": "tag-link"},{'id': 'tag-' + tag.tag_id}]), false)) + ">" + (jade.escape(null == (jade_interp = tag.tag_name) ? "" : jade_interp)) + "</a></span>");
    }

  }
}).call(this);

}
buf.push("</div></aside><aside class=\"widget widget-links\"><h3 class=\"widget-title\">链接</h3><ul id=\"link-list\"><li><a class=\"extra-link\">Email: swordarchor@gmail.com</a></li><li><a href=\"https://github.com/HachiJiang\" class=\"extra-link\">GitHub: https://github.com/HachiJiang</a></li></ul></aside><aside class=\"widget widget-stats\"><h3 class=\"widget-title\">博客统计</h3></aside>");}.call(this,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined,"widgets" in locals_for_with?locals_for_with.widgets:typeof widgets!=="undefined"?widgets:undefined));;return buf.join("");
}