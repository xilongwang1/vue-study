[toc]

## this 指向

函数的 5 种调用模式 (ES3 时代函数 有 4种 调用模式, ES5 引入了 bind, 函数有 5 种 调用模式)

- 函数模式: this 表示全局对象 (游览器是window, 在 node 中是 global)
- 构造器 (constructor )模式: this 表示刚刚创建出来的对象
- 方法 (method)模式: this 表示引导方法调用的对象
- 上下文 (context)模式: this 可以使用参数来动态的描述 (动态绑定)
- bind 模式: this 与上下文模式类似,通过参数来确定 (静态绑定)