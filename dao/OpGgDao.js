const fs = require('fs')
const os = require('os')
const util = require('util')
const path = require('path')
const https = require('https')
const cheerio = require('cheerio')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function OpGgDao() {
}

OpGgDao.prototype.readChampionId = async function(){
  const championDocument = await readFile(path.resolve("cache", 'RiotChampionsIDs.txt'), 'utf-8')
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

OpGgDao.prototype.writeChampionId = async function(){
  await writeFile(path.resolve("cache", "RiotChampionsIDs.json"), JSON.stringify(this.champion_json))
  console.log(this.champion_json)
}

OpGgDao.prototype.createPositions = async function(){
  await fs.readFile(path.resolve('cache', 'OpGgChampions.html'), 'utf8', function(error, data){
    if(error) {
      console.error(error)
      return
    }

    let positions = {
      "top" : [],
      "mid" : [],
      "adc" : [],
      "jungle" : [],
      "support" : []
    }

    const $ = cheerio.load(data)

    for(let i = 2; i < 316; i += 2){
      // console.log($(`body > a:nth-child(${i}) > span > strong`).text())
      // console.log($(`body > a:nth-child(${i}) > span > small`).text())
      
      const name = $(`body > a:nth-child(${i}) > span > strong`).text()
      let roles = $(`body > a:nth-child(${i}) > span > small`).text()
      roles = roles.split(',')
      for(let role of roles){
        // console.log(`${role} ${name}`)
        switch(role){
          case 'Top': positions.top.push(name); break
          case 'Middle': positions.mid.push(name); break
          case 'Bottom': positions.adc.push(name); break
          case 'Jungle': positions.jungle.push(name); break
          case 'Support': positions.support.push(name); break
        }
      }

      fs.writeFile(path.resolve('cache', 'OpGgPositions.json'), JSON.stringify(positions), function(error){
        if(error){
          console.error(error)
          return
        }
      })
    }
    this.positions = positions
    console.log(positions)
  })
}

OpGgDao.prototype.writeCounter = async function(name, role){
let url = `https://na.op.gg/champions/${name}/${role}/counters`
  console.log(`${url} request sent x)`)
  const p = new Promise((resolve, reject)=>{
    https.get(url, (response)=>{
      response.setEncoding('utf8')
      if(response.statusCode != 200)
        reject(response.statusCode)
      else if(response.statusCode == 200){
        let data = ''
        response.on('data', (chunk)=> data += chunk)
        response.on('error', (error)=> console.log(error))
        response.on('end', ()=>{
          const $ = cheerio.load(data)
          let counters = []
          let wins = []
          let playeds = []
          $('div.info > div.name').each(function(i, el){
            counters.push($(this).text())
          })
          $('span.win').each(function(i, el){
            wins.push($(this).text())
          })
          $('span.played-count').each(function(i, el){
            playeds.push($(this).text())
          })

          let arr = []
          for(let i = 0; i < counters.length; i ++){
            arr.push(
              {
                'counter': counters[i],
                'win': wins[i],
                'played': playeds[i]
              }
            )
          }

          arr.sort((a, b) => {
            let winA = a.win.replace('%', '')
            let winB = b.win.replace('%', '')

            winA = parseFloat(winA)
            winB = parseFloat(winB)
            
            return winB - winA
          })

          console.log(`request complete xD\n${JSON.stringify(arr)}`)
          fs.writeFile(path.resolve('cache', `${name}-${role}.json`), JSON.stringify(arr), () => resolve(counters))
        })
        
      }
    })
  })
  return await p
}

module.exports = OpGgDao