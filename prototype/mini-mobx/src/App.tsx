
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
import ProviderPage from './pages/ProviderPage'
import InjectPage from './pages/InjectPage'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/count' element={<CountPage />} />
            <Route path='/todoList' element={<TodoListPage />} />
            <Route path='/timer' element={<TimerPage />} />
            <Route path='/provider' element={<ProviderPage />} />
            <Route path='/inject' element={<InjectPage />} />
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
          <li>
            <Link to='/provider'>Provider</Link>
          </li>
          <li>
            <Link to='/inject'>Inject</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default App
