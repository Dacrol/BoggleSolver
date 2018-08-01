class Stopwatch {
  constructor() {
    this.start =
      typeof process !== 'undefined' && process.hrtime
        ? this.nodeStart
        : typeof window !== 'undefined' && window.performance
          ? this.browserStart
          : () => {}
    this.end =
      typeof process !== 'undefined' && process.hrtime
        ? this.nodeEnd
        : typeof window !== 'undefined' && window.performance
          ? this.browserEnd
          : () => {}
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

  log() {
    console.log(this.end() + ' ms')
  }

  get test() {
    return Stopwatch.test
  }

  static async test(
    callback,
    loops = 1,
    { preparation = undefined, silent = false, label = '' } = {}
  ) {
    const preparedData =
      typeof preparation === 'function' ? preparation() : preparation
    const sw = new Stopwatch()
    sw.start()
    for (let index = 0; index < loops; index++) {
      await callback(index, preparedData)
    }
    let total = sw.end()
    // @ts-ignore
    let average = total / loops
    if (!silent) {
      console.log(
        (label ? '\x1b[36m' + label + ': \x1b[0m' : '') +
          'Average: ' +
          average +
          ' ms, total: ' +
          total +
          ' ms'
      )
    }
    return [total, average]
  }
}

function round3(number) {
  return Math.round(number * 1000) / 1000 // Add something like 0.00001 after multiplication if floating point errors is an issue
}

module.exports = Stopwatch
