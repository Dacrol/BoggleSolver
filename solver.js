const fs = require('fs')
const Stopwatch = require('./stopwatch')
;(async () => {
  let wordlist = await readAndSplitWordlist()
  let challenge = await readMatrix('line.txt')
  let graph = createGraph(challenge.matrix)
  let uniqueChars = [...new Set(graph.map(node => node.char))].join('')
  wordlist = initialFilterWordlist(wordlist, uniqueChars)
  const startNode =
    graph[
      challenge.startPosition[0] * challenge.matrix[0].length +
        challenge.startPosition[1]
    ]
  // var results = Stopwatch.decorate(findWordFrom, { label: '1', queueLog: true })(startNode, wordlist, [startNode], true)
  // console.log('\n\nWord found: ', results)

  let results = Stopwatch.decorate(recursiveWordTraversal)(
    startNode,
    wordlist,
    graph.length
  )
  // let results = Stopwatch.decorate(recursiveBreadthFirstSearch)(startNode, wordlist)
  console.log(results)
})().catch(error => {
  console.error(error)
})

var count = 0

function recursiveWordTraversal(
  startNode,
  wordlist,
  targetSize,
  { forbiddenNodes = [], previousWords = [] } = {}
) {
  count++
  const words = recursiveBreadthFirstSearch(startNode, wordlist, {
    forbiddenNodes:
      forbiddenNodes.length > 0 ? forbiddenNodes.slice() : undefined
  })
  if (words.filter(word => word.nextNodes.length === 0)) {
    let result = words.find(
      word =>
        word.nextNodes.length === 0 &&
        (word.word + previousWords.join('')).length === targetSize
    )
    if (result) console.log(previousWords.join(' ') + ' ' + result.word, count)
  }
  words.map(word =>
    word.nextNodes.map(node =>
      recursiveWordTraversal(node, wordlist, targetSize, {
        forbiddenNodes: [...word.path, node],
        previousWords: [...previousWords, word.word]
      })
    )
  )
}

function recursiveBreadthFirstSearch(
  startNode,
  wordlist,
  {
    forbiddenNodes = [startNode],
    currentWord = startNode.char,
    foundWords = []
  } = {}
) {
  const filteredWordlist = wordlist.filter(word => word.startsWith(currentWord))
  if (wordlist.includes(currentWord))
    foundWords.push({
      word: currentWord,
      path: forbiddenNodes,
      nextNodes: getAllowedEdges(startNode, forbiddenNodes)
    })
  if (filteredWordlist.length <= 1) return foundWords
  getAllowedEdges(startNode, forbiddenNodes).forEach(edge =>
    recursiveBreadthFirstSearch(edge, filteredWordlist, {
      forbiddenNodes: [...forbiddenNodes, edge],
      currentWord: currentWord + edge.char,
      foundWords: foundWords
    })
  )
  return foundWords
}

function getAllowedEdges(node, forbiddenNodes) {
  return node.edges.filter(edge => !forbiddenNodes.includes(edge))
}

function findWordFrom(
  startNode,
  wordlist,
  forbiddenNodes = [startNode],
  firstRun = false
) {
  let currentNode = startNode
  let currentWord = firstRun ? currentNode.char : ''
  let path = firstRun ? [currentNode] : []
  const step = function*(nextEdge = 0) {
    if (nextEdge === currentNode.edges.length) return
    let nextNode = currentNode.edges[nextEdge]
    if (!forbiddenNodes.includes(nextNode)) var deepen = yield nextNode
    yield* step(deepen ? ((currentNode = nextNode), 0) : nextEdge + 1)
  }
  const stepper = step()
  let deepen = false
  for (let index = 0; index < 100; index++) {
    let nextStep = stepper.next(deepen)
    console.log(nextStep, currentWord)
    if (nextStep.done) break
    deepen = false
    forbiddenNodes.push(nextStep.value)
    let char = nextStep.value.char
    let filteredWordlist = wordlist.filter(word =>
      word.startsWith(currentWord + char)
    )
    // console.log(filteredWordlist.length)
    // console.log(currentWord)
    if (filteredWordlist.length > 0) {
      path.push(nextStep.value)
      currentWord += char
      deepen = true
    }
  }
  return [currentNode, path, currentWord]
}

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
function initialFilterWordlist(wordlist, contains) {
  const regex = new RegExp('\\b[' + contains + ']+\\b')
  return wordlist.filter(word => regex.test(word))
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
