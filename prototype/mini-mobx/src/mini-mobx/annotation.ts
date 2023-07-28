import { ObservableObjectAdministration } from "./makeObservable"

export type Annotation = {
  annotationType_: string
  make_(
    adm: ObservableObjectAdministration,
    key: PropertyKey,
    descriptor: PropertyDescriptor,
    source: object
  ): void
}

// Crate an annotation automatically
export function createAutoAnnotation(): Annotation {
  return {
    annotationType_: "auto",
    make_
  }
}

function make_(
  adm: ObservableObjectAdministration,
  key: string,
  descriptor: PropertyDescriptor,
) {
  return adm.defineObservableProperty_(key, descriptor.value)
}

export type AnnotationMapEntry = Annotation | true | false

export type AnnotationsMap<T, AdditionalFields extends PropertyKey> = {
  [P in Exclude<keyof T, "toString">] ?: AnnotationMapEntry;
} & Record<AdditionalFields, AnnotationMapEntry>