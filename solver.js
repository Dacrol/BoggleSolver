const fs = require('fs')

readAndSplitWordlist().catch(error => {
  console.error(error)
})
readMatrix('piggy.txt')
  .catch(error => {
    console.error(error)
  })
  .then(result => console.log(result))

async function readAndSplitWordlist(filename = './wordlist.txt') {
  const wordlist = (await loadFile(filename).catch(() => {
    throw new Error('Failed to load wordlist')
  }))
    .trim()
    .toLowerCase()
    .split(/\r?\n/)
    .map(word => word.trim())
  return wordlist
}

async function readMatrix(filename) {
  const rawText = (await loadFile(filename).catch(() => {
    throw new Error('Failed to load matrix')
  }))
    .trim()
    .toLowerCase()
  const linesArray = rawText.split(/\r?\n/).map(line => line.trim().split(' '))
  return {
    matrix: linesArray.slice(1),
    startPosition: [+linesArray[0][1] - 1, +linesArray[0][2] - 1]
  }
}

function loadFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (error, data) => {
      if (error) {
        reject(error)
      }
      resolve(data)
    })
  })
}
