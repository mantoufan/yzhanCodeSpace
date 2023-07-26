import { Reaction } from "../which"
import { useEffect, useRef, useState } from "react"

export interface IReactionTracking {
  reaction: Reaction
}

function observerComponnetNameFor(baseComponentName: string) {
  return `observer${baseComponentName}`
}

export default function useObserver<T>(fn: () => T, baseComponentName: string = 'observed'): T {
  const [, setState] = useState()
  const forceUpdate = () => setState([] as any)

  // if observerable value is changed, force update
  const reactionTrackingRef = useRef<IReactionTracking | null>(null)

  if (reactionTrackingRef.current === null) {
    reactionTrackingRef.current = {
      reaction: new Reaction(
        observerComponnetNameFor(baseComponentName),
        () => forceUpdate()
      )
    }
  }

  const { reaction } = reactionTrackingRef.current
  let rendering!: T, exception
  reaction.track(() => {
    try {
      rendering = fn()
    } catch (e) {
      exception = e
    }
  })

  // uninstall the reaction
  useEffect(() => () => {
    reactionTrackingRef.current?.reaction.dispose()
    reactionTrackingRef.current = null
  }, [])
  return rendering
}