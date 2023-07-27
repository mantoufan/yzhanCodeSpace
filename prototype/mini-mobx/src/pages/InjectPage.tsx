import { Component } from 'react'
import { observer, Provider, inject } from '../which'

export default class InjectPage extends Component {
  render() {
    return (
      <div>
        <h3>InjectPage</h3>
        <Provider foo="bar" filteredFoo="filteredBar">
          <Child />
        </Provider>
      </div>
    )
  }
}

const Child = inject('filteredFoo')(observer(function InjectPage(props) {
  return (
    <div>
      <h4>Child</h4>
      <p>foo has been filtered{props.foo}</p>
      <p>filteredFoo has been remaining, its value is: {props.filteredFoo}</p>
    </div>
  )
}))