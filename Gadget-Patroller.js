"use strict";
$(function () {
    if (!mw.config.get('wgPageName').includes('/') && mw.config.get('wgEditMessage') === "creating" && mw.config.get('wgNamespaceIds').user_talk == mw.config.get('wgNamespaceNumber')) {
        $("#wpTextbox1").val("{{欢迎|~~~}}");
    }
});