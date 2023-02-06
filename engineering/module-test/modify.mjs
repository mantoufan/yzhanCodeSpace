import es from './es.mjs'
import cjs from './cjs.js'

cjs.val = 1
es.val = 1
import('./dynamic', dynamic=>{
  dynamic.val = 1
})