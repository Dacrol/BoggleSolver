class Stopwatch {
  constructor() {
    this.start = (typeof process !== 'undefined' && process.hrtime) ? this.nodeStart : (typeof window !== 'undefined' && window.performance) ? this.browserStart : () => {}
    this.end = (typeof process !== 'undefined' && process.hrtime) ? this.nodeEnd : (typeof window !== 'undefined' && window.performance) ? this.browserEnd : () => {}
  }
  nodeStart() {
    this.timer = process.hrtime()
  }

  nodeEnd() {
    let elapsed = process.hrtime(this.timer)
    return round3(elapsed[0] * 1000 + elapsed[1] / 1000000) // Convert to ms, hrtime returns full seconds in [0] and nanoseconds in [1]
  }

  browserStart() {
    this.startTime = window.performance.now()
  }

  browserEnd() {
    let elapsed = window.performance.now() - this.startTime
    return round3(elapsed)
  }
}

function round3 (number) {
  return Math.round(number*1000) / 1000 // Add something like 0.00001 after multiplication if floating point errors is an issue
}

module.exports = Stopwatch
