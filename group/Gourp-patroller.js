// <pre>
"use strict";

$(function () {
    $('.patroller-only').removeClass('patroller-only');

    var welcomeMessage = '{{欢迎|1=~~~}}'
    if (!mw.config.get('wgPageName').includes('/') && mw.config.get('wgEditMessage') === "creating" && mw.config.get('wgNamespaceIds').user_talk == mw.config.get('wgNamespaceNumber')) {
        $("#wpTextbox1").val(welcomeMessage);
    }

});

// </pre>