/**
 * 获取参数的键值对对象。
 * @returns {Object}
 */
var getParam = function () {
    try{
      console.log(window.location.href);
    var url = decodeURI(window.location.href);
    var result = url.split("?")[1];
    var keyValue = result.split("&");
    var obj = {};
    for (var i = 0; i < keyValue.length; i++) {
        var item = keyValue[i].split("=");
        obj[item[0]] = item[1];
    }
    return obj;}catch(e){
        console.warn("There has no param value!");
    }
};
/**
 * 页面加载完毕打印键值对对象
 */
window.onload = function () {
    var name=getParam().name
    console.log(name);
    if(name){
      document.getElementById("name").innerHTML = getParam().name;
    }
}
