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
    store.dispatch({ type: 'MINUS' })
  }
  render() {
    return (
      <div>
        <h3>ReduxPage</h3>
        <p>{store.getState()}</p>
        <button onClick={this.add}>add</button>
        <button onClick={this.minus}>minus</button>
      </div>
    )
  }
}