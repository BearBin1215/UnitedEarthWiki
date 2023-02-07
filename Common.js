'use strict'

// 移除首页标题下的欢迎语
$(function () {
    if (mw.config.get("wgPageName") === "首页") {
        $('#siteSub').remove();
    }
});
