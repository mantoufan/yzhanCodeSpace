
const LoginService = {
  login(userInfo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userInfo.username === 'Xiaoming') {
          resolve({ id: 123, username: 'Xiaoming' })
        } else {
          reject({ err: { msg : 'username error' } })
        }
      }, 1000)
    })
  },
  // get more infromation
  getMoreInfo(userInfo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userInfo.id === 123) {
          resolve({ ...userInfo, score: 100 })
        } else {
          reject({ msg: 'There is something wrong with the server' })
        }
      })
    })
  }
}
export default LoginService