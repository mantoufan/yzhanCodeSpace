const f = document.createElement('IFRAME');document.body.appendChild(f)
const urlPromises = Array.from(new Set(Array.from(document.querySelectorAll('.toc a')).map(e => e.href.split('#')[0]))).map(href => ()=>new Promise(resolve => (f.src = href, f.onload = ()=>{resolve(Array.from(f.contentDocument.querySelectorAll('.idl')).map(e=>e.innerText))})))
const ans = []
;(async function () {
  for (const urlPromise of urlPromises) {
   const res = await urlPromise()
   console.log(res)
   ans.push(...res)
  }
  document.body.innerHTML = '<pre><code>' + ans.join('</code></pre><br><pre><code>') + '</code></pre>'
})()

// Get Type List using RegExp
const type = `[Exposed=(Window,Worker)]
interface DOMStringList {
  readonly attribute unsigned long length;
  getter DOMString? item(unsigned long index);
  boolean contains(DOMString string);
};`.replace(/^[\s\S]*interface (\w+) [\s\S]*$/, '$1')

const parent = `[Exposed=Window]
interface HTMLElement : Element {`.replace(/^[\s\S]*interface \w+ : (\w+) [\s\S]*$/, '$1')


const graph = Object.create(null)
for (const idl of Array.from(document.querySelectorAll('.idl')).map(e=>e.innerText)) {
  let interface = idl.replace(/^[\s\S]*interface (\w+) [\s\S]*$/, '$1')
  if (interface === idl) interface = null 
  let parent = idl.replace(/^[\s\S]*interface \w+ : (\w+) [\s\S]*$/, '$1')
  if (parent === idl) parent = 'Global'
  if (interface === null) continue
  if (graph[parent] === undefined) graph[parent] = []
  graph[parent].push(interface)
}
console.log(graph)

