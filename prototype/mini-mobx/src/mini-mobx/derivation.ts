import { IDerivation, IDerivationState_ } from "./Reaction";
import { globalState } from "./globalState";
import { addObserver, removeObserver } from "./observable-core";

export function trackDerivedFunction(derivation: IDerivation, fn: () => void) {
  derivation.dependenciesState_ = IDerivationState_.UP_TO_DATE_
  derivation.newObserving_ = new Array((derivation.observing_?.length || 0) + 100)
  derivation.unboundDepsCount_ = 0
  const prev = globalState.trackingDerivation
  globalState.trackingDerivation = derivation
  fn()
  globalState.trackingDerivation = prev
  bindDependencies(derivation)
}

function bindDependencies(derivation: IDerivation) {
  const prev = derivation.observing_
  const newObserving = derivation.newObserving_
  const observing_ = (derivation.observing_ = newObserving!)
  
  let i0 = 0, len = derivation.unboundDepsCount_
  for (let i = 0; i < len; i++) {
    // obserable variable
    const dep = observing_[i]
    if (dep.diffValue_ === 0) {
      dep.diffValue_ = 1
      // The quailities of new obserable variables differ from the old ones
      if (i0 !== i) {
        observing_[i0] = dep
      }
      i0++
    }
  }
  observing_.length = i0
  derivation.newObserving_ = null

  len = prev?.length || 0
  while (len-- > 0) {
    const dep = prev[len]
    if (dep.diffValue_ === 0) {
      removeObserver(dep, derivation)
    }
    dep.diffValue_ = 0
  }

  while (i0-- > 0) {
    const dep = observing_[i0]
    if (dep.diffValue_ === 1) {
      addObserver(dep, derivation)
      dep.diffValue_ = 0
    }
  }
}