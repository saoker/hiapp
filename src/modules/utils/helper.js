var appFunc = require('../utils/appFunc');
var content = require("../app/content");

Template7.registerHelper('format_ymd', function (create_time){
    return appFunc.format_ymd(create_time);
});
Template7.registerHelper('format_how_long', function (create_time){
    return appFunc.format_how_long(create_time);
});
Template7.registerHelper('matchUrl', function (content){
    return (appFunc.matchUrl(appFunc.replace_smile(content)));
});

Template7.registerHelper('img_tag', function (imgs){
    if(!imgs) {
        return '';
    }
    var _imgs   =   JSON.parse(imgs);
    var _width  =   "100";
    var _len    =   _imgs.length;
    if(_len==1){
        _width  =   "100";
    }else if(_len==2){
        _width  =   '48';
    }else {
        _width  =   "30";
    }
    var ret = '<div class="item-image">';
    $$.each(_imgs, function (index, value) {
        ret+='<img data-src="'+value+'"  class="lazy lazy-fadeIn"  width="'+_width+'%" >';
    });
    ret+='</div>';
    return ret;
});

Template7.registerHelper('format_chat_time', function (create_time,options){
    return appFunc.format_chat_time(create_time,options.hash.show_time);
});
Template7.registerHelper('face_text', function (text){
   return appFunc.replace_smile(text);
});
//获取用户名
Template7.registerHelper('a_username', function (uid){
    return '<a href="page/contacts_detail.html?uid='+uid+'" class="item-link">'+appFunc.getUsernameByUid(uid)+'</a>';
});

Template7.registerHelper('get_username', function (uid){
    return appFunc.getUsernameByUid(uid);
});
//获取头像
Template7.registerHelper('get_filename', function (uid){
    return content.IMAGE_URL+appFunc.getFilenameByUid(uid);
});
Template7.registerHelper('a_avatar', function (uid){
    return '<a href="page/contacts_detail.html?uid='+uid+'" class="item-link"><img src="'+content.IMAGE_URL+appFunc.getFilenameByUid(uid)+'" alt=""></a>';
});