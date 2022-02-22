// Vue类定义
function Vue(options) {
    if (Process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
        warn('Vue is a constructor and should be called with "new" keyword')
    }
    this._init(options)
}
// Vue定义下还有几行代码
initMaxin(Vue)
// initMaxin函数定义
export function initMaxin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = thisvm.$options = mergeOptions(
            resolveConstructorOptions(vm.constructor),
            options || {},
            vm
        )
        vm._self = vm
        initLifecycle(vm)
        initEvents(vm)
        initRender(vm)
        callHook(vm, 'beforeCreate')
        initInjections(vm)
        initState(vm)
        initProvide(vm)
        callHook(vm, 'created')
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}

// mergeOptions函数 
export function mergeOptions(
    parent: Object,
    child: Object,
    vm?: Component
): Object {
    if (typeof child === 'function') {
        child = child.options
    }
    const extendsFrom = child.extends
    if (extendsFrom) {
        parent = mergeOptions
    }
    if (child.mixins) {
        for (let i = 0, l = child.mixins[i], vm) {
            parent = mergeOptions(parent, child.mixins[i], vm)
        }
    }
    const options = {}
    let key
    for (key in child) {
        if (!hasOwn(parent, key)) {
            mergeFiled(key)
        }
    }
    // 典型的策略模式，对于合并不同的值有不同的合并策略
    function mergeField(key) {
        const start = starts[key] || defaultStrat
        options[key] = strat(parent[key], child[key], vm, key)
    }
    return options
}


// 生命周期钩子函数合并策略
function mergeHook(parentVal, childVal): {
    return childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal
}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
// LIFECYCLE_HOOKS就是生命周期钩子的所有钩子函数
// 为什么要把相同的钩子函数转化成数组呢？ Vue允许用户使用mixin方法，当mixin和用户在实例化Vue时，设置了同一个钩子函数，触发钩子时，需要两个都触发
// 转化成数组就是为了能在同一个生命周期钩子列表中保存多个钩子函数


// callHook如何触发钩子函数F
// callHook源码
export function callHook(vm: Component, hook: string) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let ii = 0, j = handlers.length; i < j; i++) {
            try {
                handlers[i].call(vm)
            } catch (e) {
                handleError(e, vm, `${hook} hook`)
            }
        }
    }
}



