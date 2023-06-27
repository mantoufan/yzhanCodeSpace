import { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "../redux-nut"

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    console.log('ownProps', ownProps)
    return state
  },
  // ({count}) => ({count}),
  //mapDispatchToProps
  // {
  //   add: () => ({type: 'ADD'}),
  //   minus: () => ({type: 'MINUS'}),
  // },
  dispatch => {
    let creators = {
      add: () => ({ type: 'ADD' }),
      minus: () => ({ type: 'MINUS' }),
    }
    creators = bindActionCreators(creators, dispatch)
    console.log('creators', creators)
    return { dispatch, ...creators }
  }
  )(
    class ReactReduxPage extends Component {
    render() {
      const { count, dispatch, add, minus } = this.props
      return (
        <div>
          <h3>ReactReduxPage</h3>
          <button onClick={() => dispatch({type: 'ADD'})}>dispatch:{count}</button>
          <button onClick={add}>add:{count}</button>
        </div>
      )
    }
  })