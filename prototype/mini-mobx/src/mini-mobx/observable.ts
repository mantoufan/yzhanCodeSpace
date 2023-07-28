import { createObservableAnnotation } from "./observableannotation"

export const OBSERVABLE = 'observable'

const observableAnnotation = createObservableAnnotation(OBSERVABLE)

const observableFactories = Object.create(null)

export var observable = Object.assign(
  observableFactories,
  observableAnnotation
)