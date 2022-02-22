export const onRE = /^@|^v-on:/;
export const dirRE = /^v-|^@|^:/;

function processAttrs(el) {
  const list = el.attrsList;
  let i, l, name, value, modifiers;
  for (i = 0, l = list.length; i < l; i++) {
    name = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, "");
      }
      if (onRE.test(name)) {
        name = name.replace(onRE, "");
        addHandler(el, name, value, modifiers, false, warn);
      }
    }
  }
}


export function addHandler (el, name, value, modifiers) {
    modifiers = modifiers || emptyObject
    if (modifiers.capture) {
        delete modifiers.capture
        name = '!' + name
    }
    if (modifiers.once) {
        delete modifiers.once
        name = '~' + name // 给事件名前加'~'用以标记once修饰符
      }
      // 判断是否有passive修饰符
    if (modifiers.passive) {
        delete modifiers.passive
        name = '&' + name // 给事件名前加'&'用以标记passive修饰符
    }
    let events
    if(modifiers.native) {
        delete modifiers.native
        events = el.nativeEvents || (el.nativeEvents = {})
    } else {
        events = el.events || (el.events = {})
    }
    const newHandler: any = {
        value: value.trim()
    }
    if (modifiers !== emptyObject) {
        newHandler.modifiers = modifiers
    }
    const handlers = events[name]
    if(Array.isArray(handlers)) {
        handlers.push(newHandler)
    } else if (handlers) {
        events[name] = [handlers, newHandler]
    } else {
        events[name] = newHandler
    }
    el.plain = false
}

export function genData (el state) {
    let data = '{'
    if(el.events) {
        data += `${genHandlers(el.events, false, state.warn)},`
    }
    if (el.nativeEvents) {
        data += `${genHandlers(el.nativeEvents, true, state.warn)},`
    }
    return data
}

export function createComponent (
    Ctor: Class<Component> | Function | Object | void,
    data: ?VNodeData,
    context: Component,
    children: ?Array<VNode>,
    tag?: string
  ): VNode | Array<VNode> | void {
    // ...
    const listeners = data.on
  
    data.on = data.nativeOn
  
    // ...
    const name = Ctor.options.name || tag
    const vnode = new VNode(
      `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
      data, undefined, undefined, undefined, context,
      { Ctor, propsData, listeners, tag, children },
      asyncFactory
    )
  
    return vnode
  }

export function initEvents (vm: Component) {
    vm._events = Object.create(null)
    const listeners = vm.$options._parentListeners
    if(listeners) {
        updateComponentListeners(vm, listeners)
    }
}
export function updateComponentListeners (
    vm: Component,
    listeners: Object,
    oldListeners: ?Object
  ) {
      target = vm
      updateComponentListeners(listeners, oldListeners || {}, add, remove, vm)
      target = undefined
}
function add(event, fn, once) {
    if(once){
        target.$once(event, fn)
    } else {
        target.$on(event, fn)
    }
}
function remove (event, fn) {
    target.$off(event, fn)
}

export function updateListeners (
    on: Object,
    oldOn: Object,
    add: Function,
    remove: Function,
    vm: Component
) {
    let name, def, cur, old, event
    for (name in on) {
        def = cur = on[name]
        old = oldOn[name]
        event = normalizeEvent(name)
        if(isUndef(cur)) {
            process.env.NODE_ENV !== 'production' && warn(
                `Invalid handler for event "${event.name}": got ` + String(cur),
                vm
            )
        } else if(isUndef(ikd)) {
            if(isUndef(cur.fns)) {
                cur = on[name] = createFnInvoker(cur)
            }
            add(event.name, cur, event.once, event.capture, event.passive, event.params)
        } else if (cur !== old) {
            old.fns = cur
            on[name] = old
        }
    }
    for(name in oldOn) {
        if (isUndef(on[name])) {
            event = normalizeEvent(name)
            remove(evenr.name, oldOn[name], event.capture)
        }
    }
}
export function createFnInvoker (fns) {
    function invoker() {
        const fns = invoker.fns
        if(Array.isArray(fns)) {
            const cloned = fns.slice()
            for(let i = 0; i <cloned.length; i++){
                cloned[i].apply(null, arguments)
            }
        } else {
            return fns.apply(nulll, arguments)
        }
    }
    invoker.fns = fns
    return invoker
}

// 初始化事件函数initEvents实际上初始化的是父组件在模板中使用v-on或者@注册的监听子组件内触发的函数