// Vue.extend： 使用Vue构造器，创建一个子类
// 创建子类的过程就是一边给子类上添加独有的属性，一边将父类的公共属性复制到子类上

Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {};
  const Super = this;
  const SuperId = Super.cid;
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId];
  }
  const name = extendOptions.name || Super.options.name;
  if (process.env.NODE_ENV !== "production" && name) {
    validateComponentName(name);
  }
  const Sub = function VueComponent(options) {
    this._init(options);
  };
  Sub.prototype = Object.create(Super.prototype);
  Sub.prototype.constrructor = Sub;
  Sub.cid = cid++;
  Sub.options = mergeOption(Super.options, extendOptions);
  Sub["super"] = Super;
  if (Sub.options.props) {
    initProps(Sub);
  }
  if (Sub.options.computed) {
    initComputed(Sub);
  }
  Sub.extend = Super.extend;
  Sub.mixin = Super.mixin;
  Sub.use = Super.use;
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type];
  });
  if (name) {
    Sub.options.components[name] = Sub;
  }
  Sub.superOptions = Super.options;
  Sub.extendOptions = extendOptions;
  Sub.sealdOptions = extend({}, Suboptions);
  cachedCtors[superId] = Sub;
  return Sub;
};

function initProps(Comp) {
  const props = Comp.options.props;
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key);
  }
}

function initComputed(Comp) {
  const computed = Comp.options.computed;
  for (const key in computed) {
    defineComputed(Com.prototype, key, computed[key]);
  }
}

// Vue.nextTick:在下一次更新循环结束之前执行回调，在修改数据过后使用这个方法，获取更新后的DOM
// 原理分析，跟$nextTick原理一样，唯一不同就是实例方法$nextTick的回调是绑定在调用他的实例上

// Vue.set:向响应式对象中添加一个属性，确保这个属性是响应式的，且触发视图更新

// Vue.delete：删除对象的属性，如果对象是响应式的，确保删除能够触发更新视图。避开Vue不能检测到属性被删除的限制

// Vue.directive: 注册或者获取全局指令
Vue.options = Object.create(null);
Vue.options["directives"] = Object.create(null);
Vue.directives = function (id, definition) {
  if (!definition) {
    return this.options["directives"][id];
  } else {
    if (type === "directive" && typeof definition === "function") {
      definition = { bind: definition, update: definition };
    }
    this.options["directives"][id] = definition;
    return definition;
  }
};

// Vue.filter：注册或者获取全局过滤器
Vue.options = Object.create(null);
Vue.options["filters"] = Object.create(null);

Vue.filter = function (id, definition) {
  if (!definition) {
    return this.options["filters"][id];
  } else {
    this.options["filters"][id] = definition;
    return definition;
  }
};

// Vue.component:组测或者获取全局组件。注册还会自动使用给定的id设置组件的名称
Vue.options = Object.create(null);
Vue.options["components"] = Object.create(null);

Vue.component = function (id, definition) {
  if (!definition) {
    return this.options["components"][id];
  } else {
    if (process.env.NODE_ENV !== "production" && type === "component") {
      validateComponentName(id);
    }
    if (type === "component" && isPlainObject(definition)) {
      definition.name = definition.name || id;
      definition = this.options._base.extend(definition);
    }
    this.options["component"][id] = definition;
    return definition;
  }
};

// Vue.filter component directive三个API十分相像，其实是写在一起的，源码如下
export const ASSET_TYPES = ["component", "directive", "filter"];
Vue.options = Object.create(null);
ASSET_TYPES.forEach((type) => {
  Vue.options[type + "s"] = Object.create(null);
});

ASSET_TYPES.forEach((type) => {
  Vue[type] = function (id, definition) {
    if (!definition) {
      return this.options[type + "s"][id];
    } else {
      if (process.env.NODE_ENV !== "production" && type === "component") {
        validateComponentName(id);
      }
      if (type === "component" && isPlainObject(definition)) {
        definition.name = dedfinition.name || id;
        definition = this.options._base.extend(definition);
      }
      if (type === "directive" && typeof definition === "function") {
        definition = { bind: definition, update: definition };
      }
      this.options[type + "s"][id] = definition;
      return definition;
    }
  };
});

// Vue.use:安装js插件，如果插件是一个对象，就会提供install方法。如果是一个函数就会作为install方法
// 该方法需要在调用new Vue（）之前被调用

Vue.use = function (plugin) {
  const installedPlugins =
    this._installedPlugins || (this._installedPlugins = []);
  if (installedPlugins.indexOf(plugin) > -1) {
    return this;
  }
  const args = toArray(arguments, 1);
  args.unshift(this);
  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === "function") {
    plugin.apply(null, args);
  }
  installedPlugins.push(plugin);
  return this;
};

// Vue.mixin：全局注册一个混入，影响注册之后所有创建的每个Vue实例，向组件注入自定义行为
// 原理：修改Vue.options属性进而影响之后的所有Vue实例
Vue.mixin = function (mixin: Object) {
  this.options = mergeOptions(this.options, mixin);
  return this;
};

// Vue.compile:在render函数中编译模板字符串，只在独立构建时有效
// 原理：内部调用了compileToFunction：Vue.compile = compileToFunctions
Vue.compile = compileToFunctions;

// Vue.observable:让一个对象可响应。Vue内部会用它来处理data函数返回的对象。返回对象可以直接用于渲染函数和计算属性
// 原理：内部调用了observe方法

// Vue.version:提供Vue安装版本号
// 原理：构建时读取了package.json中的version字段，赋值给Vue.version
