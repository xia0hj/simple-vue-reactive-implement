import Dep from './dep.js'

export default class Watcher {
  /**
   * 
   * @param {object} target 监听的目标对象
   * @param {string} key 监听对象的属性
   * @param {function} callback 回调函数
   */
  constructor(target, key, callback) {
    this.target = target
    this.callback = callback
    this.getter = parsePath(key)
    this.oldValue = this.get() // 获取一次监听的属性，添加依赖
  }
  get() {
    Dep.curWatcher = this
    this.value = this.getter(this.target)
    Dep.curWatcher = null
    return this.value
  }
  update() {
    const newValue = this.get()
    this.callback(newValue, this.oldValue)
  }
}

/**
 * 返回一个多层解析嵌套key的 getter 函数
 * @param {string} key 类似a.b.c的多层key
 * @returns {function} 获取指定 key 的 getter 函数
 */
function parsePath(key) {
  let keys = key.split('.')
  return (obj) => {
    for (let i = 0; i < keys.length; i++) {
      if (!obj) {
        console.warn('解析' + key + '出错')
        return
      }
      obj = obj[keys[i]]
    }
    return obj
  }
}