export default function bindActionCreators(actionCreators, dispatch) {
  return Object.keys(actionCreators).reduce((newAction, actionName) => {
    newAction[actionName] = (...args) => dispatch(actionCreators[actionName](...args))
    return newAction
  }, {})
}