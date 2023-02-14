import ReactDOM from '../../src/react-dom'
import { Component } from '../which-react'
import './index.css'

function FunctionComponent(props) {
  return (
    <div className='border'>
      <p>{props.name}</p>
    </div>
  )
}
class ClassComponent extends Component {
  render() {
    return (
      <div className='border'>
        <h3>{this.props.name}</h3>
        我是文本
      </div>
    )
  }
}

function FragmentComponent() {
  return <ul>
    <>
      <li>FragmentComponent 01</li>
      <li>FragmentComponent 02</li>
    </>
  </ul>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className="App">
    <h1>react</h1>
    <a href="https://github.com/bubucuo/mini-react">mini react</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <FragmentComponent />
  </div>
)
