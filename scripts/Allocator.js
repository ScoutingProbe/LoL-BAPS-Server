const fs = require('fs')
const os = require('os')
const util = require('util')
const path = require('path')
const https = require('https')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function Allocator() {
}

Allocator.prototype.readChampionId = async function(){
  const championDocument = await readFile(path.resolve("scripts", 'champion-id.txt'), 'utf-8')
  const championDocumentLines = championDocument.split("\n") 
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

Allocator.prototype.writeChampionId = async function(){
  await writeFile(path.resolve("scripts", "champion-id.json"), JSON.stringify(this.champion_json))
  console.log(this.champion_json)
}

Allocator.prototype.createPositions = async function(){
  let positions = {
    "top" : [],
    "middle" : [],
    "bottom" : [],
    "jungle" : [],
    "utility" : []
  }

  let a = await readFile(path.resolve("scripts", 'champion-id.txt'), 'utf-8')
  a = a.split("\n")
  for(let i = 0; i < a.length; i++){
    const name = a[i].split(' ')[0]

    let url = 'https://na.op.gg/champion/!/statistics'
    url = url.replace('!', name)
    console.log(url)
    https.get(url, function(res){
      console.log(res.headers)
      console.log(url)
      const { statusCode } = res
      res.setEncoding('utf8')

      console.log(statusCode)
      let error
      if (statusCode !== 200 && statusCode !== 301){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }

      if(error){
        console.log(error.message)
        res.resume()
        return
      }

      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk; })
      res.on('end', () => {
        console.log(rawData)
      })

      console.log(url)
      url = `https://na.op.gg${res.headers.location}`
      console.log(url)

      return positions
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    }); // end first https
  } // end name for
  console.log(positions)
  writeFile(path.resolve("scripts", "positions.json"), JSON.stringify(positions))
  return positions
}

module.exports = Allocator