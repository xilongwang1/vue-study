var counter1 = require('./util/counter')
var counter2 = require('./util/counter')

console.log(counter1.count()) // 1
console.log(counter2.count()) // 2
console.log(counter2.count()) // 3
// 可以看到，counter.js并没有因为被require了两次而初始化两次。