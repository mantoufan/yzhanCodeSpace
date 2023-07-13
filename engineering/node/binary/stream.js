const fs = require('fs')
const { Buffer } = require('node:buffer')
const stream = fs.createReadStream('./midjourney.png')

function copyChunkToBuffer(chunk) {
  for (const c of chunk) {
    buffer[pos++] = c
  }
}

const MAX_CHUNK_SIZE = 2048 * 1024
const buffer = new Uint8Array(MAX_CHUNK_SIZE)
const bufferNode = Buffer.alloc(MAX_CHUNK_SIZE)
let pos = 0, posNode = 0
stream.on('data', (chunk) => {
  // console.log('chunk', typeof chunk, chunk)
  copyChunkToBuffer(chunk)
  chunk.copy(bufferNode, posNode, 0, chunk.length)
  posNode += chunk.length
})

stream.on('end', () => {
  console.log(buffer)
  console.log(bufferNode)
})