import { parse } from "./parse"
import { generate } from "./generate"
export function compile(template) {
  const ast = parse(template)
  const code = generate(ast)
  return {
    render: new Function(code)()
  }
}