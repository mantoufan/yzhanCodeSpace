module.exports = base => {
  Object.assign(base, { 
    cache: {
      type: 'filesystem',
    }
  })
  return base
}