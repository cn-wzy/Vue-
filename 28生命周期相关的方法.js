// 与生命周期相关的方法有四个，vm.$mount vm.$forceUpdate vm.$nextTick vm.$destory 
// 前两个是再lifecycleMixin中挂载到Vue原型上，$nextTick是再renderMixin挂载到Vue原型上的，$mount是在跨平台的代码中挂载到Vue原型上的
export function lifecycleMixin (Vue) {
    Vue.prototype.$forceUpdate = function (){}
    Vue.prototype.$destory = function (){}
}
export function renderMixin (Vue) {
    Vue.prototype.$nextTick = function (fn) {}
}

// vm.$mount手动挂载一个未挂载的实例

// vm.$forceUpdate：迫使Vue重新渲染，仅影响实例本身和插入插槽内容的子组件，而不是全部子组件
//原理：重新渲染就是实例watcher执行了update方法
Vue.prototype.$forceUpdate = function () {
    const vm: Component = this
    if (vm._watcher) {
        vm._watcher.update()
    }
}


// vm.$nextTick:将回调延迟到下次DOM更新循环后执行，在修改数据之后立即使用它
// Vue对DOM的更新策略：Vue更新DOM是异步执行的，只要侦听到数据变化，Vue将开启一个事件队列，缓冲同一事件在循环中的所有变更。
// 多次触发Watcher只会被推入队列一次，这种缓冲是去除重复数据对于避免不必要的计算和DOM操作十分重要。在下一个tick中才会更新

/*
JS运行机制：
1.所有同步任务都在主线程上执行，形成一个执行栈
2.主线程外还有一个任务队列。异步任务有运行结果，就在任务队列之中放置一个事件
3.一旦执行栈中的同步任务执行完毕，系统就会读取任务队列，。那些事件结束等待状态进入执行栈
4.不断重复上述三个步骤
宏任务与微任务：每执行完一个宏任务就要去清空该宏任务所对应的微任务
常见的宏任务：setTimeOut、MessageChannel、postMessage、setImmediate
微任务：MutationObsever、Promise.then
*/
// vm.$nextTick分为两部分：1.能力检测  2.根据能力检测以不同的方法执行回调队列
// 能力检测源码
let microTimerFunc
let macroTimerFunc
let useMacroTask = false
// 是否支持setImmediate
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    macroTimerFunc = () => {
        setImmediate(flushCallbacks)
    }
}
// 检测是否支持原生的 MessageChannel
else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushCallbacks
    macroTimerFunc = () => {
        port.postMessage(1)
    }
}
// 都不支持的情况下，使用setTimeout
else {
    macroTimerFunc = () => {
        setTimeout(flushCallbacks, 0)
    }
}
/* 对于微任务(micro task) */
// 检测浏览器是否原生支持 Promise
if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve()
    microTimerFunc = () => {
        p.then(flushCallbacks)
    }
}
// 不支持的话直接指向 macro task 的实现。
else {
    // fallback to macro
    microTimerFunc = macroTimerFunc
}

// 执行回调队列
const callbacks = []
let pending = false
function flushCallbacks () {
    pending = false
    // 防止出现nextTick中包含nextTick的清空，提前复制备份，并且清空回调函数
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
        copie[i]()
    }
}
export function nextTickk(cb ?:Function, ctn?: Object) {
    let _resolve
    callbacks.push(()=> {
        if (cb) {
            try {
                cb.call(ctx)
            } catch (e) {
                handleError(e, ctx, 'nextTick')
            }
        } else if (_resolve) {
            _resolve(ctx)
        }
    })
    if (!pending) {
        pending = true
        if (useMacroTask) {
            macroTimerFunc()
        }
        else {
            microTimerFunc()
        }
    }
    if (!cb&&typeof Promise !== 'undefined') {
        return new Promise(resolve = >{
            _resolve = resolve
        })
    }
}

//vm.$destory:完全销毁一个实例，清理与其他实例的连接，解绑全部指令和事件监听器