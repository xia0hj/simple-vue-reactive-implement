//@ts-check

import observe from './src/observer.js'
import Watcher from './src/watcher.js'

const obj = {
  objKey: 'obj key default val',
  arr: [
    { arrKey: 'v0' },
    { arrKey: 'v1' },
    { arrKey: 'v2' }
  ]
}
observe(obj)
const objWatcher = new Watcher(obj, 'objKey', (newVal, oldVal) => {
  console.log(`将${oldVal}修改为${newVal}`)
})
obj.objKey = '111'
obj.objKey = '222'
obj.objKey = '333'


const arrayWatcher = new Watcher(obj, 'arr', (newVal, oldVal) => {
  console.log(`将${oldVal}修改为${newVal}`)
})
obj.arr.push({
  arrKey: 'v4'
})
console.log(obj.arr)
const array3Watcher = new Watcher(obj.arr[3], 'arrKey', (newVal, oldVal) => {
  console.log(`将${oldVal}修改为${newVal}`)
})
obj.arr[3].arrKey = 'v3新值'