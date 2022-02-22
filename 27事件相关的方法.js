// 事件相关的方法一共有四个分别是 vm.$on, vm.$emit, vm.$off, vm.$once，通过eventsMixin挂载到原型上
export function eventsMixin(Vue) {
  Vue.prototype.$on = function (event, fn) {};
  Vue.prototype.$once = function (event, fn) {};
  Vue.prototype.$off = function (event, fn) {};
  Vue.prototype.$emit = function (event) {};
}

// vm.$on监听实例上的自定义事件，由vm.$emit触发。
vm.$on("test", function (msg) {
  console.log(msg);
});
vm.$emit("test", "hi");
Vue.proptotype.$on = function (event, fn) {
  const vm: Component = this;
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$on(event[i], fn);
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn);
  }
  return vm;
};

// vm.$emit：触发当前实例上的事件，附加参数都会传给监听器回调
Vue.prototype.$emit = function (event: string): Component {
  const vm: Component = this;
  let cbs = vm._events[event];
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs;
    const args = toArray(arguments, 1);
    for (let i = 0, l = cbs.length; i < l; i++) {
      try {
        cbs[i].apply(vm, args);
      } catch (e) {
        handleError(e, vm, `xxx`);
      }
    }
  }
  return vm;
};

// vm.$off：移除自定义的事件监听器
Vue.proptotype.$off = function (event, fn) {
  const vm: Component = this;
  if (!arguments.length) {
    vm._events = Object.create(null);
    return vm;
  }
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$off(event[i], fn);
    }
    return vm;
  }
  const cbs = vm._events[event];
  if (!cbs) {
    return vm;
  }
  if (!fn) {
    vm._events[event] = null;
    return vm;
  }
  if (fn) {
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }
  }
  return vm;
};

// vm.$once:监听一个事件，但只触发一次，一旦触发监听器移除
Vue.proptotype.$once = function (event, fn) {
  const vm: Component = this;
  function on() {
    vm.$off(event, on);
    fn.apply(vm, arguments);
  }
  on.fn = fn;
  vm.$on(event, on);
  return vm;
};
