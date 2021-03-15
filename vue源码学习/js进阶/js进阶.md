[toc]

## this 指向

函数的 5 种调用模式 (ES3 时代函数 有 4种 调用模式, ES5 引入了 bind, 函数有 5 种 调用模式)

- 函数模式: this 表示全局对象 (游览器是window, 在 node 中是 global)
- 构造器 (constructor )模式: this 表示刚刚创建出来的对象
- 方法 (method)模式: this 表示引导方法调用的对象
- 上下文 (context)模式: this 可以使用参数来动态的描述 (动态绑定)
- bind 模式: this 与上下文模式类似,通过参数来确定 (静态绑定)

## 经验

1. 0.1 + 0.2 等于 0.30000000000000004
  - baiJS中采用的IEEE 754的双精度标准du，zhi计算机内部存储数据的编码dao的时候，0.1在计算机zhuan内部根shu本就不是精确的0.1，而是一个有舍入误差的0.1
  - 通常的解决办法 就是 把计算数字 提升 10 的N次方 倍 再 除以 10的N次方。
2. Date() 不传参是当前时间, 传参: 年, 月, 日, 时, 分, 秒
3. var = 'hello, world'; 
  - s.chartAt(0) // => 'h': 第一个字符
  - s.chartAt(s.length-1) // => 'd': 最后一个字符
  - s.substring(1,4) // => 'ell': 第2~4个字符
  - s.slice(1,4) // => 'ell': 同上
  - s.slice(-3) // => 'rld': 最后三个字符
  - s.indexOf('l') // => 2: 字符l首次出现的位置
  - s.lastIndexOf('l') // 10: 字符l最后一次出现的位置
  - s.indexOf('l',3) // 3: 在位置3及之后首次出现字符l的位置
  - s.split(',') // => ['hello','world'] 分割成子串
  - s.replace('h','H') // =>全文字符替换
  - s.toUpperCase() // => 转大写