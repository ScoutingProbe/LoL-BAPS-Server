const fs = require('fs')
const util = require('util')
const path = require('path')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function TextToJson() {
  this.championJson = {}
}

TextToJson.prototype.readChampionId = async function(){
  const championDocument = await readFile(path.resolve("resources", 'champion-id.txt'), 'utf-8')
  const championDocumentLines = championDocument.split('\n')
  // console.log(championDocumentLines)
  let championJson = {}
  for(let i = 0; i < championDocumentLines.length; i++){
    const championDocumentLinePair = championDocumentLines[i].split(' ')
    const championName = championDocumentLinePair[0]
    const championNumber = championDocumentLinePair[1]
    // console.log(`${championName} ${championNumber}`)
    championJson[championNumber] = championName
  }
  return championJson
}

module.exports = TextToJson