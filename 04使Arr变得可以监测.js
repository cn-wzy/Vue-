import Dep from "./02依赖收集";

const arrayProto = Array.prototype;
// 创建一个对象作为拦截器
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

methodsToPatch.forEach(function (method) {
  // 缓存原生方法
  const original = arrayProto[method];
  Object.defineProperty(arrayMethods, methods, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function mutator(...args) {
      const result = original.apply(this, args);
      return result;
    },
  });
});

// 添加刚刚Observer部分Array没有的地方
export class Observer {
  constructor(value) {
    this.value = value;
    // 给value新增一个属性__ob__，为value的Observer实例
    // 相当于为value打上标记，表示已经是响应式的啦，避免重复操作
    this.dep = new Dep(); // 实例化一个依赖管理器，用来收集数组依赖
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      // 当value为数组时的逻辑
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrarKeys);
    } else {
      this.walk(value);
    }
  }
}
//判断__proto__是否可用
export const hasProto = "__proto__" in {};

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

function protoAugment(target, src: Object, keys: any) {
  target.__proto__ = src;
}

function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}

// 更新defineReactive在其中加入依赖更新的部分
function defineReactive(obj, key, val) {
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (childOb) {
        childOb.dep.depend();
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
      dep.notify(); // 在setter中通知依赖更新
    },
  });
}
为value创建一个实例;
export function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}

methodsToPatch.forEach(function (method) {
  // 缓存原生方法
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    ob.dep.notify();
    return result;
  });
});
// 深度监听
export class Observer {
  value: any;
  dep: Dep;
  constructor(value: any) {
    this.value = value;
    // 给value新增一个属性__ob__，为value的Observer实例
    // 相当于为value打上标记，表示已经是响应式的啦，避免重复操作
    this.dep = new Dep(); // 实例化一个依赖管理器，用来收集数组依赖
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      // 当value为数组时的逻辑
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrarKeys);
      //   将数组中的所有元素都转化为可被监视的响应式
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  observeArray(item: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

数组新增元素的监测;
methodsToPatch.forEach(function (method) {
  // 缓存原生方法
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args; // 如果是push或unshift方法，那么传入参数就是新增的元素
        break;
      case "splice":
        inserted = args.slice(2); // 如果是splice方法，那么传入参数列表中下标为2的就是新增的元素
        break;
    }
    if (inserted) ob.observeArray(inserted); // 调用observe函数将新增的元素转化成响应
    ob.dep.notify();
    return result;
  });
});
