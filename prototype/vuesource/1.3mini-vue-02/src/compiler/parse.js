export function parse(template) {
  const context = {
    source: template,
    advance(length) {
      this.source = this.source.slice(length)
    },
    advanceSpaces() { // 消费若干连续空格
      this.source = this.source.replace(/^\s+/, '')
    },
    advanceAttrs() {
      this.source = this.source.replace(/[\w-]+=('|")*[\w-]+\1/, '')
    }
  }
  return parseChildren(context, [])
}
// 更新子节点
export function parseChildren(context, stack) {
  // 存储解析所获得的所有 ast 节点
  const nodes = []
  while (isEnd(context, stack) === false) {
    // 单次解析结果
    let node

    // 1. 标签
    if (context.source[0] === '<') {
      if (context.source[1] === '/') continue
      if (/[a-zA-Z]/.test(context.source[1])) {
        // 开始标签
        node = parseElement(context, stack)
      }
    }
    // 2. 插值
    else if (context.source.startsWith('{{')) {
      node = parseInterpolation(context)
    }
    // 3. 文本
    if (node === void 0) node = parseText(context)

    nodes.push(node)
  }

  return nodes
}

function isEnd(context, stack) {
  // 模板解析完毕
  // 遇到结束标签，并且 stack 中存在同名标签
  return context.source === '' || context.source === void 0 || stack.length > 0 && context.source.startsWith('</' + stack[stack.length - 1].tag)
}

// <div id="xxx" v-if="yyy"></div>
function parseElement(context, stack) {
  // 1. ele 就是解析结果 ast
  const ele = parseTag(context)
  if (ele.isUnary) {
    return ele
  }
  // 2. 入栈
  stack.push(ele)
  // 3. 递归地处理 children
  ele.children = parseChildren(context, stack)
  // 4. 出栈
  stack.pop()
  // 5. 解析结束标签
  if (context.source.startsWith(`</${ele.tag}`)) parseTag(context, 'end')
  else console.error(context.source + '缺少闭合标签')
  return ele
}

function parseTag(context, type = 'start') {
  // 处理开始、结束标签的正则不同
  const pattern =
    type === 'start'
      ? /^<([a-z][^\s />]*)/i
      : /^<\/([a-z][^\s />]*)/i
  const match = pattern.exec(context.source)
  // 匹配成功，第一个分组的值为标签名称
  const tag = match[1]
  
  // 消费匹配部分全部内容，例如<div
  context.advance(match[0].length)

  // 解析属性前消费空格
  context.advanceSpaces()
  // 解析属性
  const props = parseAttrs(context)
 
  // 消费结束，如果字符串以/>开头，说明是自闭合标签
  const isUnary = context.source.startsWith('/>')

  // 消费掉标签名后面的/>或者>
  context.advance(isUnary ? 2 : 1)

  // 返回标签节点
  return {
    type: 'Element',
    tag,
    props,
    children: [],
    isUnary
  }
}

// 解析属性
function parseAttrs(context) {
  /* id="foo" v-show="isShow"></div>
     v-show="isShow"></div> */
  const props = []
  
  while (context.source.startsWith('>') === false && context.source.startsWith('/>') === false) {
    const match = /^[^\s\/>=]+/.exec(context.source)
    // 获取属性名称
    let name = match[0]
    // 消费属性名称 + 等号
    context.advance(name.length + 1)
    // 消费等号后可能的空格
    context.advanceSpaces()
    // 获取属性值
    let value = ''
    // 判断是否有引号
    const quota = context.source[0]
    const isQuota = quota === '\'' || quota === '"' 
    if (isQuota) {
      // 消费首个引号
      context.advance(1)
      // 寻找下一个引号下标
      const quotaIndex = context.source.indexOf(quota)
      if (quotaIndex === -1) console.error('Quotation is needed')
      else {
        // 截取引号之间的属性值
        value = context.source.slice(0, quotaIndex)
        // 消费属性值 + 引号
        context.advance(value.length + 1)
      }
    } else {
      const match = /^[^\s\/>=]+/.exec(context.source)
      value = match[0]
      context.advance(value.length)
    }
    // 消费下个属性之前的空格
    context.advanceSpaces()
    
    /* 新增代码：start */
    let type = 'Attribute' // Attribute: type etc.
    const firstChar = name[0], secondChar= name[1]
    if (firstChar === '@') {// Event: @click etc.
      type = 'Event'
      name = name.substring(1)
    } else if (firstChar + secondChar === 'v-') {// Directive: v-model etc.
      type = 'Directive'
    }
    /* 新增代码：end */

    props.push({
      type,
      name,
      value
    })
  }
  return props

  // const result = context.source.match(/(?<name>[\w-]+)=("|')*(?<value>[\w-]+)\2/)
  // if (result === null) console.error('Invaild property on ', context.source)
  // const { name, value } = result?.groups
  // return {
  //   type: 'Attribute',
  //   name,
  //   value
  // }
}

// 解析文本
function parseText(context) {
  // 寻找文本的结束位置
  let endIndex = context.source.length
  // 查找 <
  const ltIndex = context.source.indexOf('<')
  // 查找 {{
  const delimeterIndex = context.source.indexOf('{{')

  if (ltIndex > -1 && ltIndex < endIndex) endIndex = ltIndex
  if (delimeterIndex >-1 && delimeterIndex < endIndex) endIndex = delimeterIndex

  const content = context.source.slice(0, endIndex)
  context.advance(content.length)
  
  return {
    type: 'Text',
    content
  }
}

// 解析插值语法
// {{foo}}</div>
function parseInterpolation(context) {
  // 消费 {{
  context.advance(2)
  // 寻找 }}
  const delimeterIndex = context.source.indexOf('}}')
  // 截取插值
  const content = context.source.slice(0, delimeterIndex)
  //消费插值 + }}
  context.advance(content.length + 2)
  return {
    type: 'Interpolation',
    content: {
      type: 'Expression',
      content
    }
  }
}