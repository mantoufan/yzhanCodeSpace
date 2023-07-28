import { createAction } from "./action"
import { Annotation } from "./annotation"
import { ObservableObjectAdministration } from "./makeObservable"

export function createActionAnnotation(name: string): Annotation {
  return {
    annotationType_: name,
    make_
  }
}

function make_(
  adm: ObservableObjectAdministration,
  key: PropertyKey,
  descriptor: PropertyDescriptor,
) {
  const actionDescriptor = createActionDescriptor(adm, descriptor)
  return adm.defineProperty_(key, actionDescriptor)
}

export function createActionDescriptor(
  adm: ObservableObjectAdministration,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  let { value } = descriptor

  return {
    value: createAction(value),
    configurable: adm.isPlainObject_,
    enumerable: false,
    writable: false
  }
}