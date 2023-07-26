import React, { memo } from "react"
import useObserver from "./useObserver"

export function observer(baseComponent: React.FunctionComponent) {
  const baseComponentName = baseComponent.displayName || baseComponent.name
  let observerComponent = (props: any) => {
    return useObserver(() => baseComponent(props), baseComponentName)
  }
  observerComponent = memo(observerComponent)
  return observerComponent
}