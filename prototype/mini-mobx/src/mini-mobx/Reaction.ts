import { trackDerivedFunction } from "./derivation";
import { globalState } from "./globalState";
import { IDepTreeNode, IObservable } from "./observablevalue";

export enum IDerivationState_ {
  NOT_TRACKING_ = -1,
  UP_TO_DATE_ = 0,
  POSSIBLY_STALE_ = 1,
  STALE_ = -2
}

export interface IDerivation extends IDepTreeNode {
  observing_: IObservable[]
  newObserving_: null | IObservable[]
  dependenciesState_: IDerivationState_
  // runId_: number
  unboundDepsCount_: number,
  onBecomeStale_(): void,
  requiresObservable_?: boolean
}

export class Reaction implements IDerivation {
  observing_: IObservable[] = []
  newObserving_: IObservable[] | null = []
  dependenciesState_: IDerivationState_ = IDerivationState_.NOT_TRACKING_
  unboundDepsCount_: number = 0

  constructor(public name_ = 'Reaction', private onInvalidate: () => void) {}

  track(fn: () => void) {
    const prev = globalState.trackingContext
    globalState.trackingContext = this
    trackDerivedFunction(this, fn)
    globalState.trackingContext = prev
  }

  onBecomeStale_() {
    globalState.pendingReactions.push(this)
    runReactions()
  }

  runReaction_() {
    const prev = globalState.trackingContext
    globalState.trackingContext = this
    this.onInvalidate()
    globalState.trackingContext = prev
  }
}

function runReactions() {
  const allReactions = globalState.pendingReactions
  if (allReactions.length > 0) {
    let remianReactions = allReactions.splice(0)
    for (let i =0, len = remianReactions.length; i < len; i++) {
      remianReactions[i].runReaction_()
    }
  }
}