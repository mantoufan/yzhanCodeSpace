// Pls run these codes on the console of https://html.spec.whatwg.org/
const graph = Object.create(null)
for (const idl of Array.from(document.querySelectorAll('.idl')).map(e=>e.innerText)) {
  let interface = idl.replace(/^[\s\S]*interface (\w+) [\s\S]*$/, '$1')
  if (interface === idl || interface === 'Example' || interface === 'mixin') continue
  let parent = idl.replace(/^[\s\S]*interface \w+ : (\w+) [\s\S]*$/, '$1')
  if (parent === idl) parent = 'Global'
  if (graph[parent] === void 0) graph[parent] = new Set()
  graph[parent].add(interface)
}
console.log(graph)