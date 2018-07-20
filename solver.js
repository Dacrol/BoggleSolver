const fs = require('fs')


function createGraph(matrix) {
  const [yDim, xDim] = [matrix.length, matrix[0].length]
  let nodes = matrix.reduce(
    (acc, line) =>
      acc.concat(
        line.map(char => {
          return { char: char, edges: [] }
        })
      ),
    []
  )
  nodes.forEach((node, index, nodes) => {
    if (index >= xDim) {
      node.edges.push(nodes[index - xDim])
    }
    if ((index + 1) % xDim !== 0) {
      node.edges.push(nodes[index + 1])
    }
    if (index < xDim * (yDim - 1)) {
      node.edges.push(nodes[index + xDim])
    }
    if (index % xDim !== 0) {
      node.edges.push(nodes[index - 1])
    }
  })
  return nodes
}

// Returns a new wordlist with only the words that contain the given letters
function filterWordlist(wordlist, contains) {
  const regex = new RegExp('\\b[' + contains + ']+\\b', 'g')
  console.log(regex)
  return wordlist.filter((word) => regex.test(word))
}

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
