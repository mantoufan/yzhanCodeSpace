module.exports = base => {
  base.module.noParse = /^(?:vue)|(?:vue-router)|(?:pinia)$/
  return base
}