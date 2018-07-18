class Timer {
  nodeStart() {
    this.timer = process.hrtime()
  }

  nodeEnd() {
    let elapsed = process.hrtime(this.timer)
    return elapsed
  }

  browserStart() {
    this.startTime = window.performance.now()
  }

  browserEnd() {
    let elapsed = window.performance.now() - this.startTime
    return elapsed
  }
}

module.exports = Timer
