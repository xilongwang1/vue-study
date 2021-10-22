import Dep, { pushTarget, popTarget } from "./03-dep.js";

/**
 * 记录getter函数,执行一次get函数
 */

export default class Watcher {
	constructor(setter) {
		this.setter = setter;
		this.get();
	}

	get() {
		// 记录进watcher运行轨迹栈
		pushTarget(this);
		// 执行一次setter函数
		this.value = this.setter();
		// 将上一次watcher弹出
		popTarget();
		// 返回value
		return this.value;
	}

	update() {
		this.get();
	}
}
