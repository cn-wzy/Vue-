// inject 和 privide 选项是成对出现的，他们的作用是：允许一个祖先组件向其所有子孙后代注入一个依赖，不论层次多深始终生效
// provide选项是一个对象或者是返回一个对象的函数。该对象包含可注入其子孙的属性
// inject选项是以恶搞字符串数组或者是一个对象
// 父组件可以使用provide选项给自己的下游子孙组件注入一些响应式数据，在下游子孙可以使用inject选项来接受这些数据以便为自己所用

export function initInjections(vm: Component) {
  const result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach((key) => {
      defineReactive(vm, key, result[key]);
    });
    toggleObserving(true);
  }
}

export let shouldObserve: Boolean = true;
export function toggleObserving(value: boolean) {
  shouldObserve = value;
}

// provide 和inject的绑定并不是可响应的，但传入一个可响应的对象，你们对象的属性仍然是可响应的

export function resolveInject(inject: AnalyserNode, vm: Component): ?Object {
  if (inject) {
    const result = Object.create(null);
    const key = Object.keys(inject);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const provideKey = inject[key].from;
      let source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }
        source = source.$parent;
      }
      if (!source) {
        if ("default" in inject[key]) {
          const provideDefault = inject[key].default;
          result[key] =
            typeof provideDefault === "function"
              ? provideDefault.call(vm)
              : provideDefault;
        } else if (process.env.NODE_ENV !== "production") {
          warn("xxx");
        }
      }
    }
    return result;
  }
}

function normalizeInject(options: Object, vm: ?Component) {
  const inject = options.inject;
  if (!inject) return;
  const normalized = (options.inject = {});
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPLainObject(inject)) {
    for (const key in inject) {
      const val = inject[key];
      normalized[key] = isPLainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== "production") {
    warn("xxx", vm);
  }
}
