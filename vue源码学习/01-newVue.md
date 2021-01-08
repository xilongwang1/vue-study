[toc]

## 实例化构造函数【new Vue】

1. 首先检测 Vue 构造函数是否通过**new**关键字进行创建

2. 然后调用`_init`函数

```js
function Vue(options) {
  if (!(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}
```

### initMixin

```js
/*  */

var uid$3 = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++; // 当前实例的 _uid 加 1

    var startTag, endTag;
    /* istanbul ignore if */
    /**
     * Vue 一共依赖 perf 打了多少个点
     * 列出通过 mark 和 measure 打点的列表
     */
    if (config.performance && mark) {
      startTag = "vue-perf-start:" + vm._uid;
      endTag = "vue-perf-end:" + vm._uid;
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true; // 用 _isVue 来标识当前实例是 Vue 实例， 这样做是为了后续被 observed
    // merge options 合并options / _isComponent 标识当前为 内部Component
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options); // 内部Component 的 options 初始化
    } else {
      // 非内部Component的 options 初始化
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      // 在render中将this指向vm._renderProxy
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm); // 初始化生命周期
    initEvents(vm); // 初始化事件
    initRender(vm); // 初始化渲染函数
    callHook(vm, "beforeCreate"); // 回调 beforeCreate 钩子函数
    initInjections(vm); // resolve injections before data/props
    initState(vm); // 初始化 vm 的状态
    initProvide(vm); // resolve provide after data/props
    callHook(vm, "created"); // vm 已经创建好, 回调 created 钩子函数

    /* istanbul ignore if */
    if (config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure("vue " + vm._name + " init", startTag, endTag);
    }

    // 挂载实例
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}
```

- 在初始化时主要做了以下几件事

1. ==初始化 options 参数==

   - Vue.js 封装了对视图的所有操作,包括数据的读写、数据变化的监听、DOM 元素的更新等
   - 通过 new Vue(options)来创建一个实例,也称 Vue 对象
   - 该 Vue 实例 封装了操作元素视图的所有操作，可通过 Vue 实例 来轻松操作对应区域的视图
   - options 对象的具体可选属性有很多，具体可分为五大类 : 数据 、DOM 、生命周期钩子 、 资源 、组合

2. ==将\_renderProxy 设置为 vm -- initProxy==
   - 为 vm 挂载一个\_renderProxy 属性
   - 若是开发环境且支持原生 Proxy 接口,\_renderProxy 属性挂一个 Proxy 对象
   - 若是生产环境或不支持原生 Proxy,直接挂 vm
   - renderProxy 渲染代理
   - Proxy 对象用于拦截对目标对象的所有操作,因此,对\_renderProxy 属性的操作将被拦截具体的具体的拦截方式: handlers 对象

```js
initProxy = function initProxy(vm) {
  if (hasProxy) {
    // determine which proxy handler to use
    var options = vm.$options;
    // 不管开发环境还是生产环境都是为了给实例对象增添一个_renderProxy属性
    // _withStripped存在与否决定了对_renderProxy的拦截方式的不同
    var handlers =
      options.render && options.render._withStripped ? getHandler : hasHandler;
    vm._renderProxy = new Proxy(vm, handlers);
  } else {
    vm._renderProxy = vm;
  }
};
```

3. ==拦截方式 handlers 对象==
   - \_withStripped 存在与否决定了对\_renderProxy 的拦截方式的不同

```js
const options = vm.$options;
const handlers =
  options.render && options.render._withStripped ? getHandler : hasHandler;
```

```js
var hasHandler = {
  has: function has(target, key) {
    var has = key in target;
    var isAllowed =
      allowedGlobals(key) ||
      (typeof key === "string" &&
        key.charAt(0) === "_" &&
        !(key in target.$data));
    if (!has && !isAllowed) {
      if (key in target.$data) {
        warnReservedPrefix(target, key);
      } else {
        warnNonPresent(target, key);
      }
    }
    return has || !isAllowed;
  },
};
```

```js
var getHandler = {
  // 拦截对 _renderProxy的只读操作
  get: function get(target, key) {
    if (typeof key === "string" && !(key in target)) {
      if (key in target.$data) {
        // 若访问的属性不存在就报警
        warnReservedPrefix(target, key); // 代理属性不能以$或_开头
      } else {
        warnNonPresent(target, key); // 实例未定义,渲染期间引用
      }
    }
    // 不改变默认返回值
    return target[key];
  },
};
```

4. ==vm.\_renderProxy==

   - 实例渲染时,渲染函数会从 vm.\_renderProxy 对象上读取所需要的数据,
   - 一般来说他指向的是实例对象,也就是说直接从实例对象上读取数据用于渲染
   - 但在开发环境,且支持 Proxy 的情况下,程序会给这个操作增加一层校验: 渲染所需数据不存在时警告
   - 校验 render 函数是否引用了 vm 上不存在数据或非特许的数据
   - 校验自定义的快捷键名是否和 Vue 内置的快捷键修饰符重名

