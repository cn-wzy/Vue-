export function parse(template, options) {
    parseHTML(template, {
        warn,
        expectHTML: options.expectHTML,
        isUnaryTag: options.isUnaryTag,
        canBeLeftOpenTag: options.canBeLeftOpenTag,
        shouldDecodeNewlines: options.shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
        shouldKeepComment: options.comments,
        start (tag, attrs, unary) {
            let element = createASTElement(ta, attrs,currentParent)
        },
        end() {

        },
        chars(text: string) {
            if(text是带变量的动态文本) {
                let element = {
                    type: 2,
                    expression: res.expression,
                    tokens: res.tokens,
                    text
                }
            } else {
                let element = {
                    type: 3,
                    text
                }
            }
        },
        comment (text: string) {
            let element = {
                type: 3,
                text,
                isComment: true
            }
        }
    })
    return root
} 
// 开始标签
export function createASTElement(tag, attrs, parent) {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent,
        children: []
    }
}
// 解析HTML注释
const comment = /^<!--/
if (comment.test(html)) {
    const commentEnd = html.indexOf('-->')
    if(commentEnd >= 0) {
        if(options.shouldKeepComment) {
            options.comment(html.substring(4, commentEnd))
        }
        advance(commentEnd + 3)
        continue
    }
}
// 移动光标，防止重复解析游标
function advance (n) {
    index += n
    html = html.substring(n)
}
// 解析条件注释
const conditionalComment = /^<!\[/
if (conditionalComment.test(html)) {
    const conditionalEnd = html.indexOf(']>')
    if (conditionalEnd >= 0) {
        advance(conditionalEnd + 2)
        continue
    }
}
// 解析DOCTYPE
const doctype = /^<!DOCTYPE [^>]+>/i
const doctypeMatch = html.match(doctype)
if(doctypeMatch) {
    advance(doctypeMatch[0].length)
    continue
}

// 解析开始标签
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const start = html.match(startTagOpen)
if(start) {
    const match = {
        tagName: start[1],
        attr: [],
        start: index
    }
}
// 解析标签属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const match = {
    tagName: start[1],
    attrs: [],
    start: index
}
while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
    advance(attr[0].length)
    match.attrs.push(attr)
}
let end = html.match(startTagClose)
if (end) {
    match.unarySlash = end[1]
    advance(end[0].length)
    match.end = index
    return match
}
