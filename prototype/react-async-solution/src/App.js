import './App.css'
import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet
} from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import UserPage from './pages/UserPage'
import RequiredAuth from './auth/RequiredAuth'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/user" element={
              <RequiredAuth>
                <UserPage />
              </RequiredAuth>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

function Layout(props) {
  return (
    <div className="border">
      <Link to="/">Home</Link>
      <Link to="/user">User</Link>
      <Link to="/login">Login</Link>
      <Link to="/about">About</Link>
      <Outlet />
    </div>
  )
}

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h1>No Match</h1>
    </div>
  )
}

export default App
