// pls run this code on the console of https://html.spec.whatwg.org/
const f = document.createElement('IFRAME'); document.body.appendChild(f)
const urls = Array.from(new Set(Array.from(document.querySelectorAll('.tr-list__item__header a')).map(e => e.href)))
const urlPromises = urls.map(href => () => new Promise(resolve => (f.src = href, f.onload = ()=>{resolve(Array.from(f.contentDocument.querySelectorAll('.propdef')))})))
const n = urlPromises.length
const graph = Object.create(null)
let i = 0
;(async () => {
  for (const urlPromise of urlPromises) {
   console.log('crawling:', i + 1, '/', n, ' ', urls[i++])
   const tables = await urlPromise()
   for (const table of tables) {
      try {
        const names = table.rows[0].cells[1].innerText.split(', ')
        for (const name of names) {
          const values = table.rows[1].cells[1].innerText.split(' | ')
          if (graph[name] === void 0) graph[name] = []
          graph[name].push(...values)
        }
      } catch (error){ console.log(error) }
   }
  }
  console.log(graph)
})()