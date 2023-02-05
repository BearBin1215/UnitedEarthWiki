local getArgs = require('Module:Arguments').getArgs
local p = {}

function p.box(frame)
    local args = getArgs(frame)
    return p._box(args, frame)
end

function p._box(args, frame)
    local navbox = mw.html.create('table') --外层

    navbox
        :addClass('navbox')
        :tag('tr')
        :tag('th')
        :addClass('navbox-name')
        :attr('colspan', '2')
        :wikitext(args['name'])

    local i = 1
    while args['title' .. i] do
        navbox
            :tag('tr')
            :tag('th')
            :addClass('navbox-title')
            :wikitext(args['title' .. i])
            :done()
            :tag('td')
            :wikitext(args['content' .. i])

        i = i + 1
    end

    if args['bottom'] then
        navbox
            :tag('tr')
            :tag('td')
            :attr('colspan', '2')
            :addClass('navbox-bottom')
            :wikitext(args['bottom'])
    end

    return navbox
end

return p