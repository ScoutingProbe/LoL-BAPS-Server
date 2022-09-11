const OpGgDao = require('../dao/OpGgDao')
const https = require('https')
const path = require('path')
const util = require('util')
const fs = require('fs')
const cheerio = require('cheerio')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function OpGgTierService(){
}

// OpGgPositionService.prototype.mainn = async function(){
// 	let league = await readFile(path.resolve("cache", `${this.file}.json`), "utf-8")
//   league = JSON.parse(league)
 
//   // console.log(league)

//   let opggdao = new OpGgDao()
//   await opggdao.readChampionId()

//   // if(league.championId == undefined && league.championPickIntent == undefined){
//   //   return 
//   // }

//   const lci = league.championId          //0, 1-500
//   const lpi = league.championPickIntent  //0, 1-500

//   const championId = lci == "0" ? lpi : lci

//   let championName = opggdao.champion_json[championId].toLowerCase()

//   if(championName == undefined){
//     return
//   }

//   championName = championName.toLowerCase()

//   switch(this.position){ 
//     case "Bottom": this.position = "bot"; break
//     case "Support": this.position = "support"; break
//     case "Middle": this.position = "mid"; break
//     case "Jungle": this.position = "jungle"; break
//     case "Top": this.position = "top"; break
//   }

//   league.assignedPosition = this.position

//   const url = `https://na.op.gg/champion/${championName}/statistics/${this.position}/build`
  
//   console.log(url)
//   console.log(`${this.position} ${this.file} ${championName}`)

//   let p = new Promise((resolve, reject)=>{
//   	https.get(url, (res) => {
//   		const { statusCode } = res
//   		const contentType = res.headers['content-type']
//   		res.setEncoding('utf8')

//   		let error
//   		if (statusCode !== 200){
//   			error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
//   		}
//   		if (error) {
//   			console.error(error.message)
//   			res.resume()
//   			reject(error)
//   		}
  		
//   		let rawData = ''
//   		res.on('data', function(chunk) { rawData += chunk})
//   		res.on('end', async ()=> {
//   			const $ = cheerio.load(rawData)
//         let counters = $("tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)").text().replace(/\t/g, '').split('\n\n')
//         counters[0] = counters[0].replace(/\n/g, '')
//         counters[counters.length - 1] = counters[counters.length-1].replace(/\n/g, '')

//         console.log(counters)
//         console.log("-------------------------------------------------------")

//         if(counters.length == 1) {
//           console.log(url)
//           console.log(`OpGgPositionService#main(${this.position} ${this.file} ${championName})`)
//         	league.counters = []
//         } else {
//           league.counters = counters
//         }

//         // console.log(`${this.file}.json ${JSON.stringify(tt)}`)

//         await writeFile(path.resolve("cache", `${this.file}.json`), JSON.stringify(league))
//         resolve()
//   		})

//   	})
//   })
//   return await p
// }

OpGgTierService.prototype.main = async function(){
  let past = await readFile(path.resolve("cache", "tiers-update-time.txt"), "utf-8")
  past = new Date(past)
  
  const present = new Date()
  
  const difference = present - past

  console.log(difference)

  if(difference < 600000){
    return past.toLocaleString()
  }

  let region = await readFile(path.resolve("config", "opgg-region.txt"), "utf-8")
  region = region.split("\n")[14]
  let tier = await readFile(path.resolve("config", "opgg-tier.txt"), "utf-8")
  tier = tier.split("\n")[16]

  console.log(`${region} ${tier}`)

  const opggdao = new OpGgDao()

  await writeFile(
    path.resolve("cache", "tiers-support.json"), 
    JSON.stringify(await opggdao.requestTiers(region, tier, 'support'))
  )

  await writeFile(
    path.resolve("cache", "tiers-adc.json"), 
    JSON.stringify(await opggdao.requestTiers(region, tier, 'adc'))
  )

  await writeFile(
    path.resolve("cache", "tiers-mid.json"), 
    JSON.stringify(await opggdao.requestTiers(region, tier, 'mid'))
  )

  await writeFile(
    path.resolve("cache", "tiers-jungle.json"), 
    JSON.stringify(await opggdao.requestTiers(region, tier, 'jungle'))
  )

  await writeFile(
    path.resolve("cache", "tiers-top.json"), 
    JSON.stringify(await opggdao.requestTiers(region, tier, 'top'))
  )

  await writeFile(
    path.resolve("cache", "tiers-update-time.txt"),
    present.toISOString()
  )

  return present.toLocaleString()

	// let league = await readFile(path.resolve("cache", `${this.file}.json`), "utf-8")
  // league = JSON.parse(league)
 
  // console.log(league)

  // let opggdao = new OpGgDao()
  // await opggdao.readChampionId()

  // // if(league.championId == undefined && league.championPickIntent == undefined){
  // //   return 
  // // }

  // const lci = league.championId          //0, 1-500`
  // const lpi = league.championPickIntent  //0, 1-500

  // const championId = lci == "0" ? lpi : lci

  // let championName = opggdao.champion_json[championId].toLowerCase()

  // if(championName == undefined){
  //   return
  // }

  // championName = championName.toLowerCase()

  // switch(this.position){ 
  //   case "Bottom": this.position = "adc"; break
  //   case "Support": this.position = "support"; break
  //   case "Middle": this.position = "mid"; break
  //   case "Jungle": this.position = "jungle"; break
  //   case "Top": this.position = "top"; break
  // }

  // league.assignedPosition = this.position

  // const url = `https://na.op.gg/champion/${championName}/${this.position}/build`
  
  // console.log(url)
  // console.log(`${this.position} ${this.file} ${championName}`)

  // const cl = await opggdao.requestCounters(championName, this.position)

  // console.log(cl)

  // league.counters = []
  // league.counters = counters
  // await writeFile(path.resolve("cache", `${this.file}.json`), JSON.stringify(league))
}

module.exports = OpGgTierService