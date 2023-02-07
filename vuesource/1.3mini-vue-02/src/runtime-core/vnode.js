import { Text } from "./index"
export const createVNode = (tag, props, children) => {
  return {
    tag,
    props,
    children
  }
}
export const createTextNode = text => {
  return createVNode(Text, null, text)
}