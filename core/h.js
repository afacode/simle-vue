// 创建一个虚拟节点 vdom vnode
// tag props children

export function h(tag, props, children) {
  return {tag, props, children}
}