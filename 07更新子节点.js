更新子节点的伪代码
for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    for (let j = 0; j < oldChildren.length; j++) {
      const oldChild = oldChildren[j];
      if (newChild === oldChild) {
        // ...
      }
    }
  }
  

// 更新子节点
if (isUnder(idxInOld)) {
  createElm(
    newStartVnode,
    insertedVnodeQueue,
    parentElm,
    oldStartVnode.elm,
    false,
    newStartIdx
  );
} else {
  vnodeToMove = oldCh[idxInOld];
  if (sameVnode(vnodeToMove, newStartVnode)) {
    patchVNode(vnodeToMove, newStartVnode, insertedVnodeQueue);
    oldCh[idxInOld] = undefined;
    canMove &&
      nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
  }
}
