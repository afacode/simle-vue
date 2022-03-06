// const {reactive, effect} = require('@vue/reactivity')
import {createApp} from './core/index.js'
import App from './App.js'
// const { reactive, effectWatch } = require('./core/reactivity/index')

createApp(App).mount(document.querySelector('#app'))
