/**
 * 添加挂删按钮
 */


'use strict';
$(function () {
    var regToDeleteButton;
    if (mw.config.get("wgNamespaceNumber") !== -1 && mw.config.get("wgUserGroups").includes("patroller"))  {
        regToDeleteButton = $('<a title="标记为待删除页面" />');
        regToDeleteButton.attr("href", 'javascript:void(0);');
        regToDeleteButton.append($('<span/>').text('标记待删除'));
        regToDeleteButton.on('click', function () {
            new mw.Api().postWithToken('csrf', {
                "action": "edit",
                "format": "json",
                "title": mw.config.get('wgPageName'),
                "text": "<noinclude>{{待删除}}</noinclude>",
                "nocreate": true,
                "watchlist": "nochange",
                "summary": "标记待删除页面"
            });
            setTimeout(function () {
                location.reload(false);
            }, 500);
        });
    }
    var li = $('<li id="regToDelete"/>').appendTo("#p-cactions>ul");
    li.append(regToDeleteButton);
});