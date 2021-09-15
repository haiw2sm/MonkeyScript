// ==UserScript==
// @name        CSDN-筑基
// @namespace     http://tampermonkey.net/
// @version         0.1010
// @match        *://*.blog.csdn.net/*
// @icon        chrome://favicon/http://blog.csdn.net/
// @description   仅供参考学习
// @author        haiw2
// @grant        GM_setClipboard
// @reference     https://source.unsplash.com/random
// @namespace    https://greasyfork.org/zh-CN/scripts/432021
// @supportURL   https://github.com/haiw2/MonkeyScript
// @homepageURL  https://github.com/haiw2/MonkeyScript
// ==/UserScript==

(function() {
    'use strict';
    csdn.copyright.textData = '';
    let head_nav_toolbar = document.querySelector('#csdn-toolbar');

    // 删除头部广告
    head_nav_toolbar.addEventListener("DOMNodeInserted", function() {
        if(head_nav_toolbar.firstElementChild.className==='toolbar-advert') head_nav_toolbar.removeChild(head_nav_toolbar.firstElementChild);
    });


    // 删除登录弹窗
    document.body.addEventListener("DOMNodeInserted", function() {
        let login1 = document.querySelector('#app');
        let login2 = document.querySelector('#passportbox');
        if (login1!=null) login1.style.display = 'none';
        if (login2!=null) {
            login2.style.display = 'none';
            login2.previousElementSibling.style.display = 'none';
        }
            // let login = document.body.querySelector('script[src*="login"]');
            // login.parentNode.removeChild(login);
            // document.body.lastElementChild.style.display = 'none';
            // document.body.lastElementChild.previousElementSibling.style.display = 'none';
            // document.body.removeChild(document.body.lastElementChild);
            // document.body.removeChild(document.body.lastElementChild);
    });
    let xx = document.querySelectorAll('a[href*="fn"]')
    xx.forEach((item, index)=>{
        console.info(item.id);
        let node = document.querySelector(`#${item.id}`);
        item.removeAttribute('onclick');
        item.addEventListener('click',function(){
            node.scrollIntoView({ behavior: "smooth" })
        });
    })
    class CSDN{
        construct(focusSwitch){
            console.log('构造方法');
        };

        /*
        @name    复制
        @func
            modifyCopyPriviledge: 修改权限
            copy: 复制逻辑
        */
        modifyCopyPriviledge(codeElem,signElem){
            //代码容器修改
            codeElem.removeAttribute('onclick');
            codeElem.style.setProperty('user-select','auto');
            codeElem.parentNode.style.setProperty('user-select','auto');
            codeElem.parentNode.style.setProperty('margin-bottom','30px');
            // 登录容器修改
            try{
                signElem.removeAttribute('onclick');
                signElem.setAttribute('data-title','点击复制');
                signElem.style.margin = '0';
                signElem.style.setProperty('margin-bottom', '40px');
                signElem.style.setProperty('max-width','80px');
                signElem.style.setProperty('min-height','15px');
                signElem.style.setProperty('font-size','15px');
                signElem.style.left = '56px';
                return true
            }catch(e){
                return false
            }finally{
                // 复制按钮位置变化 代码块并列、代码块内、代码块外
                    codeElem.parentNode.insertBefore(signElem, codeElem);
            }
        };
        copy(signElem) {
            let codeelem = null;
            try{
                codeelem = signElem.parentNode;
                if(codeelem.id.indexOf('code')===-1){ // 父节点
                    throw new EvalError('值错误');
                }
            }catch(err){// 兄弟节点
                codeelem = signElem.previousElementSibling;
            }
            document.oncopy=function(e){
                e.clipboardData.setData('text',codeelem.innerText);
                e.preventDefault();
                document.oncopy=null;
            }
            document.execCommand("Copy");// 执行浏览器复制命令
            signElem.setAttribute('data-title','复制成功');
            signElem.style.cssText += 'background-color: green';
            setTimeout(()=>{ // 先延时1000ms，再执行回调函数
                signElem.setAttribute('data-title','点击复制');
                signElem.style.removeProperty('background-color','green');
            },1000);
        };
        /*
        @name 专注模式
        @func
            modifyFocusPriviledge: 修改专注权限
            showFocusModel: 展开专注模式
        */
        modifyFocusPriviledge(mainBox, main, catalog){
            // 修改toolbar
            let toolbar = document.querySelector('.csdn-side-toolbar');
            toolbar.style.right = "20px";
            toolbar.style.position = "fixed";
            let listen_op = {attributes:true};
            function callback(mutationsList){ // 仅监听属性变化
                toolbar.style.left = "";
            };
            // 创建一个链接到回调函数的观察者实例
            var observer = new MutationObserver(callback);
            // 开始观察已配置突变的目标节点
            observer.observe(toolbar, listen_op);
            // 停止观察
            // observer.disconnect();
            let focusSwitch = document.querySelector('.option-box').cloneNode(true);
            focusSwitch.firstElementChild.src = 'https://s1.aigei.com/src/img/png/05/055f0df239ef4451a25be1e5c4617f96.png?imageMogr2/auto-'+
                'orient/thumbnail/!199x199r/gravity/Center/crop/199x199/quality/85/&e=1735488000&'+
                'token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:pxpJ0L3fOUppABVi15gOFs94eqk=';
            focusSwitch.style.background = "rgba(0,0,0,0.1)";
            focusSwitch.firstElementChild.style.width = "200%";
            focusSwitch.firstElementChild.style.display = "block"; // 去除初始鼠标放上有动态加载事件
            focusSwitch.removeChild(focusSwitch.lastElementChild);
            focusSwitch.removeAttribute('mouseup');
            toolbar.replaceChildren(focusSwitch);

            toolbar.style.left = '0px';

            // 修改默认页面配置样式
            main.removeAttribute('id');
            mainBox.firstElementChild.nextElementSibling.style.removeProperty('z-index');
            main.style.cssText += 'z-index:999;position:absolute';
            main.style.display = 'none';
            document.body.insertBefore(main, document.body.firstElementChild);
            if(catalog!=null){
                let pn = catalog.parentNode;
                let _catalog = catalog.cloneNode(true);
                _catalog.style.cssText += 'z-index:999;position:fixed;background-color: rgba(255,255,255,0.2);position: fixed;top: 80px;color: white;right: 20px;';
                _catalog.style.setProperty('max-height','454.5px');
                _catalog.firstElementChild.style.setProperty('max-height','inherit');
                _catalog.firstElementChild.firstElementChild.style.cssText += 'text-align:center;background:black;color:white';
                _catalog.style.display = 'none';
                _catalog.removeAttribute('id');
                let className = (function(){
                    let arr = [];
                    for(let i=0;i<3;i++){
                        if(pn.className.length){
                            arr.push(pn.className);
                        }
                        pn = pn.parentNode;
                    }
                    return arr.join(' ')
                })();
                _catalog.className += ' ' + className;
                document.body.insertBefore(_catalog, document.body.firstElementChild);
                return {a: focusSwitch,b: _catalog};
            }
            return {a:focusSwitch,b:catalog}

        };
        showFocusModel(status, mainBox, main,catalog){
            if(status===0){ // 进入专注模式
                console.log(`----${status}: 专注模式----`)
                mainBox.style.display = 'none';
                mainBox.nextElementSibling.style.display = 'none';
                main.style.display = 'block';
                if(catalog!=null){
                    catalog.style.display = 'block';
                    catalog.setAttribute('id','groupfile');
                }
            }else{
                console.log(`----${status}: 初始模式----`);
                mainBox.style.display = 'block';
                mainBox.nextElementSibling.style.display = 'block';
                main.style.display = 'none';
                if(catalog!=null){
                    catalog.style.display = 'none';
                    catalog.removeAttribute('id');
                }
            }
        }
    };

    let _csdn = new CSDN();
    let mainBox = document.getElementById('mainBox');
    let main = mainBox.firstElementChild.cloneNode(true);
    let catalog = document.getElementById('groupfile');
    let compose = _csdn.modifyFocusPriviledge(mainBox, main, catalog);
    let status = -1;
    compose.a.addEventListener('click', function(){
        status = ~status;
        _csdn.showFocusModel(status,mainBox,main,compose.b);
    },'true');
    let codes = document.querySelectorAll('#content_views pre code');
    let signs = document.querySelectorAll('#content_views .signin');
    // 解决部分文章允许不登陆复制的脚本定位问题
    if(signs.length===0) signs = document.querySelectorAll('#content_views .hljs-button');
    for(var i=0;i<codes.length;i++){
        let sign = signs[i], code = codes[i];
        _csdn.modifyCopyPriviledge(code, sign);
        sign.addEventListener('click', function(){
            GM_setClipboard(code.innerText, "text");
            sign.setAttribute('data-title','复制成功');
            sign.style.cssText += 'background-color: green';
            setTimeout(()=>{ // 先延时1000ms，再执行回调函数
                sign.setAttribute('data-title','点击复制');
                sign.style.removeProperty('background-color','green');
            },1000);
            // _csdn.copy(this);
        },'true');
    };
})();