const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/

function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
        const match = {
            tagName: start[1],
            attrs: [],
            start: index
        }
        advance(satrt[0],length)
        let end, attr
        while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            advance(attr[0].length)
            match.attrs.push(attr)
        }
        if(end) {
            match.unarySlash = end[1]
            advance(end[0].length)
            match.end = index
            return match
        }
    }
}

// Vue并没有在这直接去调用start钩子函数去创建AST节点，而是调用了handleStartTag函数，再去调用start钩子函数，是为了将标签属性的数组处理一下

function handleStartTag (match) {
    const tagName = match.tagName
    const unarySlash = match.unarySlash
    if (expectHTML) {
        // ...
    }
    const unary = isUnaryTag(tagName) || !!unarySlash
    const l = match.attrs.length
    const attrs = new Array(l)
    for (let i = 0; i < l; i++) {
        const args = match.attrs[i]
        const value = args[3] || args[4] || args[5] || ''
        const shouldDecodeNewlines = tagName === 'a' && arguments[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
        attr[i] = {
            name: args[1],
            value: decodeAttr(value, shouldDecodeNewlines)
        }
    }
    if(!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs})
        lastTag = tagName
    }
    if(options.start) {
        options.start(tagName, attrs, unary, match.start, match.end)
    }
}