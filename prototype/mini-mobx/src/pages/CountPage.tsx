import { observer, Observer } from "../which"
import count from "../store/Count"
import { Component } from "react"

// function CountPage() {
//   return (
//     <div>
//       <h1>CountPage</h1>
//       <button onClick={count.add}>{count.num}</button>
//     </div>
//   )
// }

class CountPage extends Component {
  render() {
    console.log('It will not update twice')
    return (
      <div>
        <h1>CountPage</h1>
        <Observer>{() => <button onClick={count.add}>{count.num}</button>}</Observer>
      </div>
    )
  }
}

export default CountPage