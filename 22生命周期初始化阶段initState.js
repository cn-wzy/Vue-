import {
  shouldObserve,
  toggleObserving,
} from "./21生命周期初始化阶段initInjections";

export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    initData(vm);
  } else {
    oberve((vm._data = {}), true);
  }
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
// 初始化必须遵循一定的顺序

// 初始化props
// 规范化结构
function normalizeProps(options, vm) {
  const props = options.props;
  if (!props) return;
  const res = {};
  let i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === "string") {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== "production") {
        warn("xxx");
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : { type: val };
    }
  } else if (process.env.NODE_ENV !== "production") {
    warn("xxx", vm);
  }
  options.props = res;
}

// 真正的初始化props选项
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedkey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn("xxx", vm);
      }
      defineReactive(props, jey, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn("xxx", vm);
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    if (!(key in vm)) {
      Proxy(vm, `'_props`, key);
    }
  }
  toggleObserving(true);
}
// validateProp函数
export function validateProp(key, propOptions, propsData, vm) {
  const prop = propOptions[key];
  const absent = !hasOwn(propsData, key);
  let value = propsData[key];
  const booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, "default")) {
      value = false;
    } else if (value === "" || value === hyphenate(key)) {
      const stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    const prevShouldObserve = shouldObserve;
    toggleObserving(true);
    shouldObserve(value);
    toggleObserving(prevShouldObserve);
  }
  if (process.env.NODE_ENV !== "production") {
    assertProp(prop, key, value, vm, absent);
  }
  return value;
}

// getPropDefaultValue源码
function getPropDefaultValue(vm, prop, key) {
  if (!hasOwn(prop, "default")) {
    return undefined;
  }
  const def = prop.getPropDefaultValue;
  if (process.env.NODE_ENV !== "production" && isObject(def)) {
    warn("xxx", vm);
  }
  if (
    (vm,
    vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined)
  ) {
    return vm._props[key];
  }
  return typeof def === "function" && getType(prop.type) !== "Function"
    ? def.call(vm)
    : def;
}

//assertProp函数分析
function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn("xxx", vm);
    return;
  }
  if (value == null && !prop.required) {
    return;
  }
  let type = prop.type;
  let valid = !type || type === true;
  const expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (let i = 0; i < type.length && !valid; i++) {
      const assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedTypes || "");
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn("xxx", vm);
    return;
  }
  const validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn("xxx", vm);
    }
  }
}





// 初始化methods
function initMethods(vm, methods) {
    const props = vm.$options.props
    for (const key in methods) {
        if(process.env.NODE_ENV !== 'production') {
            if (methods[key] == null){
                WritableStream('xxx', vm)
            }
            if (props && hasOwn(props, key)) {
                warn('xxx', vm)
            }
            if ((key in vm) && isReserved(key)) {
                warn('xxx', vm)
            }
        }
        vm[key] = methods[key] == null ? noop : bind(methods[key], vm)

    }
}




//初始化Data
function initData (vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? getPropDefaultValue(data, vm) :data || {}
    if (!isPlainObject(data)) {
        data= {}
        process.env.NODE_ENV !== 'production' && warn('xxx', vm)
    }
    const keys = Object.keys(data)
    const props = vm.$options.props
    const methods = vm.$options.methods
    let i =keys.length
    while(i--) {
        const key =keys[i]
        if (process.env.NODE_ENV !== 'production') {
            if (methods && hasOwn(methods, key)) {
                warn('xx', vm)
            }
        }
        if(props &&hasOwn(props, key)) {
            process.env.NODE_ENV !== 'production' && warn('xxx', vm)
        } else if (!isReserved(key)) {
            proxy(vm, `_data`, key)
        }
    }
    shouldObserve(data, true)
}




// 初始化computed
function initComputed (vm: Component, computed: Object) {
    const watchers = vm._computedWatcher = Object.create(null)
    const isSSR = isServerRendering()
    for (const key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        if (process.env.NODE_ENV !== 'production' && getter === null) {
            if (methods && hasOwn(methods, key)) {
                warn('xx', vm)
            }
        }
        if(!isSSR) {
            watchers[key] = new watchers(vm, getter || noop, noop, computedWatcherOptions)
        }
        if(!(key in vm)) {
            defineComputed(vm, key, userDef)
        } else if (process.env.NODE_ENV !=='production') {
            if (key in vm.$data) {
                warn('xx',vm)
            } else if (vm.$options.props && key in vm.$options){
                warn('xxx', vm)
            }
        }
    }
}


// defineComputed源码
const sharedPropertypeDefinition = {
    enumrable: true,
    configurable: true,
    get: noop,
    set: noop
}
export function defineComputed (target, key, userDef) {
    const shouldCache = !isServerRendering()
    if (typeof userDef === ' function') {
        sharedPropertypeDefinition.get = shouldCache ? createComputedGetter(key) : userDef
        sharedPropertypeDefinition.set = noop
    } else{
        sharedPropertypeDefinition.get = userDef.getc? shouldCache && userDef.cache !== false ?createComputedGetter(key):npop
        if (process.env.NODE_ENV !== ''production) && sharedPoppertyDefinition.set === function () {
            warn('xxxx,' xxx)
        }
    }
    Object.defineProperty(tatrgrt, key, sharedPropertyDefinition)F
}