export const isFunction = f => typeof f === 'function'
export const isPromise = p => p && isFunction(p.then)