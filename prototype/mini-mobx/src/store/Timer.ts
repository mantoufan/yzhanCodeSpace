import { makeAutoObservable } from "../which"

class Timer {
  secondsPassed = 0

  constructor() {
    makeAutoObservable(this)
  }

  increaseTimer = () => {
    this.secondsPassed += 1
  }
}

export default Timer