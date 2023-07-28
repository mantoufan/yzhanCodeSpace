import { IDerivation } from "./Reaction"
import { globalState } from "./globalState"
import { IObservable } from "./observablevalue"

// Add derivation base on observable variable
export function addObserver(observable: IObservable, node: IDerivation) {
  observable.observers_.add(node)
}

export function removeObserver(observable: IObservable, node: IDerivation) {
  observable.observers_.delete(node)
}

export function propagateChanged(observable: IObservable) {
  observable.observers_.forEach(d => {
    d.onBecomeStale_()
  })
}

export function reportObserved(observable: IObservable): boolean {
  const derivation = globalState.trackingDerivation
  if (derivation) {
    derivation.newObserving_![derivation.unboundDepsCount_++] = observable
    observable.isBeingObserved_ = true
    return true
  }
  return false
}