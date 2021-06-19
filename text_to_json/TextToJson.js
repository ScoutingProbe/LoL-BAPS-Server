const fs = require('fs')
const util = require('util')
const path = require('path')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function TextToJson() {
}

TextToJson.prototype.readChampionId = async function(){
  const championDocument = await readFile(path.resolve("text_to_json", 'champion-id.txt'), 'utf-8')
  const championDocumentLines = championDocument.split('\r\n') //#windows
  //const championDocumentLines = championDocument.split('\n') //#mac
  // console.log(championDocumentLines)
  let championJson = {}
  for(let i = 0; i < championDocumentLines.length; i++){
    const championDocumentLinePair = championDocumentLines[i].split(' ')
    const championName = championDocumentLinePair[0]
    const championNumber = championDocumentLinePair[1]
    // console.log(`${championName} ${championNumber}`)
    championJson[championNumber] = championName
  }
  this.champion_json = championJson
}

TextToJson.prototype.writeChampionId = async function(){
  await writeFile(path.resolve("text_to_json", "champion-id.json"), JSON.stringify(this.champion_json))
  console.log(this.champion_json)
}

module.exports = TextToJson