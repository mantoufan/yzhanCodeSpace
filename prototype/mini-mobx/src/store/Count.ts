import { action, makeAutoObservable, makeObservable, observable } from "../which"

class Count {
  constructor() {
    makeAutoObservable(this)
    // makeObservable(this, {
    //   num: observable,
    //   add: action
    // })
  }
  num = 0
  add = () => {
    this.num += 1
  }
}
const count = new Count()
export default count