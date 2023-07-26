import { makeAutoObservable, action, observable, computed, Reaction, AnnotationsMap } from 'mobx';

import { observer, Observer, useLocalObservable } from './mini-mobx-react-lite'

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
}