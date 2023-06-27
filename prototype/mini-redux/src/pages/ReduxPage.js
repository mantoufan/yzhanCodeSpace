import { Component } from 'react'
import store from '../store'

export default class ReduxPage extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  add = () => {
    store.dispatch({ type: 'ADD' })
    console.log('store', store.getState())
  }
  minus = () => {
    store.dispatch(setTimeout(() => {
      store.dispatch({ type: 'MINUS' })
    }, 1000))
  }
  promiseMinus = () => {
    store.dispatch(Promise.resolve({ type: 'MINUS', payload: 100 }))
  }
  render() {
    return (
      <div>
        <h3>ReduxPage</h3>
        <p>{store.getState().count}</p>
        <button onClick={this.add}>add</button>
        <button onClick={this.minus}>minus</button>
        <button onClick={this.promiseMinus}>promiseMinus</button>
      </div>
    )
  }
}