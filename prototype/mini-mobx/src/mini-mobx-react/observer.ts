import { observer as observerLite } from '../mini-mobx-react-lite'
import React, { Component } from 'react'
import { Reaction } from '../which'
export type IReactComponent<P = any> =
  | React.ClassicComponentClass<P>
  | React.ComponentClass<P>
  | React.FunctionComponent<P>
  | React.ForwardRefExoticComponent<P>

// HOC
export function observer<T extends IReactComponent>(component: T): T {
  if (Object.prototype.isPrototypeOf.call(React.Component, component) || Object.prototype.isPrototypeOf.call(React.PureComponent, component)) {
    return makeClassComponentObserver(component as React.ComponentClass<any, any>)
  } else {
    return observerLite(component as React.FunctionComponent<any>)
  }
}

function makeClassComponentObserver(componentClass: React.ComponentClass<any, any>): React.ComponentClass<any, any> {
  const target = componentClass.prototype
  const originalRender = target.render
  target.render = createReactiveRender.call(this, originalRender)

  return componentClass
}

function createReactiveRender(originalRender: Function) {
  let isRenderingPending = false
  function reactiveRender() {
    isRenderingPending = false
    const reaction = new Reaction('render', () => {
      if (isRenderingPending === false) {
        isRenderingPending = true
        Component.prototype.forceUpdate.call(this)
      }
    })
    let rendering
    reaction.track(() => {
      rendering = originalRender()
    })
    return rendering
  }
  return reactiveRender
}