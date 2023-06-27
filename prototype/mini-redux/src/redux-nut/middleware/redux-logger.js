export default function logger ({ getState, dispatch }) {
  return next => action => {
    console.log('action', action)
    console.log('prev state', getState())
    const result = next(action)
    console.log('next state', getState())
    return result
  }
}