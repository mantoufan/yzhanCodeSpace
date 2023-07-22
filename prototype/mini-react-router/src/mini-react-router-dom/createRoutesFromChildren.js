import React from 'react'
// 类比 dom -> vdom
export default function createRoutesFromChildren(children) {
  const routes = []
  React.Children.forEach(children, (child) => {
    const route = {
      path: child.props.path,
      element: child.props.element,
    }
    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children)
    }
    routes.push(route)
  })
  return routes
}