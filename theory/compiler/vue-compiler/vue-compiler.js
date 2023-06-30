const fs = require('fs')
const { baseParse, getBaseTransformPreset, transform, generate } = require('@vue/compiler-core')
const { extend } = require( '@vue/shared')
function baseCompile (code, options) {
  // parse ast
  const ast = baseParse(code)
  // transform ast
  const prefixIdentifiers = false
  const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(prefixIdentifiers)
  transform(
    ast,
    extend({}, options, {
      prefixIdentifiers,
      nodeTransforms: [
        ...nodeTransforms,
        ...(options.nodeTransforms || []), // user transforms
      ],
      directiveTransforms: extend(
        {},
        directiveTransforms,
        options.directiveTransforms || {} // user transforms
      )
    })
  )
  // generate code
  return generate(
    ast,
    extend({}, options, {
      prefixIdentifiers
    })
  )
}
function compile (entry, output) {
  const { code } = baseCompile(fs.readFileSync(entry, 'utf-8'), { sourceMap: true })
  fs.writeFileSync(output, code)
}

module.exports = {
  compile
}