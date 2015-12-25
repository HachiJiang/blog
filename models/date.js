/* date-related manipulatioins */

exports.format = _convertDate;

/**
 * 从数据库返回的格式为：2015-12-06T12:31:45.000Z，需要转换
 * @param  {[type]} d [description]
 * @return {[type]}   [description]
 */
function _convertDate(d) {
    return new Date(d).Format('YYYY-mm-dd hh:ii:ss');
}

// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(m)、日(d)、小时(h)、分(i)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(Y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("YYYY-mm-dd hh:ii:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("YYYY-m-d h:i:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "m+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "i+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(Y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
