import { BrowserRouter as Router, Routes, Route, Link, Outlet, useParams, useNavigate, Navigate, useLocation, useMatch, useResolvedPath  } from './mini-react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth';
import React from 'react';

const About = React.lazy(() => import('./pages/About'));

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="product" element={<Product />}>
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route path="user" element={<RequiredAuth><User /></RequiredAuth>} />
              <Route path="login" element={<Login />} />
              <Route path="about" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                  <About />
                </React.Suspense>
              } />
              <Route path="*" element={<NoMatch />} />
            </Route>
            {/* <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="product" element={<Product />}>
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route path="*" element={<NoMatch />} />
            </Route> */}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

function CustomLink({to, ...rest}) {
  const resolved = useResolvedPath(to)
  const match = useMatch({path: resolved.pathname, end: true})
  return <Link to={to} {...rest} style={{"color": match ? 'red' : 'gray'}} />
}

function Layout() {
  return (
    <div>
      <h1>Layout</h1>
      <CustomLink to="/">Home</CustomLink>
      <CustomLink to="/product">Product</CustomLink>
      <CustomLink to="/user">User</CustomLink>
      <CustomLink to="/login">Login</CustomLink>
      <CustomLink to="/about">About</CustomLink>
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

function Product() {
  return (
    <div>
      <h1>Product</h1>
      <CustomLink to="/product/123">ProductDetail</CustomLink>
      <Outlet />
    </div>
  )
}

function ProductDetail() {
  const params = useParams()
  const navigate = useNavigate()
  return (
    <div>
      <h1>ProductDetail: {params.id}</h1>
      <button onClick={() => {navigate('/')}} >Go Home</button>
      {/* <Navigate to="/product" /> */}
    </div>
  )
}

function User() {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <h1>User</h1>
      <p>{auth.user}</p>
      <button onClick={() => {
        auth.signout(() => navigate('/'))
      }}>Exit</button>
    </div>
  )
}

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from.pathname || '/'

  if (auth.user) {
    navigate(from, { replace: true })
    return null
  }

  const submit = e => {
    const formData = new FormData(e.target)
    const newUser = formData.get('username')
    auth.signin(newUser, () => {
      navigate(from, { replace: true })
    })
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input type="text" name="username" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h1>NoMatch</h1>
    </div>
  )
}

function RequiredAuth(props) {
  const auth = useAuth(), location = useLocation()
  if (auth.user === null) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return props.children
}

export default App;
