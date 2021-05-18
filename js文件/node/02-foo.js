
function foo() {
  console.log('我是 foo 模块');
}
foo();

// exports对象 是当前模板的导出对象
exports.hello = function () {
  console.log('Hello World!');
};


// 通过module对象可以访问到当前模块的一些信息,但最多的用途是替换当前模块的导出对象, 例如模块导出对象默认是一个普通对象，如果想改成一个函数的话，可以使用以下方式。
module.exports = function () {
  console.log('Hello World!');
};