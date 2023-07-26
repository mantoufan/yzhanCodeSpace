import { observer } from "../which"
import todoStore from "../store/TodoStore"

function TodoListPage() {
  const addNewTodo = () => {
    todoStore.addTodo(prompt('Please input new todo task', 'Drink water'))
  }
  return (
    <div>
      <h1>TodoListPage</h1>
      <button onClick={addNewTodo}>Add Task</button>
      <p>Finished {todoStore.completedTodoList} Tasks</p>
      <p>{todoStore.report}</p>
      <ul>
        {todoStore.todoList.map((todo, index) => (
          <TodoView key={index} todo={todo} />
        ))}
      </ul>
    </div>
  )
}

export default observer(TodoListPage)

const TodoView = observer(({ todo }) => {
  return (
    <li onDoubleClick={() => todoStore.editTodo(todo, prompt('Please input new todo task', todo.task))}>
      <input type="checkbox" checked={todo.completed} onChange={() => todoStore.toggleTodo(todo)} />
      {todo.task}
    </li>
  )
})