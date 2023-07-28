import { Annotation } from "./annotation"
import { ObservableObjectAdministration } from "./makeObservable"

export function createObservableAnnotation(
  name: string
): Annotation {
  return {
    annotationType_: name,
    make_,
  }
}

function make_(
  adm: ObservableObjectAdministration,
  key: PropertyKey,
  descriptor: PropertyDescriptor,
) {
  return adm.defineObservableProperty_(key, descriptor.value)
}