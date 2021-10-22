/**
 * watcher采用栈的数据结构记录运行栈轨迹
 */
 let targetStack = [];

 export function pushTarget(_target) {
   if (Dep.target) targetStack.push(Dep.target);
   Dep.target = _target;
 }
 
 export function popTarget () {
   Dep.target = targetStack.pop();
 }

 export default class Dep {
   constructor() {
     this.deps = new Set();
   }

   depend() {
     if(Dep.target) {
       this.deps.add(Dep.target);
     }
   }
 }