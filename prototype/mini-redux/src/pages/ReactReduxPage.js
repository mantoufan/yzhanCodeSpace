import { Component } from "react"
import { connect } from "../react-redux-nux"
import { bindActionCreators } from "../redux-nut"

export default connect(
  // mapStateToProps
  (state, ownProps) => {
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
    return { dispatch, ...creators }
  }
  )(
    class ReactReduxPage extends Component {
    render() {
      console.log('this.props', this.props)
      const { count, dispatch, add } = this.props
      return (
        <div>
          <h3>ReactReduxPage</h3>
          <button onClick={() => dispatch({type: 'ADD'})}>dispatch:{count}</button>
          <button onClick={add}>add:{count}</button>
        </div>
      )
    }
  })