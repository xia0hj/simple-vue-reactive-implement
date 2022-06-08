/**
 * @class
 * 对于响应式对象及其每一属性都会创建一个 Dep 对象，用于存储 watcher，并在数据发生变更时通知所有 watcher 
 */
export default class Dep {
  // this.subWatchers: Array<Watcher>
  // Dep.curWatcher: Watcher

  constructor() {
    // 使用 set 避免同一个 watcher 被重复加入
    this.subWatchers = new Set()
  }
  addSub() {
    if (Dep.curWatcher) {
      this.subWatchers.add(Dep.curWatcher)
    }
  }
  notify() {
    this.subWatchers.forEach((watcher) => {
      watcher.update()
    })
  }
}