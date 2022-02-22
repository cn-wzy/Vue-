// 依赖收集管理器，数据被哪个依赖都放入其中
export default class Dep {
    constructor() {
        this.subs = []
    }

    addSub (sub) {
        this.subs.push(sub)
    }

    removeSub (sub) {
        remove(this.subs, sub)
    }
    // 添加一个依赖
    depend() {
        if (window.target) {
            this.addSub(window.target)
        }
    }
    // 通知所有依赖更新
    notify() {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < 1; i++){
            subs[i].update()
        }
    }
}

export function remove(arr, item) {
    if(arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

// 更新使Obj变得可以监测.js中的defineReactive
function defineReactive (obj, key, val) {
    if (arguments.length === 2) {
        val = obj[key]
    }
    if(typeof val === 'object') {
        new Observer(val)
    }
    // 实例化一个依赖管理器，生成一个依赖管理数组dep
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get(){
            console.log(`${key}属性被读取了`);
            // 在getter中收集依赖
            dep.depend()
            return val;
        },
        set(newVal){
            if(val === newVal){
                return
            }
            console.log(`${key}属性被修改了`);
            val = newVal;
            // 在setter中通知依赖更新
            dep.notify()
        }
    })
}