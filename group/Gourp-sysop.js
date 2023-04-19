"use strict";
$('.patroller-only').removeClass('patroller-only');
$('.sysop-only').removeClass('sysop-only');

// 一键清理沙盒
if (mw.config.get("wgPageName") === "帮助:沙盒") {
    $(mw.util.addPortletLink("p-cactions", "#", "清理沙盒", "clear-sandbox", "清理沙盒", "r")).on("click", function () {
        new mw.Api().postWithToken("csrf", {
            format: "json",
            action: "edit",
            watchlist: "nochange",
            tags: "Automation tool",
            title: mw.config.get("wgPageName"),
            text: "<!--请勿删除此行-->{{沙盒页顶}}[[分类:帮助]]<!--Please do not delete this line-->",
            summary: "清理沙盒"
        })
            .done(function () {
                mw.notify("清理完毕，即将刷新……");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            })
            .fail(function (err) {
                mw.notify("清理沙盒时出现错误：" + err + "。");
            })
    });
}