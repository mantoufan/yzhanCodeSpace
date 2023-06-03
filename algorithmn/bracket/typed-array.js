const num = new Float64Array(1)
num[0] = 0.3

const bytes = new Uint8Array(num.buffer)

const binary = [...bytes].map(e => e.toString(2).padStart(8, '0')).reverse()

console.log(num, bytes, binary)

/**
 * 64 位：
 * 0 位： 是符号位
 * 1 - 12 位：exponent 指数位
 * 减去一个基准值： 10 个 1
 * 比他小的是负的
 * 52 位：fraction 有效数字，有效数字一定以 1 开头，有效位第一位默认补 1
 */