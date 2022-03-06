// vdom -> dom
export function mountElement(vnode, container) {
  const { tag, props, children} = vnode
  // tag
  const element = (vnode.el = document.createElement(tag))

  // props
  if (props) {
    for (const key in props) {
      // if (Object.hasOwnProperty.call(props, key)) {
        const val = props[key];
        element.setAttribute(key, val)
      // }
    }
  }
  // children
  // 1.可以接受一个string
  // 2.可以接受一个array
  if (typeof children === 'string') {
    const textNode = document.createTextNode(children)
    element.append(textNode)
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      mountElement(v, element)
    })
  }

  // 最后插入
  container.append(element)
}


// n1 oldVNode n2 newVNode
export function diff(n1, n2) {
  // 对比
  // tag 改变
  if (n1.tag !== n2.tag) {
    const el = document.createElement(n2.tag)
    n1.el.replaceWith(el)
  } else {
    // 小细节
    n2.el = n1.el
    // props 改变
    // old props修改 props新增 props 删除
    const { props: oldProps } = n1
    const { props: newProps } = n2
    if (newProps && oldProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key]
        const oldVal = oldProps[key]
        if (newVal !== oldVal) {
          n1.el.setAttribute(key, newVal)
        }
      })
    }
    // props 删除
    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          n1.el.removeAttribute(key)
        }
      })
    }

  }

  // children 暴力解法 方便理解
  // 1. newChildren == string  (oldChildren -> string oldChildren -> Array)
  // 2. newChildren == Array  (oldChildren -> string oldChildren -> Array)
  const { children: oldChildren = [] } = n1
  const { children: newChildren = [] } = n2

  if (typeof newChildren === 'string') {
    if (typeof oldChildren === 'string') {
      if (newChildren !== oldChildren) {
        n2.el.innerText = newChildren
      }
    } else if (Array.isArray(oldChildren)) {
      n2.el.textContent = newChildren
    }
  } else if (Array.isArray(newChildren)) {
    if (typeof oldChildren === 'string') {
      n2.el.innerText = ``
      mountElement(n2, n2.el)
    }
    else if (Array.isArray(oldChildren)) {
      // 都是数组 比较复杂
      // d对比数组 增加 删除 修改
      const length = Math.min(newChildren.length, oldChildren.length)
      // 处理公共长度
      for (let index = 0; index < length; index++) {
        const newVNode = newChildren[index]
        const oldVNode = oldChildren[index]
        diff(oldVNode, newVNode)
      }
      // 新节点比较长
      if (newChildren.length > oldChildren.length) {
        // 创建节点
        for (let index = length; index < newChildren.length; index++) {
          const newVNode = newChildren[index]
          mountElement(newVNode, newVNode.el)
        }
      }
      if (oldChildren.length > length) {
        // 删除节点
        for (let index = length; index < oldChildren.length; index++) {
          const oldVNode = oldChildren[index]
          oldVNode.el.parent.removeChild(oldVNode.el)
        }
      }
    }
  }
}

// 源码 diff 算法