//模型
class Model {
	constructor() {
		// The state of the model, an array of todo objects, prepopulated with some data
		// this.todos = [
		// 	{ id: 1, text: "Run a marathon", complete: false },
		// 	{ id: 2, text: "Plant a garden", complete: false },
		// ];

		this.todos = JSON.parse(localStorage.getItem("todos")) || [];
	}

	// Append a todo to the todos array
	addTodo(todo) {
		this.todos = [...this.todos, todo];

		this.update();

		this.onTodoListChanged(this.todos);
	}

	// Map through all todos, and replace the text of the todo with the specified id
	editTodo(id, updatedText) {
		this.todos = this.todos.map((todo) =>
			todo.id === id
				? { id: todo.id, text: updatedText, complete: todo.complete }
				: todo
		);
	}

	// Filter a todo out of the array by id
	deleteTodo(id) {
		this.todos = this.todos.filter((todo) => todo.id !== id);
	}

	// Flip the complete boolean on the specified todo
	toggleTodo(id) {
		this.todos = this.todos.map((todo) =>
			todo.id === id
				? { id: todo.id, text: todo.text, complete: !todo.complete }
				: todo
		);
	}

	update() {
		localStorage.setItem("todos", JSON.stringify(this.todos));
	}

	bindEvents(controller) {
		this.onTodoListChanged = controller.onTodoListChanged;
	}
}

//视图
class View {
	constructor() {
		// The root element
		this.app = this.getElement("#root");

		// The title of the app
		this.title = this.createElement("h1");
		this.title.textContent = "Todos";

		// The form, with a [type="text"] input, and a submit button
		this.form = this.createElement("form");

		this.input = this.createElement("input");
		this.input.type = "text";
		this.input.placeholder = "Add todo";
		this.input.name = "todo";

		this.submitButton = this.createElement("button");
		this.submitButton.textContent = "Submit";

		// The visual representation of the todo list
		this.todoList = this.createElement("ul", "todo-list");

		// Append the input and submit button to the form
		this.form.append(this.input, this.submitButton);

		// Append the title, form, and todo list to the app
		this.app.append(this.title, this.form, this.todoList);
	}

	// Create an element with an optional CSS class
	createElement(tag, className) {
		const element = document.createElement(tag);
		if (className) element.classList.add(className);

		return element;
	}

	// Retrieve an element from the DOM
	getElement(selector) {
		const element = document.querySelector(selector);

		return element;
	}

	// 视图
	get todoText() {
		return this.input.value;
	}

	resetInput() {
		this.input.value = "";
	}

	displayTodos(todos) {
		// ...
		// Delete all nodes
		while (this.todoList.firstChild) {
			this.todoList.removeChild(this.todoList.firstChild);
		}

		// Show default message
		if (todos.length === 0) {
			const p = this.createElement("p");
			p.textContent = "Nothing to do! Add a task?";
			this.todoList.append(p);
		} else {
			// ...
			// Create todo item nodes for each todo in state
			todos.forEach((todo) => {
				const li = this.createElement("li");
				li.id = todo.id;

				// Each todo item will have a checkbox you can toggle
				const checkbox = this.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = todo.complete;

				// The todo item text will be in a contenteditable span
				const span = this.createElement("span");
				span.contentEditable = true;
				span.classList.add("editable");

				// If the todo is complete, it will have a strikethrough
				if (todo.complete) {
					const strike = this.createElement("s");
					strike.textContent = todo.text;
					span.append(strike);
				} else {
					// Otherwise just display the text
					span.textContent = todo.text;
				}

				// The todos will also have a delete button
				const deleteButton = this.createElement("button", "delete");
				deleteButton.textContent = "Delete";
				li.append(checkbox, span, deleteButton);

				// Append nodes to the todo list
				this.todoList.append(li);
			});
		}
	}

	bindEvents(controller) {
		this.form.addEventListener("submit", controller.handleAddTodo);
		this.todoList.addEventListener("click", controller.handleDeleteTodo);
		this.todoList.addEventListener("input", controller.handleEditTodo);
		this.todoList.addEventListener(
			"focusout",
			controller.handleEditTodoComplete
		);
		this.todoList.addEventListener("change", controller.handleToggle);
	}
}

//控制器
class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;

		this.model.bindEvents(this);
		this.view.bindEvents(this);

		// Display initial todos
		this.onTodoListChanged(this.model.todos);

		this.view.bindEvents(this);

		this.temporaryEditValue;
	}

	onTodoListChanged = (todos) => {
		this.view.displayTodos(todos);
	};

	// Update temporary state
	handleEditTodo = (event) => {
		if (event.target.className === "editable") {
			this.temporaryEditValue = event.target.innerText;
		}
	};

	// Send the completed value to the model
	handleEditTodoComplete = (event) => {
		if (this.temporaryEditValue) {
			const id = parseInt(event.target.parentElement.id);

			this.model.editTodo(id, this.temporaryEditValue);
			this.temporaryEditValue = "";
		}
	};

	// Handle submit event for adding a todo
	handleAddTodo = (event) => {
		event.preventDefault();

		if (this.view.todoText) {
			const todo = {
				id:
					this.model.todos.length > 0
						? this.model.todos[this.model.todos.length - 1].id + 1
						: 1,
				text: this.view.todoText,
				complete: false,
			};

			this.model.addTodo(todo);
			this.view.resetInput();
		}
	};

	// Handle click event for deleting a todo
	handleDeleteTodo = (event) => {
		if (event.target.className === "delete") {
			const id = parseInt(event.target.parentElement.id);

			this.model.deleteTodo(id);
		}
	};

	// Handle change event for toggling a todo
	handleToggle = (event) => {
		if (event.target.type === "checkbox") {
			const id = parseInt(event.target.parentElement.id);

			this.model.toggleTodo(id);
		}
	};
}

const app = new Controller(new Model(), new View());
