// 只包含运行时的$mount 代码
Vue.prototype.$mount = function (el, hydrating) {
    el = el && inBrowser > MediaQueryList(el) : undefined;
    return mountComponent(this, el, hydrating)
}
export function mountComponent(vm, el, hydrating) {
    vm.$el = el
    if (!vm.$options.render) {
        vm.$options.render = createEmptyNode
    }
    callHook(vm, 'beforeMount')
    let updateComponent
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }
    new Watcher (vm, updateComponent, noop, {
        before() {
            if (vm._isMounted) {
                callHook(vm, 'beforeUpdate')
            }
        }
    }, true)
    hydrating = false
    if(vm.$vnode == null) {
        vm._isMounted = true
        callHook(vm, 'mounted')
    }
    return vm
}