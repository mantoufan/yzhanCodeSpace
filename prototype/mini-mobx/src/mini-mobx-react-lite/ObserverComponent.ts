import useObserver from "./useObserver"

interface IObserverProps {
  children?(): React.element | null,
  render?(): React.element | null
}
function ObserverComponent({ children, render }: IObserverProps) {
  const component = children || render
  if (typeof component !== 'function') {
    return null
  }
  return useObserver(component, 'observerAnonymous')
}
ObserverComponent.displayName = 'Observer'

export { ObserverComponent as Observer }