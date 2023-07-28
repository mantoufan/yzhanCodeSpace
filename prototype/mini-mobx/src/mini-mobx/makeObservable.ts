import { AnnotationsMap, Annotation, createAutoAnnotation } from './annotation'
import { ownKeys, addHiddenProp, getDescriptor, isPlainObject, defineProperty } from './utils'
import { $mobx, ObservableValue } from './observablevalue'

type NoInfer<T> = [T][T extends any ? 0 : never]

export function makeObservable<
  T extends object, 
  AdditionalKeys extends PropertyKey = never
>(target: any, annotations?: AnnotationsMap<T, NoInfer<AdditionalKeys>>): void {
  const adm: ObservableObjectAdministration = asObservableObject(target)[$mobx]
  ownKeys(annotations).forEach(key => adm.make_(key, annotations![key]))
  return target
}

export function asObservableObject(target: any) {
  const adm = new ObservableObjectAdministration(target)
  addHiddenProp(target, $mobx, adm)
  return target
}

export class ObservableObjectAdministration {
  isPlainObject_: boolean
  constructor(public target_: any, public values_ = new Map()){
    this.isPlainObject_ = isPlainObject(this.target_)
  }
  make_(key: PropertyKey, annotation: Annotation | boolean) {
    if (annotation === true) {
      // auto annotation required
      annotation = createAutoAnnotation()
    }
    let source = this.target_
    while (source && source !== Object.prototype) {
      const descriptor = getDescriptor(source, key)
      if (descriptor) {
        annotation.make_(this, key, descriptor, source)
      }
      source = Object.getPrototypeOf(source)
    }
  }
  // Observable Value
  defineObservableProperty_(key: PropertyKey, value: any) {
    const cachedObservablePropDescriptor = getCachedObservablePropDescriptor(key)
    const descriptor = {
      configurable: this.isPlainObject_,
      enumerable: true,
      get: cachedObservablePropDescriptor.get,
      set: cachedObservablePropDescriptor.set
    }
    defineProperty(this.target_, key, descriptor)
    const observable = new ObservableValue(value)
    this.values_.set(key, observable)
  }
  // Normal Value
  defineProperty_(key: PropertyKey, descriptor: PropertyDescriptor) {
    defineProperty(this.target_, key, descriptor)
    return true
  }

  getObservablePropValue_(key: PropertyKey) {
    return this.values_.get(key)!.get()
  }

  setObservablePropValue_(key: PropertyKey, newValue: any) {
    const observable: ObservableValue = this.values_.get(key)
    observable.setNewValue_(newValue)
    return true
  }
}

const descriptorCache = Object.create(null)

function getCachedObservablePropDescriptor(key: PropertyKey) {
  if (descriptorCache[key]) return descriptorCache[key]
  return (descriptorCache[key] = {
    get() {
      return this[$mobx].getObservablePropValue_(key)
    },
    set(value: any) {
      return this[$mobx].setObservablePropValue_(key, value)
    }
  })
}
// Make property object array maps sets etc. to be observable automatically
const keysSymbol = Symbol('mobx-keys')
export function makeAutoObservable(target: any) {
  const adm: ObservableObjectAdministration = asObservableObject(target)[$mobx]
  if (target[keysSymbol] === void 0) {
    const proto = Object.getPrototypeOf(target)
    const keys = new Set(ownKeys(target).concat(ownKeys(proto)))
    keys.delete('constructor')
    keys.delete($mobx)
    addHiddenProp(proto, keysSymbol, keys)
  }
  target[keysSymbol].forEach((key: string) => adm.make_(key, true))
  return adm
}