

// console.log(foo1.foo());

var foo1 = require('./foo');
var foo2 = require('./foo.js');
var foo3 = require('/home/user/foo');
var foo4 = require('/home/user/foo.js');

// foo1至foo4中保存的是同一个模块的导出对象。
console.log(foo1.foo());

// 加载和使用一个JSON文件
var data = require('./04-data.json');