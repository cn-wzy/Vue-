Vue.proptotype.$destroy = function () {
  const vm: Component = this;
  if (vm._isBeingDestroyed) {
    return;
  }
  callHook(vm, "beforeDestory");
  vm._isBeingDestroyed = true;
  // 删除自己从父节点
  const parent = vm.$parent;
  if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
    removeEventListener(parent.$children, vm);
  }
  if (vm._watcher) {
    vm._watcher.teardown();
  }
  let i = vm._watcher.length;
  while (i--) {
    vm._watcher[i].teardown();
  }
  if (vm._data.__ob__) {
    vm._data.__ob__.vmCount--;
  }
  vm._isDestroyed = true;
  vm.__patch__(vm._vnode, null);
  callHook(vm, "destroyed");
  vm.$off();
  if (vm.$el) {
    vm.$el.__vue__ = null;
  }
  if (vm.$vnode) {
    vm.$vnode.parent = null;
  }
};
