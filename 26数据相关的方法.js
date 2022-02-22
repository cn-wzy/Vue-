// 与数据相关的方法有三个，分别是$set,$delete,$watch,通过stateMixin挂载到原型上
export function stateMixin (Vue) {
    Vue.prototype.$set = set
    Vue.prototype.$delete = del
    Vue.prototype.$watch = function(expOrFn, cb, options) {}
}

// $watch源码
Vue.prototype.$watch = function (expOrFn, cb, options) {
    const vm: Component = this
    if(isPlainObject(cb)) {
        return createWatcher (vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const = watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
        cb.call(vm, watcher.value)
    }
    return function unwatchFn() {
        watcher.teardown()
    }
}

// createWatcher函数
function createWatcher (vm, expOnFn, handler, options) {
    if (isPlainObject(handler)) {
        options = handler
        handler = handler.handler
    }
    if(typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(expOnFn, handler, options)
}

// teardown是如何实现的
export default class Watcher {
    constructor (/*xxx*/) {
        // ...
    }
    // 把每个依赖全部删掉就好啦
    teardown() {
        let i = this.dep.length
        while(i--) {
            let i = this.deps.length
            while(i--) {
                this.deps[i].removeSub(this)
            }
        }
    }
    // 用get方法来读取被观察的数据。 ‘touch’每个属性，以便将他们作为深度监视的依赖项进行跟踪
    get() {
        if (this.deep) {
            traverse(value)
        }
        return value
    }
}

// traverse的实现
const seenObjects = new Set()
export function traverse (val: any) {
    _traverse(val, seenObjects)
    seenObjects.clear()
}
function _traverse(val: any, seen: SimpleSet) {
    let i, keys
    const isA = Array.isArray(val)
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
        return
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.id
        if(seen.has(depId)) {
            return
        }
        seen.add(depId)
    }
    if(isA) {
        i = val.length
        while(i--) _traverse(val[i], seen)
    } else {
        keys = Object.keys(val)
        i = keys.length
        while(i--) _traverse(val[keys[i]],seen)
    }
}



// vm.$set
export function set (target, key, val) {
    if (ProcessingInstruction.env.NODE_ENV !== 'production' && (isUndef(target) || isPrimitive(target))) {
        warn('xxx',)
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key)
        // splice已经被我们的拦截器重写了，每次使用这个添加数组元素都会变成响应式的
        target.splice(key, 1, val)
        return val
    }
    if (key in target && !(key in Object.prototype)) {
        target[key] = val
        return val
    }
    const ob = (target: any).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn('xxx')
        return
    }
    if (!ob) {
        target[key] = val
        return val
    }
    defineReactive(ob.value, key, val)
    ob.dep.notify()
    return val
}


// vm.$delete
export function del (target, key) {
    if (process.env.NODE_ENV !== 'production' &&(isUndef(target) || isPrimitive(target))) {
        warn('xxx',)
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
        target(key, 1)
        return
    }
    const ob = (target: any).__ob__
    if (target._isVue || (ob && ob.vmCount)) {
        process.env.NODE_ENV !== 'production' && warn('xxx')
        return
    }
    if (!hasOwn(target, key)) {
        return
    }
    delete target[key]
    if (!ob) {
        return
    }
    ob.dep.notify()
}