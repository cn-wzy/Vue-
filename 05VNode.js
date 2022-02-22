// 一个VNode类，通过此类实例化出不同类型的虚拟DOM
export default class VNode {
    constructor (
        tag?: string,
        data?: VNodeData,
        children?: ?Array<VNode>,
        text?: string,
        elm?: Node,
        context?: Component,
        componentOptions?: VNodeComponentOptions,
        asyncFactory?: Function
    ){
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm       /*当前虚拟节点对应的真实dom节点*/
        this.ns = undefined            /*当前节点的名字空间*/
        this.context = context          /*当前组件节点对应的Vue实例*/
        this.fnContext = undefined       /*函数式组件对应的Vue实例*/
        this.fnOptions = undefined
        this.fnScopeId = undefined
        this.key = data && data.key           /*节点的key属性，被当作节点的标志，用以优化*/
        this.componentOptions = componentOptions   /*组件的option选项*/
        this.componentInstance = undefined       /*当前节点对应的组件的实例*/
        this.parent = undefined           /*当前节点的父节点*/
        this.raw = false         /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
        this.isStatic = false         /*静态节点标志*/
        this.isRootInsert = true      /*是否作为跟节点插入*/
        this.isComment = false             /*是否为注释节点*/
        this.isCloned = false           /*是否为克隆节点*/
        this.isOnce = false                /*是否有v-once指令*/
        this.asyncFactory = asyncFactory
        this.asyncMeta = undefined
        this.isAsyncPlaceholder = false
    }

    get child(): Component | void {
        return this.componentInstance
    }
}

// 注释节点
export const createEmptyVNode = (text: string = '') => {
    const node = new VNode()
    node.text = text // 具体的注释信息
    node.isComment = true //标识是否为注释节点
    return node
}

// 文本节点 只有一个text属性，用来表示具体的文本信息
export function createTextVNode (val: string | number) {
    return new VNode(undefined, undefined, undefined, String(val))
}

// 克隆节点 与现有节点唯一不同就是isCloned是true
export function cloneVNode (vnode: VNode): VNode {
    const cloned = new VNode(
        vnode.tag,
        vnode.data,
        vnode.children,
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions,
        vnode.asyncFactory
    )
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    cloned.isComment = vnode.isComment
    cloned.fnContext = vnode.fnContext
    cloned.fnOptions = vnode.fnOptions
    cloned.fnScopeId = vnode.fnScopeId
    cloned.asyncMeta = vnode.asyncMeta
    cloned.isCloned = true
    return cloned
}

// 元素节点 含有描述节点的tag属性，描述节点属性的class和attributes等data属性，有描述子节点的children属性

// 组件节点，除了元素节点的属性之外还含有componentOptions，如组件的props，componentInstance，当前组件的Vue实例等属性

