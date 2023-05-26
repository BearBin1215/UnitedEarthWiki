/**
 * @group sysop & interface-admin
 */

// <pre>
"use strict";
$(() => (async () => {
    await mw.loader.using(["mediawiki.api", "mediawiki.ForeignApi", "mediawiki.util", "mediawiki.notification", "oojs-ui"]);
    const api = new mw.Api();
    const UEWapi = new mw.ForeignApi("https://wiki.unitedearth.cc/api.php", { anonymous: true });
    const isBot = mw.config.get("wgUserGroups").includes("bot");
    const $body = $("body");
    const USERNAME = mw.config.get("wgUserName");
    const NS = {
        0: "（主）",
        1: "讨论",
        2: "用户",
        3: "用户讨论",
        4: "地球联合百科",
        5: "地球联合百科讨论",
        6: "文件",
        7: "文件讨论",
        8: "MediaWiki",
        9: "MediaWiki讨论",
        10: "模板",
        11: "模板讨论",
        12: "帮助",
        13: "帮助讨论",
        14: "分类",
        15: "分类讨论",
        828: "模块",
        829: "模块讨论",
    };

    let LastSyncInfo;

    class PSWindow extends OO.ui.ProcessDialog {
        successCount = 0;
        failList = [];
        static static = {
            ...super.static,
            tagName: "div",
            name: "page-sync",
            title: "一键同步主站页面",
            actions: [
                {
                    action: "cancel",
                    label: "取消",
                    flags: ["safe", "close", "destructive"],
                },
                {
                    action: "submit",
                    label: "确认",
                    flags: ["primary", "progressive"],
                },
            ],
        };
        constructor(config) {
            super(config);
        }
        initialize() {
            super.initialize();
            this.panelLayout = new OO.ui.PanelLayout({
                scrollable: false,
                expanded: false,
                padded: true,
                id: "page-sync",
            });

            this.namespaceSelect = new OO.ui.CheckboxMultiselectWidget({
                items: [
                    new OO.ui.CheckboxMultioptionWidget({ data: 0, label: NS[0], selected: true }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 1, label: NS[1] }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 4, label: NS[4] }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 5, label: NS[5] }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 8, label: NS[8], selected: true }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 10, label: NS[10], selected: true }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 12, label: NS[12] }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 14, label: NS[14], selected: true }),
                    new OO.ui.CheckboxMultioptionWidget({ data: 828, label: NS[828], selected: true }),
                ],
            });
            const namespaceFiled = new OO.ui.FieldLayout(this.namespaceSelect, {
                label: "名字空间",
                id: "ps-namespace",
            });

            const $lastSync = $('<div id="lastSync"></div>');
            $lastSync.append(`<div>上次同步由<u>${LastSyncInfo.user}</u>于<u>${new Date(LastSyncInfo.time).toLocaleString()} (CST)</u>进行，共同步<u>${LastSyncInfo.pagecount}</u>个页面。</div>`);
            $lastSync.append(`<div>同步的名字空间：<u>${LastSyncInfo.namespace.join("、")}</u>。</div>`);

            this.panelLayout.$element.append(
                $("<div><b>警告</b>：本工具会向服务器发送大量请求，请勿频繁执行！<br>强烈建议在操作前给予自己机器人用户组，以免刷屏最近更改。</div>"),
                namespaceFiled.$element,
                $lastSync,
            );
            this.$body.append(this.panelLayout.$element);
        }

        waitInterval(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        // 根据选项生成名字空间列表
        get namespaceList() {
            const nslist = [];
            for (const item of this.namespaceSelect.findSelectedItems()) {
                nslist.push(item.getData());
            }
            return nslist;
        }

        // 根据名字空间获取页面列表
        async getList(apnamespace) {
            let apcontinue = 1;
            const pageList = [];
            while (apcontinue) {
                const apList = await UEWapi.get({
                    action: "query",
                    list: "allpages",
                    aplimit: "max",
                    apnamespace,
                    apcontinue,
                });
                for (const page of apList.query.allpages) {
                    pageList.push(page.title);
                }
                apcontinue = apList.continue ? apList.continue.apcontinue : false;
            }
            mw.notify(`获取【${NS[apnamespace]}】名字空间下的页面完毕。`);
            console.log(`【${NS[apnamespace]}】名字空间获取到如下页面：${pageList}`);
            return pageList;
        }

        // 获取页面源代码
        async getSource(title) {
            let source;
            let state = false;
            await UEWapi.get({
                action: "parse",
                format: "json",
                page: title,
                prop: "wikitext",
            }).then((result) => {
                source = result.parse.wikitext["*"];
                state = true;
            }, (err) => {
                mw.notify(`获取【${title}】源代码失败：${err}`, { type: "error" });
            });
            return { state: state, source: source };
        }

        // 提交编辑
        async submit(title, text) {
            const d = await api.postWithToken("csrf", {
                format: "json",
                action: "edit",
                watchlist: "nochange",
                tags: "Automation tool",
                bot: isBot ? true : false,
                title,
                text,
                summary: "【同步主站页面】",
            }).done(() => {
                console.log(`页面【${title}】同步完成。`);
            });
            if (d.error) {
                mw.notify(`页面【${title}】同步失败。`);
                return false;
            }
            return true;
        }

        // 在[[MediaWiki:Gadget-PageSync.log]]记录本次同步日志
        async record(time, pageCount, namespaces) {
            const d = await api.postWithToken("csrf", {
                format: "json",
                action: "edit",
                watchlist: "nochange",
                tags: "Automation tool",
                bot: isBot ? true : false,
                title: "MediaWiki:Gadget-PageSync.log",
                appendtext: `\n* ${new Date(time).toLocaleString()} - ${USERNAME} - ${pageCount} pages [${namespaces.join(", ")}]`,
            }).done(() => {
                console.log("记录同步日志成功。");
            });
            if (d.error) {
                console.error(`记录同步日志出现错误：${d.error}`);
                return false;
            }
            return true;
        }

        // 在[[MediaWiki:Gadget-PageSync.json]]记录本次同步信息
        async updateJson(namespaces, pagecount) {
            const info = {
                time: Date.now(),
                user: USERNAME,
                namespace: namespaces,
                pagecount: pagecount,
            };
            await api.postWithToken("csrf", {
                format: "json",
                action: "edit",
                watchlist: "nochange",
                title: "MediaWiki:Gadget-PageSync.json",
                text: JSON.stringify(info),
            }).done(() => {
                console.log("更新PageSync.json成功。");
            }).fail((err) => {
                mw.notify(`更新PageSync.json失败：${err}。`, { type: "error" });
            });
        }

        // 执行操作
        async syncAction(title) {
            await this.getSource(title).then((result) => {
                if (result.state) {
                    this.submit(title, result.source).then((r) => {
                        if (r) {
                            this.successCount++;
                        } else {
                            this.failList.push(title);
                        }
                    });
                } else {
                    this.failList.push(title);
                }
            });
        }

        // 执行函数
        getActionProcess(action) {
            if (action === "cancel") {
                return new OO.ui.Process(() => {
                    this.close({ action });
                }, this);
            } else if (action === "submit") {
                return new OO.ui.Process($.when((async () => {
                    this.successCount = 0;
                    this.failList = [];
                    const pagesList = [];
                    const startTime = Date.now();
                    for (const item of this.namespaceList) {
                        await this.getList(item).then((result) => {
                            pagesList.push(...result);
                        });
                    }
                    for (const item of pagesList) {
                        await this.syncAction(item);
                        await this.waitInterval(10000);
                    }
                    await this.record(startTime, this.successCount, this.namespaceList);
                    await this.updateJson(this.namespaceList, this.successCount);
                })()).promise(), this);
            }
            return super.getActionProcess(action);
        }
    }

    $(mw.util.addPortletLink("p-cactions", "#", "快速同步主站页面", "page-sync")).on("click", async () => {
        mw.notify("正在获取上次同步的信息……");
        const LastSync = await api.post({
            action: "query",
            titles: "MediaWiki:Gadget-PageSync.json",
            prop: "revisions",
            rvprop: "content",
            rvlimit: 1,
        }).done(() => {
            mw.notify("获取上次同步的信息成功");
        });
        LastSyncInfo = JSON.parse(Object.values(LastSync.query.pages)[0].revisions[0]["*"]);
        console.log(LastSyncInfo);

        const windowManager = new OO.ui.WindowManager({
            id: "mass-page-sync",
        });
        $body.append(windowManager.$element);
        const PSDialog = new PSWindow({
            size: "medium",
        });
        windowManager.addWindows([PSDialog]);
        windowManager.openWindow(PSDialog);
        $body.css("overflow", "auto");
    });
})());

// </pre>