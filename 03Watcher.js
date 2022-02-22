// 谁用到了数据，谁就是依赖，我们就为谁创建一个Watcher实例，之后的数据变化的时候，
// 我们不去直接通知依赖更新，而是通知依赖对应的Watch实例，由Watch实例去通知真正的视图
export default class Watcher {
    constructor (vm, expOrfn, cb) {
        this.vm = vm
        this.cb = cb
        this.getters = parsePath(expOrfn)
        this.value = this.getters()
    }
    get() {
        window.target = this
        const vm = this.vm
        let value = this.getter.call(vm, vm)
        window.target = undefined
        return value
    }
    update() {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}
// 解析一个简单的路径
// 把一个形如“data.b.c”的字符串路径所表示的值，从真实的data对象中取出来
// 例如：
//  * data = {a:{b:{c:2}}}
//  * parsePath('a.b.c')(data)  // 2
const bailRE = /[^\w.$]/
export function parsePath (path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function(obj) {
        for(let i =0; i < segments.length; i++){
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}