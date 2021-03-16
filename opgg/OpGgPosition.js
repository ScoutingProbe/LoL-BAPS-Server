const TextToJson = require('../text_to_json/TextToJson')
const https = require('https')
const path = require('path')
const util = require('util')
const fs = require('fs')
const cheerio = require('cheerio')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function OpGgPosition(position, indexTheirTeam){
	this.position = position
	this.indexTheirTeam = indexTheirTeam
}

OpGgPosition.prototype.main = async function(){
	let tt = await readFile(path.resolve("opgg", `${this.indexTheirTeam}.json`), "utf-8")
  tt = JSON.parse(tt)

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const championName = ttj.champion_json[tt.championId].toLowerCase()

  if(championName == undefined){
    return
  }

  switch(this.position){
    case "Bottom": this.position = "bot"; break
    case "Support": this.position = "support"; break
    case "Middle": this.position = "mid"; break
    case "Jungle": this.position = "jungle"; break
    case "Top": this.position = "top"; break
  }
  tt.assignedPosition = this.position

  console.log(`${this.position} ${this.indexTheirTeam} ${championName}`)

  const url = `https://na.op.gg/champion/${championName}/statistics/${this.position}`

  console.log(url)
  const index = this.indexTheirTeam
  let p = new Promise(function(resolve, reject) {
  	https.get(url, function(res){
  		const { statusCode } = res
  		const contentType = res.headers['content-type']
  		res.setEncoding('utf8')

  		let error
  		if (statusCode !== 200){
  			error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
  		}
  		if (error) {
  			console.error(error.message)
  			res.resume()
  			reject(error)
  		}
  		
  		let rawData = ''
  		res.on('data', function(chunk) { rawData += chunk})
  		res.on('end', async function(){
  			const $ = cheerio.load(rawData)
        let text_array = $("tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)").text().replace(/\t/g, '').split('\n\n')
        text_array[0] = text_array[0].replace(/\n\g/, '')
        text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

        console.log(text_array)

        if(text_array.length == 1) {
        	tt.ban1 = "opgg"
        	tt.ban2 = "not"
        	tt.ban3 = "found"
        } else {
        	tt.ban1 = text_array[0]
        	tt.ban2 = text_array[1]
        	tt.ban3 = text_array[2]
        }


        console.log(tt)
        console.log(index)
        await writeFile(path.resolve("opgg", `${index}.json`), JSON.stringify(tt))
        resolve()
  		})

  	})
  })
  return await p
}


module.exports = OpGgPosition