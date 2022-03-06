import { effectWatch } from './reactivity/index.js'
import { mountElement, diff } from './renderer/index.js'
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup()

      const isMounted = false
      let prevSubTree

      effectWatch(() => {
        if (!isMounted) {
          // 第一次 init 初始化
          isMounted = true
          rootContainer.innerHTML = ``
          const subTree = rootComponent.render(context)
          console.log(subTree)
          // const element = rootComponent.render(context)
          // rootContainer.append(element)
          mountElement(subTree, rootContainer)
          prevSubTree = subTree
        } else {
          // update
          const subTree = rootComponent.render(context)
          diff(prevSubTree, subTree)
          prevSubTree = subTree
        }

        // diff newVNode == > oldVNode 最小 变动
      })
    }
  }
}