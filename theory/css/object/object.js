// check how many properties in the global object
// let globalThis = function () {
//   return this
// }()


// const keys = Object.keys(globalThis) // enumerable properties
// const ownKeys = Reflect.ownKeys(globalThis)
// const ownPropertyNames = Object.getOwnPropertyNames(globalThis)
//console.log(JSON.stringify(ownPropertyNames, null, 2))
//console.log(keys.length, ownKeys.length, ownPropertyNames.length)

const ecmaKeys = [
  "Object",
  "Function",
  "Array",
  "Number",
  "parseFloat",
  "parseInt",
  "Infinity",
  "NaN",
  "undefined",
  "Boolean",
  "String",
  "Symbol",
  "Date",
  "Promise",
  "RegExp",
  "Error",
  "AggregateError",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "globalThis",
  "JSON",
  "Math",
  "Intl",
  "ArrayBuffer",
  "Uint8Array",
  "Int8Array",
  "Uint16Array",
  "Int16Array",
  "Uint32Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "Uint8ClampedArray",
  "BigUint64Array",
  "BigInt64Array",
  "DataView",
  "Map",
  "BigInt",
  "Set",
  "WeakMap",
  "WeakSet",
  "Proxy",
  "Reflect",
  "FinalizationRegistry",
  "WeakRef",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape",
  "eval",
  "isFinite",
  "isNaN",
  Symbol.toStringTag
]
const ans = [], visited = new Map
const nodes= [], edges = []
const bfs = (queue = []) => {
  while (queue.length) {
    const { obj, path } = queue.shift()
    if (path === 'globalThis') continue
    if (['object', 'function'].includes(typeof obj) === false) continue
    if (visited.has(obj)) continue
    visited.set(obj, path)
    nodes.push({ id:path, label: path})
    try {
      const ownKeys = Reflect.ownKeys(obj)
      ans.push({ obj, path })
      for (const key of ownKeys) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key)

        if (descriptor.value) {
          if ([Object.prototype, Function.prototype].includes(descriptor.value)) continue
          queue.push({
            obj: descriptor.value,
            path: path + '.' + key.toString()
          })
          edges.push(
            { source: visited.get(obj), target: path + '.' + key.toString() },
          )
        } else {
          queue.push(
            {
              obj: descriptor.get,
              path: path + '.getter ' + key.toString()
            },
            {
              obj: descriptor.set,
              path: path + '.setter ' + key.toString()
            },
          ) 
        }
        edges.push(
          { source: visited.get(obj), target: path + '.getter ' + key.toString() },
          { source: visited.get(obj), target: path + '.setter ' + key.toString() }
        )
      }
    } catch (e) {
      // console.log(e)
    }
  }
}

bfs(ecmaKeys.filter(key=> ['object', 'function'].includes(typeof globalThis[key])).map(key => ({
  obj: globalThis[key],
  path: key.toString(),
})))
console.log(JSON.stringify({
  nodes,
  edges
}, null, 2))