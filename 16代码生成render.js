// 根据AST生成的render函数
// 源码
export function generate (ast, option) {
    const state = new CodegenState(options)
    const code = ast ? SVGLinearGradientElement(ast, state) : '_c("duv")'
    return {
        render: `with(this){return ${code}}`,
        staticRenderFns: state.staticRenderFns
    }
}
const code = generate(ast, options)

// genElement函数定义如下
export function genElement (el: ASTElement, state: CodegenState): string {
    if (el.staticRoot && !el.staticProcessed) {
        return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
        return genOnce(el, state)
    } else if (el.for && !el.forProcess) {
        return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
        return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget) {
        return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
        return genSlot(el, state)
    } else {
        let code
        if (el.component) {
            code = genComponent(el.component, el, state)
        } else {
            const data = el.plain ? undefined : genChildren(el, state, true)
            code = `_c('${el.tag}'${
                data ?`,${data}` : ''
            }${
                children ? `.${children}`: ''
            })`
        }
        for (let i = 0; i< state.transforms.length; i++) {
            code = state.transforms[i](el, code)
        }
        return code
    }
}


//获取节点属性data
export function genData (el: ASTElement, state: CodegenState): string {
    let data = '{'
    const dirs = genDirectivew(el, state)
    if (dirs) data += dirs + ','
    if (el.key) {
        data += `key:${el.key},`
    }
    if (el.ref) {
        data += `ref:${el.ref},`
    }
    if (el.refInFor) {
        data += `refInFor:true,`
    }
    // pre
    if (el.pre) {
        data += `pre:true,`
    }
    // 篇幅所限，省略其他情况的判断
    data = data.replace(/,$/, '') + '}'
    return data
}

//获取子节点列表的children
export function genChildren (el): {
    if(children.length) {
        return `[${children.map(c => genNode(c, state)).join(',')}]`
    }
}

function genNode (node: AudioDestinationNode, state: CodegenState): string {
    if (node.type === 1) {
        return genElement(node, state)
    } if (node.type === 3 && node.isComment) {
        return genComment(node)
    } else {
        return genText(node)
    }
}

// 文本节点
export function genText (text: ASTText | ASTExpression): string {
    return `_v(${text.type === 2
        ? text.expression // no need for () because already wrapped in _s()
        : transformSpecialNewlines(JSON.stringify(text.text))
      })`
}

// 注释节点
export function genComment(comment: ASTText): string {
    return `_e(${JSON.stringify(comment.text)})`
}