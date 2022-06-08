/**
 * 
 * @param {function} makeReactive 
 */
export default function (makeReactive) {
  // 以 Array.prototype 为原型创建 newArrayPrototype 对象
  const newArrayPrototype = Object.create(Array.prototype);
  // 数组调用以下三个方法去新增元素时，使新增的元素也变为响应式
  const insertMethods = [
    'push',
    'unshift',
    'splice',
  ]
  for (let i = 0; i < insertMethods.length; i++) {
    const original = newArrayPrototype[insertMethods[i]]
    Object.defineProperty(newArrayPrototype, insertMethods[i], {
      enumerable: false,
      value: function (...args) {
        let inserted = [] // 插入数组的新值
        if (insertMethods[i] === 'push' || insertMethods[i] === 'unshift') {
          inserted = args
        } else if (insertMethods[i] === 'splice') {
          inserted = args.slice(2) // splice()方法的前两个参数是下标，去掉
        }
        // 使每个新插入的元素都变为响应式
        if (inserted.length > 0) {
          for (let j = 0; j < inserted.length; j++) {
            makeReactive(inserted[j])
          }
        }
        original.apply(this, args) // 继续执行数组原来的方法
      }
    })
  }
  return newArrayPrototype
}