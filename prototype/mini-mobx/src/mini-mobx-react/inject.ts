import React from "react"
import { IReactComponent } from "./observer"
import { MobXProviderContext } from "./Provider"


export const inject = (...storeNames: Array<any>) => (component: IReactComponent) => {
  const Injector = (props) => {
    const context = React.useContext(MobXProviderContext)
    const filteredContenxt = Object.create(null)
    storeNames.forEach(storeName => {
      if (context?.[storeName] !== void 0) filteredContenxt[storeName] = context[storeName]
    })
    const newProps = {
      ...props,
      ...filteredContenxt
    }
    return React.createElement(component, newProps)
  }
  return Injector
}