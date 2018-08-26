const readline = require('readline')
const solver = require('./solver.js')

if (process.argv[2]) {
  run(process.argv[2])
} else {
  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  interface.question('File to solve: ', filename => {
    run(filename)
    interface.close()
  })
}

function run(filename) {
  solver(filename, (results, time) => {
    console.log(results + ' (' + time + ' ms)')
  }).catch(() => console.log('Invalid matrix file'))
}
