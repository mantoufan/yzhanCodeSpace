import { IDerivation, Reaction } from './Reaction'

export class MobXGlobals {
  runId = 0
  trackingDerivation: IDerivation | null = null
  pendingReactions: Reaction[] = []
  trackingContext: Reaction | null = null
}

export let globalState: MobXGlobals = new MobXGlobals()