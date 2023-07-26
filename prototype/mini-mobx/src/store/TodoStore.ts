// add
// edit

import { action, computed, makeAutoObservable, observable } from "../which";

export type Todo = {
  task: string;
  completed: boolean;
  assignee: null | string;
}

export type TodoList = Todo[]

class TodoStore {
  constructor() {
    makeAutoObservable(this, {
      todoList: observable,
      addTodo: action,
      toggleTodo: action,
      completedTodoList: computed,
      report: computed
    })
  }

  todoList: TodoList = [
    {
      task: 'Drink water',
      completed: false,
      assignee: null
    }
  ]

  addTodo = (task: string) => {
    this.todoList.push({
      task,
      completed: false,
      assignee: null
    })
  }

  get completedTodoList() {
    return this.todoList.filter(todo => todo.completed).length
  }

  toggleTodo = (todo: Todo) => {
    todo.completed = !todo.completed
  }

  editTodo = (todo: Todo, task: string) => {
    todo.task = task
  }

  get report() {
    if (this.todoList.length === 0) {
      return 'Nothing to report'
    }
    const nextTask = this.todoList.find(todo => !todo.completed)

    return 'The next task is ' + nextTask?.task + '. Process:' + this.completedTodoList + '/' + this.todoList.length
  }
}

const todoStore = new TodoStore()
export default todoStore