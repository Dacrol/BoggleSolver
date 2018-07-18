class Timer {
  constructor() {
    this.start = (typeof process !== 'undefined' && process.hrtime) ? this.nodeStart : (typeof window !== 'undefined' && window.performance) ? this.browserStart : () => {}
    this.end = (typeof process !== 'undefined' && process.hrtime) ? this.nodeEnd : (typeof window !== 'undefined' && window.performance) ? this.browserEnd : () => {}
  }
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
