const solver = require('./solver')
;(async () => {
  await solver('piggy.txt', (results, time) => {
    console.log(results + ' (' + time + ' ms)')
  })
  await solver('line.txt', (results, time) => {
    console.log(results + ' (' + time + ' ms)')
  })
})()
