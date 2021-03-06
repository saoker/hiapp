require('framework7');
var store       = require("../utils/localStore");
var CryptoJS    = require("crypto-js");
var content     = require("../utils/content");
var appFunc     = require("../utils/appFunc");
module.exports = {

    isPhonegap: function() {
        return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
    },

    renderTpl: function(markup,renderData){
        var compiledTemplate = Template7.compile(markup);
        return compiledTemplate(renderData);
    },

    isEmail: function(str){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
    },
    isMobile:function(str){
        var reg = /^1[3458][\d]{9}$/;
        return reg.test(str);
    },

    getPageNameInUrl: function(url){
        url = url || '';
        var arr = url.split('.');
        return arr[0];
    },

    isEmpty: function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },

    hideToolbar: function() {
        hiApp.hideToolbar('.toolbar');
    },

    showToolbar: function() {
        hiApp.showToolbar('.toolbar');
    },

    timeFormat: function(ms){

        ms = ms * 1000;

        var d_second,d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' '+ f(s.getHours()) + ':'+ f(s.getMinutes()));
        }

        function f(n){
            if(n < 10)
                return '0' + n;
            else
                return n;
        }
    },

    getCharLength: function(str){
        var iLength = 0;
        for(var i = 0;i<str.length;i++)
        {
            if(str.charCodeAt(i) >255)
            {
                iLength += 2;
            }
            else
            {
                iLength += 1;
            }
        }
        return iLength;
    },

    matchUrl: function(string){
        if(string==''||this.isUndefined(string)){
            return string;
        }

        var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

        string = string.replace(reg,function(a){
            if(a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1){
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
            }
            else
            {
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
            }
        });
        return string;
    },

    bindEvents: function(bindings) {
        for (var i in bindings) {
            if(bindings[i].selector) {
                $$(bindings[i].element)
                    .on(bindings[i].event,bindings[i].selector , bindings[i].handler);
            }else{
                $$(bindings[i].element)
                    .on(bindings[i].event, bindings[i].handler);
            }
        }
    },

    format_ymd: function(ms){
        ms = ms * 1000;
        var d_second,d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()));
        }

        function f(n){
            if(n < 10)
                return '0' + n;
            else
                return n;
        }
    },
    //多久前评论
    format_how_long : function(create_time){
        var now     =   Date.parse(new Date())/1000;
        var limit   =   now-create_time;
        var content =   "";
        if(limit<60&&limit>0){
            content=limit+"秒前";
        }else if(limit>=60 && limit<3600){
            content=Math.floor(limit/60)+"分钟前";
        }else if(limit>=3600 && limit<86400){
            content=Math.floor(limit/3600)+"小时前";
        }else if(limit>=86400 && limit<2592000){
            content=Math.floor(limit/86400)+"天前";
        }else if(limit>=2592000 && limit<31104000){
            content=Math.floor(limit/2592000)+"个月前";
        }else if(limit>31104000){
            content=Math.floor(limit/31104000)+"年前";
        }else{
            content="很久前";
        }
        return content;
    },
    //聊天时间
    format_chat_time : function(create_time,show_time){
        show_time       =   this.isUndefined(show_time)?true:show_time;
        var date        =   new Date(create_time*1000);


        var now         =   new Date();
        var _nowYear    =   now.getFullYear();
        var _nowDay     =   now.getDate();


        var _createYear    =   date.getFullYear();
        var _createMonth   =   date.getMonth()+1;
        var _createDay     =   date.getDate();
        var _createHour    =   date.getHours();
        var _createMinu    =   date.getMinutes();

        var _content       =   "";
        //如果不相等,则写出年份
        if(_nowYear     !=  _createYear){
            _content    +=  _createYear+"年" ;
        }

        if(_nowDay      != _createDay){
            _content    +=  _createMonth+"月"+_createDay+"日 ";
            if(!show_time){ //如果不显示时间，则只显示年月日
                return _content;
            }
        }


        if(show_time){
            _content        +=  _createHour<12?"上午 ":"下午";
            _content        +=  _createHour+":"+_createMinu;
        }else{
            _content        +=  _createHour+":"+_createMinu;
        }
        return _content;
    },
    lazyImg:function(){
        hiApp.initImagesLazyLoad('.page');
    },
    //光标处插入内容
    insertText:function(obj,str) {
        if (document.selection) {
            var sel = document.selection.createRange();
            sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
            var startPos = obj.selectionStart,
                endPos = obj.selectionEnd,
                cursorPos = startPos,
                tmpStr = obj.value;
            obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += str.length;
            obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
            obj.value += str;
        }
    },

    replace_smile:function(str) {
        if(str==''||this.isUndefined(str)){
            return str;
        }
        str = str.replace(/\</g, '&lt;');
        str = str.replace(/\>/g, '&gt;');
        str = str.replace(/\n/g, '<br/>');
        str = str.replace(/\[:([\u4e00-\u9fa5]*)\]/g, '<img src="/img/face/$1.gif" border="0" width="24px" height="24px" style="display: inline;"/>');
        return str;
    },

    text:function(str){
      return str?this.matchUrl(this.replace_smile(str)):'';
    },
    now_time    : function(){
        return new Date().getTime();
    },
    now_time_hm : function(){
        var _date   =   new Date();
        return _date.getHours()+_date.getMinutes();
    },
    prompt  :   function (text, title,default_val, callbackOk, callbackCancel) {
        return hiApp.modal({
            text: text || '',
            title: typeof title === 'undefined' ? hiApp.params.modalTitle : title,
            afterText: '<div class="input-field"><input type="text" class="modal-text-input" style=" height: 32px;border-radius: 5px;" onclick="javascript:$$(this).focus().val($$(this).val())" value='+default_val+'></div>',
            buttons: [
                {
                    text: hiApp.params.modalButtonCancel
                },
                {
                    text: hiApp.params.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($$(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($$(modal).find('.modal-text-input').val());
            }
        });
    },
    success:function(msg){
        return {status:1,msg:msg};
    },
    error:function(msg){
        return {status:0,msg:msg};
    },


    //2016-8-25:每个api都要增加头部去验证
    _getParamsHeaderContentType:function(contentType) {
        return {//增加头部信息
            'Content-Type': contentType || undefined,
            'Uid': localStorage.id,
            'Token': localStorage.token
        }
    },
    getParamsHeader:function(){
        return this._getParamsHeaderContentType("application/json")
    },

    hiAlert :function(message){
        if(message&&message!=0){
            hiApp.alert(message,function(){
                hiApp.hideIndicator();
                hiApp.hidePreloader();
            });
        }
    },

    //2016-8-25:判断对象的是否有空值
    checkParamsHasNull:function(params){
        if(params instanceof  Object){
            for(var _param in params){
                if(!params[_param]&&params[_param]!=0){//只要有空值,则返回false
                    return false;
                }
            }
            return true;
        }else{
            return false;
        }
    },

    //2016-8-26:操作登录界面的显示
    showLogin:function(clear){
        $$("#loginView").addClass("modal-in");
        store.setValue("is_login",false);
        clear = clear || false;
        if(clear){
            store.setSyncStorageValue("password","");
            store.setSyncStorageValue("uid","");
            store.setSyncStorageValue("token","");
        }
    },
    //隐藏登录界面
    hideLogin:function(){
        $$("#loginView").removeClass("modal-in");
    },

    //加密解密
    encrypt:function(str){
        return CryptoJS.AES.encrypt(str, 'Hello F7');
    },
    decrypt:function(str){
        if(!str){
            return '';
        }
        var bytes  = CryptoJS.AES.decrypt(str.toString(), 'Hello F7');
        return bytes.toString(CryptoJS.enc.Utf8);
    },

    //获取文件后辍
    fileExt:function(str){
        return str.substring(str.lastIndexOf('.') + 1);
    },

    //判断是否切换了数据
    checkIsChangeDb:function(){
        if(store.getValue("is_login")=='true'){
            if(!store.getStorageValue("username")){
               this.showLogin();
            }
        }
    },


    //判断是否有新数据
    addBadge:function(key,val){
        val =   val||1;
        store.setSyncStorageValue(key,val);
        $$("#footer i."+key+" span").addClass("badge");
    },

    removeBadge:function(key){
        $$("#footer i."+key+" span").removeClass("badge");
        store.setSyncStorageValue(key,0);
    },

    //获取头像和姓名
    getFilenameByUid:function(uid){
        var _filename = store.getValue("filename_"+uid);
        return _filename?content.IMAGE_URL+_filename:_filename;
    },
    getFilenameByUidForUrl:function(uid,lazy){
        lazy = lazy||false;
        if(lazy){
            return '<a href="page/contacts_detail.html?uid='+uid+'" class="item-link"><img data-src="'+this.getFilenameByUid(uid)+'" alt="" width="35" height="35" class="lazy"></a>';
        }else{
            return '<a href="page/contacts_detail.html?uid='+uid+'" class="item-link"><img src="'+this.getFilenameByUid(uid)+'" alt="" width="35" height="35"></a>';
        }

    },
    setFilenameByUid:function(uid,filename){
        store.setValue("filename_"+uid,filename);
    },
    getUsernameByUid:function(uid){
        return store.getValue("username_"+uid);
    },
    getUsernameByUidForUrl:function(uid,append){
        append  =   append||'';
        return '<a href="page/contacts_detail.html?uid='+uid+'" class="item-link name" data-id="'+uid+'">'+append+this.getUsernameByUid(uid)+'</a>';
    },

    setUsernameByUid:function(uid,username){
        store.setValue("username_"+uid,username);
    },

    atUser:function(uid){
        return uid&&uid>0?this.getUsernameByUidForUrl(uid,"@"):'';
    },

    getUserId:function(){
        return store.getStorageIntVal("uid");
    },
    //判断是否在数组中
    rm_array:function (arr, val,isDel) {
        isDel   =   isDel||false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                if(isDel){
                    arr.splice(i,1)
                }
                return true;
            }
        }
        return false;
    },

    parseJson:function (str) {
        try {
            return JSON.parse(str);
        } catch (e) {
        }
        return str;
    },
    parseInt:function(str){
        return parseInt(str||0);
    },

    isUndefined:function(str){
        return typeof(str) === 'undefined';
    },

    getYmd:function(){
        var s = new Date();
        return s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate());
    }

};