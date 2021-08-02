const fs = require('fs')
const util = require('util')
const path = require('path')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function Skinner() {
}

Skinner.prototype.readReckoning = async function(){
  const championDocument = await readFile(path.resolve("skins", 'reckoning.json'), 'utf-8')
  const championDocumentLines = championDocument.split('\r\n') //#windows
  //const championDocumentLines = championDocument.split('\n') //#mac
  console.log(championDocumentLines)
  let championJson = {}
  for(let i = 0; i < championDocumentLines.length; i++){
    const championDocumentLinePair = championDocumentLines[i].split(' ')
    const championName = championDocumentLinePair[0]
    const championNumber = championDocumentLinePair[1]
    console.log(`${championName} ${championNumber}`)
    championJson[championNumber] = championName
  }
  this.reckoning = championJson
}

module.exports = Skinner