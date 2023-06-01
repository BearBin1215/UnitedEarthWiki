"use strict";
// <pre>
$(function () {
    if (mw.config.get("wgPageName") === "首页") {
        $('#siteSub').remove();
    }
    mw.loader.using(["oojs-ui"]).done(function () {
        $("head").append("<style>.template-tabs,.template-tabs>.oo-ui-menuLayout-menu,.template-tabs>.oo-ui-menuLayout-content,.template-tabs>.oo-ui-menuLayout-menu>.oo-ui-panelLayout-expanded,.template-tabs>.oo-ui-menuLayout-content>.oo-ui-panelLayout-expanded,.template-tabs>.oo-ui-menuLayout-content>.oo-ui-panelLayout-expanded>.oo-ui-panelLayout-expanded {position: static;}.template-tabs>.oo-ui-menuLayout-menu {height: auto !important;}.template-tabs>.oo-ui-menuLayout-content>.oo-ui-panelLayout-expanded>.oo-ui-panelLayout-expanded {background-color: #F8F8F8;}</style>");
        $(".tabs").each(function (_, outer) {
            var $ele = $(outer);
            var i = 1;
            var tablist = [];
            $ele.children(".template-tabs-tab").each(function (_, inner) {
                tablist.push(new OO.ui.TabPanelLayout("tab-".concat(i), { label: $(inner) }));
                i++;
            });
            var labellist = $ele.children(".template-tabs-label");
            for (i = 0; i < tablist.length; i++) {
                tablist[i].$element.append(labellist[i]);
            }
            var index = new OO.ui.IndexLayout({
                classes: ["template-tabs"]
            });
            index.addTabPanels(tablist);
            $ele.replaceWith(index.$element);
        });
    });
});
// </pre>