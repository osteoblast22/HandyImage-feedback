// ==UserScript==
// @name         Handy Image feedback
// @version      0.1
// @author      osteoblast22
// @homepage    https://github.com/osteoblast22/HandyImage-feedback
// @supportURL  https://github.com/osteoblast22/HandyImage-feedback/issues
// @updateURL   https://github.com/osteoblast22/HandyImage-feedback/raw/master/HandyImage-feedback.user.js
// @downloadURL https://github.com/osteoblast22/HandyImage-feedback/raw/master/HandyImage-feedback.user.js
// @include http://*/*
// @include https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// ==/UserScript==

GM_registerMenuCommand('Handy Image feedback: github settings', settingConfig,"c")
GM_registerMenuCommand('Handy Image feedback: Submit this site', PostSite,"P")

GM_config.init({
    'id': 'settings',
    'fields': {
        'username': {
            'label': 'github username',
            'type': 'text',
        },
        'password': {
            'label': 'github passowrd or access token',
            'type': 'text',
        }
    }
});

function PostSite() {
    if (GM_config.get('username') == '' || GM_config.get('password') == '') {
        GM_notification({
            text: "please set your github credentials in the userscript settings",
            title: "no credentials",
            onclick: settingConfig
        })
        //alert("please set your github credentials in the userscript settings")
    } else {
        console.log(GM_config.get('username'))
        console.log(GM_config.get('password'))
        var postData = {
            title: "add/fix " + window.location.host,
            body: "sample: " + window.location.href + "\n\
---\n\
<sub>posted by [HandyImage-feedback](https://github.com/osteoblast22/HandyImage-feedback)</sub>"
        }
        GM_xmlhttpRequest({
            url: "https://api.github.com/repos/Owyn/HandyImage/issues",
            method: "POST",
            headers: {
                "Content-Type": "text/json",
                "Authorization": "Basic " + btoa(GM_config.get('username') + ":" + GM_config.get('password'))
            },
            user: GM_config.get('username'),
            password: GM_config.get('password'),
            data: JSON.stringify(postData),

            onload: function(response) {
                if (response.status == 201) {
                    GM_notification({
                        text: "the site has been submited",
                        title: "success"
                    })
                } else {
                    console.log(response)
                }
            }
        })
    }
}

function settingConfig() {
    GM_config.open();
}