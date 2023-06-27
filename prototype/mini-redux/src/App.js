import { useState } from 'react';
import './App.css';
// import ReduxPage from './pages/ReduxPage';
// import HooksPage from './pages/HooksPage';
import ReactReduxPage from './pages/ReactReduxPage';

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="App">
      {/* <ReduxPage></ReduxPage> */}
      {/* <HooksPage></HooksPage> */}
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ReactReduxPage omg={count}></ReactReduxPage>
    </div>
  );
}

export default App;
