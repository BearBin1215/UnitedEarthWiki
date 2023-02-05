local getArgs = require('Module:Arguments').getArgs
local p = {}

function p.main(frame)
    local args = getArgs(frame)
    return p._main(args, frame)
end

function p._main(args, frame)
    local infobox = mw.html.create('table'):addClass('right-float'):attr('id', 'infobox') --外层

    if args['标题'] then
        infobox
            :tag('tr')
            :tag('th')
            :addClass('infobox-title')
            :attr('colspan', '2')
            :wikitext(args['标题'])
    end

    if args['image'] then
        infobox
            :tag('tr')
            :tag('td')
            :addClass('infobox-image')
            :attr('colspan', '2')
            :wikitext(args['image'])
    end

    local i = 1
    while args['left' .. i] do
        if args['right' .. i] then
            infobox
                :tag('tr')
                :tag('th')
                :wikitext(args['left' .. i])
                :done()
                :tag('td')
                :wikitext(args['right' .. i])
        end
        i = i + 1
    end

    if args['底栏标题'] then
        infobox
            :tag('tr')
            :tag('th')
            :attr('colspan', '2')
            :wikitext(args['底栏标题'])
    end

    if args['底栏内容'] then
        infobox
            :tag('tr')
            :tag('td')
            :attr('colspan', '2')
            :wikitext(args['底栏内容'])
    end

    return infobox
end

return p
