
// Observer类可以通过递归的方式，把所有属性变成可观测对象
export class Observer {
    constructor (value) {
        this.value = value
        // 给value新增一个属性__ob__，为value的Observer实例
        // 相当于为value打上标记，表示已经是响应式的啦，避免重复操作
        def(value, '__ob__', this)
        if (Array.isArray(value)) {
            // 当value为数组时的逻辑
        }  else {
            this.walk(value)
        }
    }

    walk (obj: Object) {
        const keys = Object.keys(obj)
        for (let i = 0; i < key.length; i++){
            defineReactive(obj, keys[i])
        }
    }
}

// 是一个对象转化为可观测对象
function defineReactive (obj, key, val) {
    if (arguments.length === 2) {
        val = obj[key]
    }
    if(typeof val === 'object') {
        new Observer(val)
    }
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get(){
            console.log(`${key}属性被读取了`);
            return val;
        },
        set(newVal){
            if(val === newVal){
                return
            }
            console.log(`${key}属性被修改了`);
            val = newVal;
        }
    })
}