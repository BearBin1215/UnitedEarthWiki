/**
 * 删除页面时清除默认理由
 */

"use strict";
$(function () {
    if (mw.config.get("wgAction") === "delete") {
        $("#wpReason").val("");
    }
});