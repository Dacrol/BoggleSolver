class Timer {
  nodeStart() {
    this.timer = process.hrtime()
  }

  nodeEnd() {
    let elapsed = process.hrtime(this.timer)
    return elapsed
  }
}

module.exports = Timer
