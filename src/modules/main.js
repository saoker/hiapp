require('framework7');
require('../style/less/app.less');

var appFunc = require('./utils/appFunc'),
    appService = require('./services/appService'),
    router = require('./router'),
    index = require('./app/app');

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        if(appFunc.isPhonegap()) {//如果有cordova,则开启监听
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }else{
            window.onload = this.onDeviceReady();
        }
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(event) {
        switch (event) {
            case 'deviceready':
                app.initMainView();
                break;
        }
    },
    initMainView:function(){
        var lang = appService.getLocal();

        switch (lang){
            case 'en-us':
                require(['./lang/en-us'], function(lang){
                    window.i18n = lang;
                    app.initFramework7();
                });
                break;
            case 'zh-cn':
                require(['./lang/zh-cn'], function(lang){
                    window.i18n = lang;
                    app.initFramework7();
                });
                break;
        }

    },
    initFramework7: function(){

        //Register custom Template7 helpers
        Template7.registerHelper('t', function (options){
            var key = options.hash.i18n || '';
            var keys = key.split('.');

            var value;
            for (var idx = 0, size = keys.length; idx < size; idx++)
            {
                if (value != null)
                {
                    value = value[keys[idx]];
                } else {
                    value = i18n[keys[idx]];
                }

            }
            return value;
        });

        window.$$ = Dom7;
        window.hiApp = new Framework7({
            pushState: false,//如果为true,则会显示URL地址
            popupCloseByOutside:false,//点击modal(Alert, Confirm, Prompt)外面关闭她。
            animateNavBackIcon: true,//IOS only 当启用这个功能时，动态导航栏中的 back-link 图标的动画会更接近iOS的风格
            modalTitle: i18n.global.modal_title,    //弹出窗标题
            modalButtonOk: i18n.global.modal_button_ok,//弹出窗ok文字
            modalButtonCancel: i18n.global.cancel,  //弹出窗cancel 文字
            template7Pages: true,//设置为true，则会自动使用 Template7 来渲染 ajax或者动态生成的页面。
            template7Data: {
                'page:item': {  //动态详细界面
                    back: i18n.global.back,
                    title: i18n.item.title,
                    comment: i18n.timeline.comment,
                    forward: i18n.timeline.forward
                },
                'page:message': {//消息界面
                    chat: i18n.chat.title,
                    chatPlaceholder: i18n.chat.chatPlaceholder,
                    send: i18n.global.send
                },
                'page:feedback': {//反馈
                    feedBack: i18n.setting.feed_back,
                    feedBackPlaceholder: i18n.setting.feed_back_placeholder
                },
                'page:about': {//关于我们
                    appName: i18n.app.name,
                    about: i18n.setting.about
                },
                'page:language': {//语言切换
                    back: i18n.global.back,
                    done: i18n.global.done,
                    switchLanguage: i18n.global.switch_language
                }
            }
        });

        window.homeF7View = hiApp.addView('#homeView', {
            dynamicNavbar: true //IOS only Dynamic Navbar is supported only in iOS Theme
        });

        hiApp.addView('#contactView', {
            dynamicNavbar: true
        });

        hiApp.addView('#settingView', {
            dynamicNavbar: true
        });

        // init app
        router.init();
        index.init();
    }
};

app.initialize();
