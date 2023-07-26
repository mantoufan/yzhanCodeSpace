
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet
} from 'react-router-dom'
import CountPage from './pages/CountPage'
import TodoListPage from './pages/TodoListPage'
import TimerPage from './pages/TimerPage'
import './App.css'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/count' element={<CountPage />} />
            <Route path='/todoList' element={<TodoListPage />} />
            <Route path='/timer' element={<TimerPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/count'>Count</Link>
          </li>
          <li>
            <Link to='/todoList'>TodoList</Link>
          </li>
          <li>
            <Link to='/timer'>Timer</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default App
