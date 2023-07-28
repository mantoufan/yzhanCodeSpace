import { computed } from 'mobx';

import { makeObservable, makeAutoObservable, observable, action, Reaction, AnnotationsMap } from './mini-mobx'

import { observer, Observer, useLocalObservable, MobXProviderContext, Provider, inject } from './mini-mobx-react'

export type { AnnotationsMap }

export {
  makeObservable,
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