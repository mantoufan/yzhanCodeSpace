import { makeAutoObservable, action, observable, computed, Reaction, AnnotationsMap } from 'mobx';
// import { observer, Observer, useLocalObservable } from './mini-mobx-react-lite'

import { observer, Observer, useLocalObservable, MobXProviderContext, Provider, inject } from './mini-mobx-react'

export type { AnnotationsMap }

export {
  makeAutoObservable,
  observer,
  action,
  observable,
  computed,
  Reaction,
  Observer,
  useLocalObservable,
  MobXProviderContext,
  Provider,
  inject
}