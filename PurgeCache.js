'use strict';
$(function () {
    var containerNode;
    if (mw.config.get("wgNamespaceNumber") === -1) {
        containerNode = $('<span/>');
        containerNode.append("特殊页面");
    } else {
        containerNode = $('<a title="清除本页缓存" />');
        var statusNode = $('<span/>').text('清除缓存'),
            runningStatus = false;
        containerNode.attr("href", 'javascript:void(0);');
        containerNode.append(statusNode);
        containerNode.on('click', function () {
            if (runningStatus) return;
            statusNode.text('正在清除…');
            runningStatus = true;
            var api = new mw.Api(),
                opt = {
                    action: 'purge',
                    format: 'json',
                    forcelinkupdate: true,
                    titles: mw.config.get('wgPageName')
                };
            api.post(opt).then(function () {
                requestAnimationFrame(function () {
                    api.post(opt).then(function () {
                        statusNode.text('清除成功！');
                        setTimeout(location.reload.bind(location), 200);
                    }, function () {
                        statusNode.text('清除失败！');
                        runningStatus = false;
                        setTimeout(function () {
                            if (!runningStatus) statusNode.text('清除缓存');
                        }, 2000);
                    });
                });
            }, function () {
                statusNode.text('清除失败！');
                runningStatus = false;
                setTimeout(function () {
                    if (!runningStatus) statusNode.text('清除缓存');
                }, 1000);
            });
        });
    }
    var li;
    var userSkin = mw.config.get("skin");
    if (userSkin === "vector") {
        li = $('<li id="pt-purge"/>').appendTo("#p-personal ul.vector-menu-content-list");
        li.append(containerNode);
    } else if (userSkin === "citizen") {
        li = $('<li id="purge-cache-button"/>').appendTo("#p-cactions>ul");
        li.append(containerNode);
        $('head').append('<style>#purge-cache-button>a::before{content:"〇";width:20px;height:20px;display:flex;justify-content:center;align-items:center;font-size:20px;font-weight:700}</style>')
    }
});