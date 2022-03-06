// 响应式库

// 核心 收集依赖 触发依赖
let currentEffect;
class Dep {
  // 1. 收集依赖 使用订阅发布模式
  constructor(val) {
    // 使用 Set 是依赖不能重复
    this.effects = new Set()
    this._val = val
  }
  get value () {
    this.depend()
    return this._val
  }
  set value (newVal) {
    this._val = newVal
    // 值更新后通知
    this.notice()
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }
  // 2. 触发依赖
  notice() {
    // 触发一下我们之前收集到的依赖
    this.effects.forEach((effect) => {
      effect()
    })
  }
}
// const dep = new Dep()
export function effectWatch(effect) {
  currentEffect = effect
  effect()
  currentEffect = null
}

const targetMap = new Map()

export function getDep (target, key) {
  // 每个KEY必须对应一个dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}
export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      console.log(target, key)
      const dep = getDep(target, key)
      // 收集依赖
      dep.depend()

      // return target[key]
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const dep = getDep(target, key)
      const result = Reflect.set(target, key, value)
      dep.notice()
      return result
    }
  })
}

// const dep = new Dep(10)
// let b
// effectWatch(() => {
//   b = dep.value + 10
//   console.log(b)
// })
// dep.value = 20

// object -> key -> dep
// Object.a => get
// Object.a = 1 => set
// vue3 proxy



// const user = reactive({
//   name: 'afacode',
//    : 10
// })
// let double
// effectWatch(() => {
//   console.log('reactive=====')
//   double = user.age * 2
//   console.log('double', double)
// })
// user.age = 20
