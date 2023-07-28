// return determined object's properties Descriptor
export const getDescriptor = Object.getOwnPropertyDescriptor

const plainObjectString = Object.toString()

export const objectPrototype = Object.prototype
export const defineProperty = Object.defineProperty

export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null
}

export function isPlainObject(value: any): value is object {
  if (isObject(value) === false) return false
  const prototype = Object.getPrototypeOf(value)
  if (prototype === null) return true
  const protoConstructor = Object.hasOwnProperty.call(prototype, 'constructor') && prototype.constructor
  return typeof protoConstructor === 'function' && protoConstructor.toString() === plainObjectString 
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isFunction(fn: any): boolean {
  return typeof fn === 'function'
}

export function hasProperty(obj: any, key: any) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export function addHiddenProp(obj: any, key: any, value: any) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: true,
    writable: true,
    value
  })
}

const hasGetOnwPropertySymbols = typeof Object.getOwnPropertySymbols !== void 0

export const ownKeys: (target: any) => Array<string | symbol> =
  typeof Reflect !== void 0 && Reflect.ownKeys
    ? Reflect.ownKeys
    : hasGetOnwPropertySymbols
    ? (obj) => Object.getOwnPropertyNames(obj).concat(
      Object.getOwnPropertySymbols(obj) as any
    ) : Object.getOwnPropertyNames