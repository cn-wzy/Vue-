// 创建节点，先判断属于哪个节点，调用不同方法并且创建插入到DOM中

function createElm(vnode, parentElm, refElm) {
  const data = vnode.data;
  const children = vnode.children;
  const tag = vnode.tag;
  if (isDef(tag)) {
    vnode.elm = nodeOps.createElement(tag, vnode); // 创建元素节点
    createChildren(vnode, children, insertedVnodeQueue); // 创建元素节点的子节点
    insert(parentElm, vnode.elm, refElm); //插入到DOM中
  } else if (isTrue(vnode.isComment)) {
    (vnode.elm = nodeOps), createComment(vnode.text);
    insert(parentElm, vnode.elm, refElm);
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text); // 创建文本节点
    insert(parentElm, vnode.elm, refElm);
  }
}

// 删除节点， 只需要在删除节点的父元素上调用removeChild方法即可

function removeNode(el) {
  const parent = nodeOps.parentNode(el);
  if (isDef(parent)) {
    nodeOps.removeChild(parent, el);
  }
}

// 更新节点
function patchVNode(oldValue, vnode, insertedVnodeQueue, removeOnly) {
  if (oldValue === vnode) {
    return;
  }
  const elm = (vnode.elm = oldValue.elm);
  if (
    isTrue(vnode.isStatic) &&
    isTrue(oldValue.isStatic) &&
    vnode.key === oldValue.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    return;
  }
  const oldCh = oldValue.children;
  const ch = vnode.children;
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
    }
    else if(isDef(ch)) {
        if (isDef(oldValue.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    }
    else if(isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    else if (isDef(oldValue.text)) {
        nodeOps.setTextContent(elm, '')
    }
  }
  else if(oldValue.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
  }
}
