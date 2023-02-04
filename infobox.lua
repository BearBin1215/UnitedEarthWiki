local getArgs = require('Module:Arguments').getArgs
local p = {}

function p.main(frame)
	local args = getArgs(frame)
	return p._main(args, frame)
end

function p._main(args, frame)
    local infobox = mw.html.create('table'):attr('id', 'infobox') --外层

    if args['image'] then
        infobox
            :tag('tr')
            :tag('td')
            :attr('colspan', '2')
            :wikitext('<html><img src="' .. args['image'] .. '"/></html>')
    end

    for k, v in ipairs(args) do --根据输入添加表项
        if k ~= 'image' then
            infobox
                :tag('tr')
                :tag('td')
                :wikitext(k)
                :done()
                :tag('td')
                :wikitext(v)
        end
    end

    return infobox
end

return p