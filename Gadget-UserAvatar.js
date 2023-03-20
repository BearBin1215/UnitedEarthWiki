"use strict";
/**
 * 引自萌娘百科小工具UserLinkAvatar：https://zh.moegirl.org.cn/MediaWiki:Gadget-UserLinkAvatar.js
 * 依CC BY-NC-SA 3.0引入，有修改
 */
(function () {
    var magnifierOn = +mw.user.options.get("gadget-userLinkAvatarMagnifier", 0) === 1;
    var $window = $(window);
    var loadingImage = "";
    $window.on("load.UserLinkAvatar", function () {
        var images = [];
        $(".mw-userlink:not(.user-avatar-added)").each(function (_, ele) {
            var item = $(ele);
            var src = "https://wiki.unitedearth.cc/extensions/Avatar/avatar.php?user=".concat(encodeURIComponent(item.text()));
            var img = $("<img/>").on("error", function () {
                window.setTimeout(function () {
                    img.closest(".userlink-avatar").remove();
                }, 0);
            }).addClass("userlink-avatar-small").attr({
                "data-src": src,
                src: loadingImage
            });
            images.push(img[0]);
            var bigAvatar = $("<span/>").addClass("userlink-avatar");
            item.prepend(bigAvatar.append(img));
            item.addClass("user-avatar-added");
            if (magnifierOn) {
                var magnifierImg_1 = $("<img/>", {
                    attr: {
                        "data-src": src,
                        src: loadingImage
                    },
                    on: {
                        error: function () {
                            window.setTimeout(function () {
                                magnifierImg_1.closest(".userlink-avatar-large").remove();
                            }, 0);
                        }
                    }
                });
                images.push(magnifierImg_1[0]);
                bigAvatar.on("click", function () {
                    window.open("https://wiki.unitedearth.cc/index.php?title=Special%3A\u67E5\u770B\u5934\u50CF&user=".concat(encodeURIComponent(item.text())), "_blank");
                    return false;
                }).append($("<div/>", {
                    attr: {
                        "class": "userlink-avatar-large"
                    }
                }).prepend(magnifierImg_1)).addClass("userlink-avatar-hover");
                item.before(bigAvatar);
                bigAvatar.add(bigAvatar.children()).attr("title", "\u67E5\u770B\u7528\u6237".concat(item.text(), "\u7684\u5934\u50CF"));
            }
        });
        if (typeof window.lazyload === "function") {
            window.lazyload(images);
        }
        else {
            images.forEach(function (ele) {
                ele.src = ele.dataset.src;
            });
        }
    });
    $(function () {
        $window.trigger("load.UserLinkAvatar");
    });
})();
