const fs = require('fs')
const os = require('os')
const util = require('util')
const path = require('path')
const https = require('https')
const cheerio = require('cheerio')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const get = util.promisify(https.get)

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

  let urls = await (await readFile(path.resolve("scripts", 'champion-id.txt'), 'utf-8')).split("\n")
  urls = urls.map((v, i, a)=>{return v.split(' ')[0].toLowerCase()})
  urls = urls.map((v, i, a)=>{return [`https://na.op.gg/champion/${v}/statistics`, v]})
  // console.log(urls)

  for(i in urls){
    console.log(urls[i])
    await get(urls[i][0], async function(response){
      const { statusCode } = response
      response.setEncoding('utf8')
      console.log(statusCode)
      let error
      if(statusCode !== 301)
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      
      if(error){
        console.error(error.message)
        response.resume()
      }
      console.log(`https://na.op.gg${response.headers.location}`)
      
      await get(`https://na.op.gg${response.headers.location}`, async function(response){
        const { statusCode } = response
        response.setEncoding('utf8')
        console.log(statusCode)
        let error
        if(statusCode !== 200)
          error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)

        if(error){
          console.error(error.message)
          response.resume()
        }

        let rawData = ''
        response.on('data', (chunk)=>{rawData += chunk})
        response.on('end', ()=>{
          const $ = cheerio.load(rawData)
          let roles = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
          for(j in roles){
            switch(roles[j]){
              case "Top"    : positions.top.push(urls[i][1]); break
              case "Middle" : positions.middle.push(urls[i][1]); break
              case "Bottom" : positions.bottom.push(urls[i][1]); break
              case "Jungle" : positions.jungle.push(urls[i][1]); break
              case "Support": positions.utility.push(urls[i][1]); break
            }
          }
          
          console.log(positions)

        }).on('error', (e)=>{
          console.error(e.message)
        }) // response end
      }) // second get
    }) // first get
  } // for
  console.log(urls)

  writeFile(path.resolve("scripts", "positions.json"), JSON.stringify(positions))
  return positions
}

module.exports = Allocator