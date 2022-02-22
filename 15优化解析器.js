// 优化阶段就干了两件事：
// 1.在AST中找出所有静态节点并且打上标记
// 2.在AST中找出所有静态根节点，并且打上标记

// 源码
export function optimize(root: ?ASTElement, option: CompilerOptions) {
  if (!root) return;
  isStaticKey = genStaticKeysCached(options.staticKeys || "");
  isPlatformReservedTag = options.isReservedTag || no;
  // 标记静态节点
  markStatic(root);
  // 标记静态根节点
  markStaticRoots(root, false);
}

// 标记静态节点，从根节点开始，递归看子节点是否是静态子节点
function markStatic(node: ASTNode) {
  node.static = isStatic(node);
  if (node.type === 1) {
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== "slot" &&
      node.attrsMap["inline-template"] == null
    ) {
      return;
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      // 如果当前节点的子节点是非静态节点，就先把当前节点标记为非静态节点
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      // v-if, v-else-if,v-else每次都只渲染一个，其余没有被渲染的不在children中，需要在循环一次ifConditions
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block;
        markStatic(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

// 标记节点是否是静态节点
function isStatic(node: ASTNode): boolean {
  if (node.type === 2) {
    // 如果type是1代表包含动态的动态文本节点
    return false;
  }
  if (node.type === 3) {
    // 如果type是2代表是纯文本节点，肯定是静态节点
    return true;
  }
  return !!(
    node.pre ||
    // 这种就需要进一步的判断
    (!node.hasBindings && // 没有动态绑定
      !node.if &&
      !node.for && // 没有v-if v-for v-else
      !isBuiltInTag(node.tag) &&
      isPlatformReservedTag(node.tag) && // 不是built-in也不是组件
      !isDerectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey))
  );
}

// 标记静态根节点
function markStaticRoots(node: ASTNode, isInFor: boolean) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    if (
      node.static &&
      node.children.length &&
      !(node.children.length === 1 && node.children[0].type === 3)
    ) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (let i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        markStaticRoots(node.ifConditions[i].block, isInFor);
      }
    }
  }
}
