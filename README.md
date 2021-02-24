# 第一天

## vue 源码学习

## Vue 与模板

使用步骤

1. 编写页面模板
   1. 直接在 HTML 标签中写 标签
   2. 使用 template
   3. 使用 单文件 (`<template />`)
2. 创建 Vue 的实例
   - 在 Vue 的构造函数中提供: data,methods,computed,watch,props, ....
   - 将 Vue 挂载到 页面中 (mount)

## 数据驱动模型

Vue 的执行流程

1. 获得模板: 模板中有 '坑'
2. 利用 Vue 构造函数中所提供的数据来 "填坑",得到可以在页面中显示的 '标签'
3. 将标签替换页面中原来有坑的标签

Vue 利用 我们提供的数据 和 页面中 模板 生成了 一个新的 HTML 标签 (node 元素)
替换到了页面中 放置模板的位置

## 简单的模板渲染

目标:

1. 怎么将真正的 DOM 转换为 虚拟 DOM
2. 怎么将虚拟 DOM 转换为 真正的 DOM

思路与深拷贝类似


# 第二天

## 函数柯里化

参考资料:

- [函数式编程](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)
- [维基百科](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)


概念: 

1. 柯里化: 一个函数原本有多个参数,只传入**一个**参数,生成一个新函数,有新函数接收剩下的参数来运行得到结构
2. 














































































