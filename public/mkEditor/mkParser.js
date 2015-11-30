/* Markdown Parser */

define(['mkEditor/lib/marked.min.js', 'mkEditor/lib/highlight.pack.js', 'exports'], function(marked, highlight, exports) {
    // config for marked.js + highlight.js
    marked.setOptions({
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });

    // 解析用户输入的markdown内容
    return function(content) {
        if (!content) {
            console.log('invalid content to parse');
            return;
        }
        var content_node = $("<div>" + marked(content) + "</div>");
        $(content_node).find("code").addClass("hljs");
        return $(content_node).html();
    };
});
