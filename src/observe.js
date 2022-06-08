import Dep from './dep.js'
import createArrayProto from './create-array-proto.js'

const newArrayPrototype = createArrayProto(observe)

/**
 * new Observer()的封装，如果参数不是对象类型，或者参数已有__ob__对象，则不会进行new Observer() 
 * @param {any} obj 
 * @returns Observer对象
 */
export default function observe(obj) {
  if (typeof obj !== 'object') return
  if (obj.hasOwnProperty('__ob__') && obj.__ob__ instanceof Observer) {
    return obj.__ob__
  } else {
    return new Observer(obj)
  }
}


/**
 * @class
 * 用于遍历对象所有 Key 的类，Observer 对象会绑定对目标对象的 __ob__ 上
 */
class Observer {
  constructor(obj) {
    this.dep = new Dep()
    // 将当前的 Observer 对象绑定对目标的 __ob__ 上
    Object.defineProperty(obj, '__ob__', {
      enumerable: false,
      value: this
    })
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        observe(obj[i]) // 要判断数组中的元素是否对象
      }
      Object.setPrototypeOf(obj, newArrayPrototype) // 修改数组的原型方法
    } else {
      Object.keys(obj).forEach((key)=>{
        defineReactive(obj, key)
      })
    }
  }
}


/**
 * 将obj的key值修改为响应式，设置get()和set()方法
 * @param {object} obj
 * @param {string} key
 */
function defineReactive(obj, key) {
  console.log('defineReactive: ' + key)

  const dep = new Dep()
  let childOb

  let val = obj[key]
  if (typeof val === 'object') {
    // 如果 val 为对象，继续通过 Observer 去遍历该 val 对象
    childOb = observe(val)
  }

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      // Dep.curWatcher 是全局唯一标识的 watcher ，如果有就说明有一个 watcher 正想要添加依赖，同一时间只会有一个 watcher 被计算
      // 让当前属性的Dep去记录 watcher
      if (Dep.curWatcher) {
        dep.addSub()
        if (childOb) {
          childOb.dep.addSub()
        }
      }
      // 注意 getter 返回值必须是闭包中的变量，不能直接返回 obj.key，否则会导致无限递归触发 getter
      return val
    },
    set(newVal) {
      val = newVal
      if (typeof newVal === 'object') {
        observe(newVal)
      }
      dep.notify()
    }
  })
}