// Vue.directive

import { resolveAsset } from "./30过滤器filters";

// updateDirectives函数源码
function updateDirectives(oldValue, vnode) {
  if (oldValue.data.directives || vnode.data.directives) {
    _update(oldValue, vnode);
  }
}
// _update方法源码
function _update(oldValue, vnode) {
  const isCreate = (oldValue = emptyNode);
  const isDestroy = (vnode = emptyNode);
  const oldDirs = normalizeDirectives(
    oldVnode.data.directives,
    oldVnode.context
  );
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
  const dirWithInsert = [];
  const dirsWithPostpatch = [];
  let key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      callHook(dir, "bind", vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirWithInsert.push(dir);
      }
    } else {
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook(dir, "bind", vnode, oldValue);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }
  if (dirWithInsert.length) {
    const callInsert = () => {
      for (let i = 0; i < dirWithInsert.length; i++) {
        callHook(dirsWithPostpatch[i], "inserted", vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, "insert", callInsert);
    } else {
      callInsert();
    }
  }
  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, "postpatch", () => {
      for (let i = 0; i < dirsWithPostpatch.length; i++) {
        callHook(dirsWithPostpatch[i], "componentUpdated", vnode, oldVnode);
      }
    });
  }
  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        callHook(oldDirs[key], "unbind", oldValue, oldValue, isDestroy);
      }
    }
  }
}

// normalizeDirectives 模板中使用到的指令从存放指令的地方取出来，并将其格式化
function normalizeDirectives(dirs, vm) {
  const res = Object.create(null);
  if (!dirs) {
    return res;
  }
  let i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, "directives", dir.name, true);
  }
  return res;
}
