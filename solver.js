const fs = require('fs')

readAndSplitWordlist().catch((error) => {console.error(error)})
readMatrix('piggy.txt').catch((error) => {console.error(error)})

async function readAndSplitWordlist(filename = './wordlist.txt') {
  const wordlist = (await loadFile(filename).catch(() => {throw new Error('Failed to load wordlist')})).split(
    /\r?\n/
  )
  console.log(wordlist)
  return wordlist
}

async function readMatrix(filename) {
  const rawText = (await loadFile(filename).catch(()=>{throw new Error('Failed to load matrix')})).trim()
  const linesArray = rawText.split(/\r?\n/).map((line) => line.trim().split(' '))
  const mazetrix = linesArray.slice(1)
  // console.log(linesArray)
  console.log(mazetrix)
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
