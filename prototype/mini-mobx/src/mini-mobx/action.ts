import { createActionAnnotation } from "./actionannotation"

export const ACTION = 'action'
const actionAnnotation = createActionAnnotation(ACTION)

export const action = {
  ...actionAnnotation
}

export function createAction(fn: Function): Function {
  function res() {
    return fn(arguments)
  }
  res.isMobxAction = true
  return res
}