5. ==初始化生命周期==

   - Vue 的生命周期分为三个阶段,分别是: 初始化,运行中,销毁,一共 8 个钩子函数
   - Vue 的生命周期指的是组件从创建到销毁的一个过程
   - 在这个过程中,在每个特定的阶段会触发一些方法,这些方法叫做生命周期钩子函数/组件钩子
   - 钩子函数具体用途: 页面初始化、数据进出顺序、页面状态控制

### renderMixin

```js
var currentRenderingInstance = null;

function renderMixin(Vue) {
  // install runtime convenience helpers 安装运行时辅助工具
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access 
    // 设置父vnode 这允许渲染函数具有访问权限
    // to the data on the placeholder node. 到占位符节点上的数据
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // 不需要维护堆栈,因为所有的渲染函数都会被调用
      // separately from one another. Nested component's render fns are called
      // 彼此分开,嵌套组件的渲染函数被调用
      // when parent component is patched. 修补父组件时
      currentRenderingInstance = vm;
      // 执行 vue 实例的 render 方法
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result, 返回错误结果
      // or previous vnode to prevent render error causing blank component
      // 或者上一个vnode,以防止渲染错误导致空白组件
      /* istanbul ignore else */
      if (vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          );
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    // 如果返回的数组只包含一个节点,则允许并赋值
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    // 返回空vnode避免render方法报错退出
    if (!(vnode instanceof VNode)) {
      if (Array.isArray(vnode)) {
        warn(
          "Multiple root nodes returned from render function. Render function " +
            "should return a single root node.",
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };
}
```

1. 执行了 installRenderHelpers 方法，然后定义了 Vue 的 $nextTick 和 _render 方法

```js
 /* installRenderHelpers */

  function installRenderHelpers(target) {
    target._o = markOnce;
    target._n = toNumber; // 数字
    target._s = toString; // 字符串
    target._l = renderList; // 列表
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

```

2. 在 $nextTick 函数中执行了 nextTick 函数

```js
/* nextTick  */
 function nextTick(cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, "nextTick");
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== "undefined") {
      return new Promise(function (resolve) {
        _resolve = resolve;
      });
    }
  }
```

3. _render 方法
  - 关键在这个 try...catch 方法中，执行了Vue实例中的 render 方法生成一个vnode。
  - 如果生成失败，会试着生成 renderError 方法。
  - 如果vnode为空，则为vnode传一个空的VNode，最后返回vnode对象。

4. initRender

```js
  /*  */

  function initRender(vm) {
    vm._vnode = null; // the root of the child tree 子树的root
    vm._staticTrees = null; // v-once cached trees v-once缓存树
    var options = vm.$options;
    var parentVnode = (vm.$vnode = options._parentVnode); // the placeholder node in parent tree 父树的占位节点
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance 将创建元素函数绑定到此实例上
    // so that we get proper render context inside it. // 这样可以在其中获得适当的渲染上下文
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // 参数顺序: 标记、数据、子项、normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    // 内部版本由从模板编译的呈现函数使用
    // 将 createElement 方法绑定到这个实例，这样我们就可以在其中得到适当的 render context。
    vm._c = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, false);
    };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    // 规范化一直应用于公共版本，用于用户编写的 render 函数。
    vm.$createElement = function (a, b, c, d) {
      return createElement(vm, a, b, c, d, true);
    };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    // 父级组件数据
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */ 
    // 监听事件
    {
      defineReactive$$1(
        vm,
        "$attrs",
        (parentData && parentData.attrs) || emptyObject,
        function () {
          !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
        },
        true
      );
      defineReactive$$1(
        vm,
        "$listeners",
        options._parentListeners || emptyObject,
        function () {
          !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
        },
        true
      );
    }
  }

```
> 初始化 vm的状态，prop/data/computed/method/watch都在这里完成初始化

> 挂载实例

## 总结

* vue没有把所有的方法都写在函数内部,这样从代码上来说,每次实例化的时候不会生成重复的代码

* 主要还是代码结构更清晰,利用mixin的概念,把每个模块都抽离开,这样代码在结构和扩展性都有很大提高

* 看一下整体结构,这里定义完还要被core里的index.js再次包装调用initGlobalAPI(Vue)来初始化全局的api方法,在web下runtime文件下引用再次封装,vue是分为运行时可编译和只运行的版本,所以如果需要编译,在Vue原型上添加了$mount方法,先来看一下initGlobalAPI.在instance中都是在原型上扩展方法,在这里是直接在vue上扩展静态方法

* 现在数据和DOM已经被建立了关联,所有东西都是响应的

* 注意我们不再和html之间交互了,一个Vue应用会将其挂载到一个DOM元素上(对于这个例子是#app)然后对其进行完全控制,那个HTML使我们的入口,但其余都会发生在新创建的Vue实例内部.











