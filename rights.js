$(function () {
    var groups = {
        bureaucrat: {list: [], class: "markrights-bureaucrat"},
        suppress: {list: [], class: "markrights-suppress"},
        sysop: {list: [], class: "markrights-sysop"},
        'interface-admin': {list: [], class: "markrights-interface-admin"},
        patroller: {list: [], class: "markrights-patroller"},
        confirmed: {list: [], class: "markrights-confirmed"},
        autoconfirmed: {list: [], class: "markrights-autoconfirmed"},
        bot: {list: [], class: "markrights-bot"},
    };
    var markUG = function () {
        var $users = $('a.mw-userlink:not(.mw-anonuserlink)');
        var users = {};
        $users.each(function (index, link) {
            users[link.textContent] = true;
        });

        var queue1 = [];
        var queue2 = [];
        var i = 0, n = 0;
        for (var user in users) {
            queue1.push(user);
            i++;
            if (i === 50) {
                queue2.push(queue1);
                queue1 = [];
                n++;
                i = 0;
            }
        }
        if (queue1.length > 0) {
            queue2.push(queue1);
            n++;
        }

        var getUsername = function (url) {
            var username = mw.util.getParamValue('title', url);
            var decode1 = function (username) {
                return decodeURIComponent((function (u) {
                    try {
                        return decodeURIComponent(u.replace('%E7%94%A8%E6%88%B7:', '').replace(/_/g, ' '));
                    } catch (e) {
                        return u.replace('%E7%94%A8%E6%88%B7:', '').replace(/_/g, ' ').replace(/%(?!\d+)/g, '%25');
                    }
                })(username))
            };
            if (username) {
                return decode1(username);
            }
            username = url.match(/%E7%94%A8%E6%88%B7:(.+?)$/);
            var decode2 = function (username) {
                return decodeURIComponent((function (u) {
                    try {
                        return decodeURIComponent(u.replace(/_/g, ' '));
                    } catch (e) {
                        return u.replace(/_/g, ' ').replace(/%(?!\d+)/g, '%25');
                    }
                })(username))
            };
            if (username) {
                return decode2(username[1]);
            }
            return null;
        };

        var done = function () {
            var group;
            $('a.mw-userlink:not(.mw-anonuserlink)').each(function (i, el) {
                var username = getUsername($(el).attr('href'));
                if (username) {
                    for (group in groups) {
                        if (groups.hasOwnProperty(group)) {
                            if (groups[group].list.indexOf(username) > -1) {
                                $(el).append('<sup class="' + groups[group].class + '"></sup>');
                            }
                        }
                    }
                }
            });
        };

        var process = function (data) {
            var users, group;
            if (data.query && data.query.users) {
                users = data.query.users;
            } else {
                users = [];
            }
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.groups) {
                    for (group in groups) {
                        if (groups.hasOwnProperty(group) && user.groups.indexOf(group) > -1) {
                            groups[group].list.push(user.name);
                        }
                    }
                }
            }
            n--;
            if (n <= 0) {
                done();
            }
        };
        var api = new mw.Api();
        for (var j = 0; j < queue2.length; j++) {
            api.get({
                format: 'json',
                action: 'query',
                list: 'users',
                usprop: 'groups',
                ususers: queue2[j].join('|')
            }).done(process);
        }
    };
    mw.hook('wikipage.content').add(function(e) {
        if (e.attr('id') === 'mw-content-text') {
            markUG();
            return;
        }
        if (e.hasClass('mw-changeslist')) markUG();
    });
});