import { h } from './core/h.js'
import {reactive} from './core/reactivity/index.js'

export default {
  render(context) {
    // const div = document.createElement('div')
    // div.innerText = context.state.count
    // return div
    return h('div', {
      "aaaa": "123123",
      "class": "app"
    }, [h('p', null, String(context.state.count)), h('p', null, 'afacode1')])
    // return h('div', {
    //   "aaaa": "123123",
    //   "class": "app"
    // }, String(context.state.count))
  },
  setup() {
    const state = reactive({
      count: 0,
    })
    window.state = state
    return {
      state
    }
  }
}