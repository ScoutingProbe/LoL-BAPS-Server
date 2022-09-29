const OpGgDao = require('../dao/OpGgDao')
const https = require('https')
const path = require('path')
const util = require('util')
const fs = require('fs')
const cheerio = require('cheerio')
const { json } = require('express')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function OpGgService(league){
  this.league = league
}

OpGgService.prototype.getBan = async function(file, index){
  try{
    const p = this.league.myTeam[index].championId
  }catch(e) {
    return
  }

  let om0 = await readFile(path.resolve("cache", file), "utf-8")
  om0 = JSON.parse(om0)
  // console.log(om0)

  const ob1 = om0.counters                           //undefined, defined
  const oci = om0.championId                          //0, 1-500
  const opi = om0.championPickIntent                  //0, 1-500
  
  // if(this.league.myTeam[index].summonerId != om0.summonerId){
  //   // await writeFile(path.resolve("cache", file), JSON.stringify(this.league.myTeam[index]))
  //   return
  // }

  const lci = this.league.myTeam[index].championId          //0, 1-500
  const lpi = this.league.myTeam[index].championPickIntent  //0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  if(eci && epi && ob1){
    this.league.myTeam[index] = om0
    return
  }

  let opggdao = new OpGgDao()
  await opggdao.readChampionId()
  const champion_json = opggdao.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){
    return
  }

  switch(this.league.myTeam[index].assignedPosition){
    case "bottom" : this.league.myTeam[index].assignedPosition = "adc"; break
    case "utility": this.league.myTeam[index].assignedPosition = "support"; break
    case "middle" : this.league.myTeam[index].assignedPosition = "mid"; break
    // default    : this.league.myTeam[i].assignedPosition = "mid"
  }

  // console.log(`${championId} ${championName} ${this.league.myTeam[index].assignedPosition}`)

  const cl = await opggdao.requestCounters(championName, this.league.myTeam[index].assignedPosition)
  let counters = cl[0]
  let possible_positions = cl[1]

  const tiers_support = JSON.parse(await readFile(path.resolve('cache', 'tiers-support.json')))
  const tiers_adc = JSON.parse(await readFile(path.resolve('cache', 'tiers-adc.json')))
  const tiers_mid = JSON.parse(await readFile(path.resolve('cache', 'tiers-mid.json')))
  const tiers_jungle = JSON.parse(await readFile(path.resolve('cache', 'tiers-jungle.json')))
  const tiers_top = JSON.parse(await readFile(path.resolve('cache', 'tiers-top.json')))

  // console.log(cl)

  for(let counter of counters){
    switch(this.league.myTeam[index].assignedPosition){
      case "adc":
        for(let tier of tiers_adc){
          if(counter.counter == tier[0]){
            // console.log(`${counter.counter} ${tier[0]} ${tier[1]} adc`)
            counter.tiers = [{'tier': tier[1], 'role': 'Bottom'}]
          }
        }
        break
      case "support":
        for(let tier of tiers_support){
          if(counter.counter == tier[0]){
            // console.log(`${counter.counter} ${tier[0]} ${tier[1]} support`)
            counter.tiers = [{'tier': tier[1], 'role': 'Support'}]
          }
        }
        break
      case "mid":
        for(let tier of tiers_mid){
          if(counter.counter == tier[0]){
            // console.log(`${counter.counter} ${tier[0]} ${tier[1]} mid`)
            counter.tiers = [{'tier': tier[1], 'role': 'Middle'}]
          }
        }
        break
      case "jungle":
        for(let tier of tiers_jungle){
          if(counter.counter == tier[0]){
            // console.log(`${counter.counter} ${tier[0]} ${tier[1]} jungle`)
            counter.tiers = [{'tier': tier[1], 'role': 'Jungle'}]
          }
        }
        break
      case "top":
        for(let tier of tiers_top){
          if(counter.counter == tier[0]){
            // console.log(`${counter.counter} ${tier[0]} ${tier[1]} top`)
            counter.tiers = [{'tier': tier[1], 'role': 'Top'}]
          }
        }
        break
      // default
    }
  }
  

  // switch(roles[0]){
  //   case "Top"    : this.league.myTeam[index].assignedPosition = "top"; break
  //   case "Middle" : this.league.myTeam[index].assignedPosition = "middle"; break
  //   case "Jungle" : this.league.myTeam[index].assignedPosition = "jungle"; break
  //   case "Support": this.league.myTeam[index].assignedPosition = "support"; break
  //   case "Bottom" : this.league.myTeam[index].assignedPosition = "bot"; break
  // }
  
  // needs error catching
  // if(cl[0].length == 0){

  // }

  // if(cl[1].length = 0){

  // }

  this.league.myTeam[index].counters = counters
  this.league.myTeam[index].possiblePositions = possible_positions

  writeFile(path.resolve("cache", file), JSON.stringify(this.league.myTeam[index]))
  return this.league
}

OpGgService.prototype.getPick = async function(file, index){
  try{
    const p = this.league.theirTeam[index].championId
  }catch(e){
    return
  }

  let ot0 = await readFile(path.resolve("cache", file), "utf-8")
  ot0 = JSON.parse(ot0)

  //console.log(ot0)
  //console.log(this.league.theirTeam[index])

  const tb1 = ot0.counters
  const tci = ot0.championId
  const lci = this.league.theirTeam[index].championId               //0, 1-500
  
  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.league.theirTeam[index] = ot0
    return
  }

  let opggdao = new OpGgDao()
  await opggdao.readChampionId()
  const champion_json = opggdao.champion_json
  let championName = champion_json[lci]

  if(championName == undefined){
    return
  }  

  championName = championName.toLowerCase()
  // championName = championName.includes("'") ? championName.replace("'", "") : championName
  // championName = championName.includes(". ") ? championName.replace(". ", "") : championName
  // championName = championName.includes(" ") ? championName.replace(" ", "") : championName
  // championName = championName == 'nunu& willump' ? 'nunu' : championName
  // championName = championName == 'renata glasc' ? 'renata' : championName
  // championName = championName == 'wukong' ? 'monkeyking' : championName

  const opggPositions = JSON.parse(await readFile(path.resolve('cache', 'OpGgPositions.json'), 'utf-8'))

  let position = ''
  for(let p in opggPositions){
    for(let c of opggPositions[p]){
      c = c.toLowerCase()
      c = c.includes("'") ? c.replace("'", "") : c
      c = c.includes(". ") ? c.replace(". ", "") : c
      c = c.includes(" ") ? c.replace(" ", "") : c
      c = c == 'nunu& willump' ? 'nunu' : c
      c = c == 'renata glasc' ? 'renata' : c
      c = c == 'wukong' ? 'monkeyking' : c
      // console.log(`${championName} ${p} ${c}`)
      if(championName == c){
        console.log(`${championName} ${p}`)
        position = p
      }
    }
  }

  const cl = await opggdao.requestCounters(championName, position)

  // console.log(cl)

  this.league.theirTeam[index].counters = cl[0]
  this.league.theirTeam[index].assignedPosition = cl[1][0]
  this.league.theirTeam[index].possiblePositions = cl[1]

  // if(cl[0].length == 0){

  // }

  // if(cl[1].length = 0){

  // }

  // console.log(this.league.theirTeam[index])

  writeFile(path.resolve("cache", file), JSON.stringify(this.league.theirTeam[index]))
  return this.league
}

OpGgService.prototype.getMatchup = async function(myTeamIndex, write, theirTeamOpen){
  try{
    const i = this.league.myTeam[myTeamIndex].championId
    const p = this.league.myTeam[myTeamIndex].championPickIntent
    if(i == 0 && p == 0)
      return
  } catch(e){
    return
  }

  let matchup = {}

  let opggdao = new OpGgDao()
  await opggdao.readChampionId()

  let url = 'https://na.op.gg/champion/!/statistics/@/matchup?targetChampionId=#'

  for(let i = 0; i < theirTeamOpen.length; i ++){ 
    console.log(`${theirTeamOpen[i].possiblePositions.length} ${i}`)
    
    if(theirTeamOpen[i].possiblePositions == undefined) {
      continue
    }
    console.log(`${theirTeamOpen[i].possiblePositions.length} ${i}`)
    console.log(theirTeamOpen[i])
    for(let j = 0; j < theirTeamOpen[i].possiblePositions.length; j++){
      if(theirTeamOpen[i].possiblePositions[j] == this.league.myTeam[myTeamIndex].assignedPosition){
        // console.log(theirTeamOpen[i])
        
        const susi = theirTeamOpen[i].championId
        const susp = theirTeamOpen[i].championPickIntent
        const sus  = susi == 0 ? susp : susi

        const ouri = this.league.myTeam[myTeamIndex].championId
        const ourp = this.league.myTeam[myTeamIndex].championPickIntent
        const our  = ouri == 0 ? ourp : ouri

        theirTeamOpen.splice(i, 1)

        matchup.myTeam = opggdao.champion_json[our]
        matchup.theirTeam = opggdao.champion_json[sus]

        url = url.replace('!', matchup.myTeam)
                  .replace('@', this.league.myTeam[myTeamIndex].assignedPosition)
                  .replace('#', sus) 
      } // if theirPosition equals ourPosition
    } // loops jungle support top mid bot
  } // loops theirTeam0 theirTeam1 theirTeam2 theirTeam3 theirTeam4 theirTeam5
  
  if(matchup.myTeam == undefined){
    const susi = theirTeamOpen[0].championId
    const susp = theirTeamOpen[0].championPickIntent
    const sus  = susi == 0 ? susp : susi

    const ouri = this.league.myTeam[myTeamIndex].championId
    const ourp = this.league.myTeam[myTeamIndex].championPickIntent
    const our  = ouri == 0 ? ourp : ouri

    theirTeamOpen.splice(0, 1)

    matchup.myTeam = opggdao.champion_json[our]
    matchup.theirTeam = opggdao.champion_json[sus]

    url = url.replace('!', matchup.myTeam)
              .replace('@', this.league.myTeam[myTeamIndex].assignedPosition)
              .replace('#', sus)
  }

  // console.log(theirTeamOpen)
  console.log(url)
  const p = new Promise((resolve, reject)=>{
    https.get(url, (res)=>{
      const { statusCode } = res
      res.setEncoding('utf8')

      let error
      if (statusCode !== 200){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }

      if(error){
        console.error(error.message)
        res.resume()
        reject()
      }
      
      let rawData = ''
      res.on('data', (chunk) => {rawData += chunk})
      res.on('end', () => {
        const $ = cheerio.load(rawData)
        let w = $('tbody > tr:nth-child(4) > td:nth-child(1)').text().replace(/\n/g, '').replace(/\t/g, '')
        let p = $('tbody > tr:nth-child(5) > td:nth-child(1)').text().replace(/\n/g, '').replace(/\t/g, '')
        if(p.includes('%') == false){
            w = $('tbody > tr:nth-child(6) > td:nth-child(1)').text().replace(/\n/g, '').replace(/\t/g, '')
            p = $('tbody > tr:nth-child(7) > td:nth-child(1)').text().replace(/\n/g, '').replace(/\t/g, '')
        }

        console.log(`${w} ${p}`)

        matchup.winRatio = w
        matchup.positionWinRate = p

        if(this.league.matchups == undefined)
          this.league.matchups = []
        
        this.league.matchups[myTeamIndex] = matchup

        console.log(matchup)
        // console.log(theirTeamOpen)
        // console.log(theirTeamOpen.length)
        console.log("-------------------------------------------------------")
        resolve(theirTeamOpen)
      }) // response
    }) // https
  }) // promise
  return await p 
}

// OpGgService.prototype.getMatchup = async function(file, key){
//   try{
//     const o = this.league.matchups.key.myTeam.championId
//   }catch(e){
//     console.log(`OpGgService#getMatchup Cannot find my champion ${file} ${key}`)
//     return
//   }
//   try{
//     const o = this.league.matchups.key.theirTeam.championId
//   } catch(e){
//     console.log(`OpGgService#getMatchup Cannot find their champion ${file} ${key}`)
//     return
//   }

//   const w = await readFile(path.resolve("cache", file), "utf-8")

//   let opggdao = new OpGgDao()
//   await opggdao.readChampionId()
//   const champion_json = opggdao.champion_json
//   const championName = champion_json[this.league.matchups.key.myTeam.championId].toLowerCase()

//   const url = `https://na.op.gg/champion/${championName}/statistics/${this.league.matchups.key.myTeam.assignedPosition}/matchup?targetChampionId=${this.league.matchups.key.theirTeam.championId}`
//   // https://na.op.gg/champion/aatrox/statistics/top/matchup?targetChampionId=41
//   console.log(url)

//   let p = new Promise((resolve,reject)=>{
//     https.get(url, (res) => {
//       const { statusCode } = res
//       const contentType = res.headers['content-type']

//       let error
//       if(statusCode !== 200)
//         error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
//       if(error){
//         console.error(error.message)
//         res.resume()
//         reject(error)
//       }

//       res.setEncoding('utf8')
//       let rawData = ''
//       res.on('data', (chunk) => rawData += chunk )
//       res.on('end', () => {
//         const $ = cheerio.load(rawData)

//         const dmg2Champs = $("tbody > tr:nth-child(4) > td:nth-child(1)").text().replace(/\t/g, '').replace(/\n/g, '')
//         const winRatio   = $("tbody > tr:nth-child(6) > td.champion-matchup-data.champion-matchup-data--win").text().replace(/\t/g, '').replace(/\n/g, '')

//         console.log(dmg2Champs)
//         console.log(winRatio)

//         this.league.matchups.key.winRatio = winRatio

//         console.log(this.league.matchups.key.winRatio)
//         writeFile(path.resolve("cache", key), JSON.stringify(this.league.matchups.key))
//         resolve(this.league)
//       })
//     }).on('error', function(e) {
//       console.error(`Got error: ${e.message}`)
//       reject(e)
//     })
//   })

//   return await p
// }

// OpGgService.prototype.setMatchups = async function(){
//   try{
//     const p = this.league.myTeam[0].assignedPosition
//   }catch(e){
//     console.log(`No game log found`)
//     return
//   }

//   this.league.theirTeam[0] = JSON.parse(await readFile(path.resolve("cache", "theirTeam0.json"), "utf-8"))
//   this.league.theirTeam[1] = JSON.parse(await readFile(path.resolve("cache", "theirTeam1.json"), "utf-8"))
//   this.league.theirTeam[2] = JSON.parse(await readFile(path.resolve("cache", "theirTeam2.json"), "utf-8"))
//   this.league.theirTeam[3] = JSON.parse(await readFile(path.resolve("cache", "theirTeam3.json"), "utf-8"))
//   this.league.theirTeam[4] = JSON.parse(await readFile(path.resolve("cache", "theirTeam4.json"), "utf-8"))

//   let matchups_not_found = []
//   let matchups = {}

//   let mti, mmi, mbi, mji, msi
//   let tti, tmi, tbi, tji, tsi

//   for(let i = 0; i < 5; i++){
//     try{
//       const p = this.league.theirTeam[i].assignedPosition
//     }catch(e){
//       console.log(`OpGgService#setMatchups Cannot find assignedPosition ${this.league.theirTeam[i]}`)
//       continue
//     }

//     switch(this.league.myTeam[i].assignedPosition){
//       case "top":       
//         matchups["top"] = {"myTeam": this.league.myTeam[i]}
//         mti = i
//         break
//       case "middle":    
//         matchups["mid"] = {"myTeam": this.league.myTeam[i]}
//         mmi = i
//         break
//       case "bottom":    
//         matchups["bot"] = {"myTeam": this.league.myTeam[i]}
//         mbi = i ; 
//         break
//       case "jungle":
//         matchups["jungle"]  = {"myTeam": this.league.myTeam[i]}
//         mji = i
//         break
//       case "utility":
//         matchups["support"] = {"myTeam": this.league.myTeam[i]}
//         msi = i
//         break
//     }
//   }

//   // console.log(matchups)
//   // console.log(matchups_not_found)

//   //let tti, tmi, tbi, tji, tsi
//   for(let i = 0; i < 5; i++){
//     switch(this.league.theirTeam[i].assignedPosition){
//       case "top":
//         matchups.top.theirTeam = this.league.theirTeam[i]
//         // this.setMatchup("top.json", "top")
//         tti = i
//         break
//       case "mid":     
//         matchups.mid.theirTeam = this.league.theirTeam[i]
//         // this.setMatchup("mid.json", "mid"); 
//         tmi = i
//         break  
//       case "bot":     
//         matchups.bot.theirTeam = this.league.theirTeam[i]
//         // this.setMatchup("bot.json", "bot"); 
//         tbi = i
//           break     
//       case "jungle":  
//         matchups.jungle.theirTeam = this.league.theirTeam[i]
//         // this.setMatchup("jungle.json", "jungle"); 
//         tji = i
//           break
//       case "support": 
//         matchups.support.theirTeam = this.league.theirTeam[i]
//         // this.setMatchup("support.json", "support"); 
//         tsi = i
//           break
//       default: 
//         matchups_not_found.push(this.league.theirTeam[i]); 
//         break
//     }
//   }

//   await writeFile(path.resolve("cache", "jungle.json"), JSON.stringify(matchups.jungle))
//   await writeFile(path.resolve("cache", "support.json"), JSON.stringify(matchups.support))
//   await writeFile(path.resolve("cache", "top.json"), JSON.stringify(matchups.top))
//   await writeFile(path.resolve("cache", "mid.json"), JSON.stringify(matchups.mid))
//   await writeFile(path.resolve("cache", "bot.json"), JSON.stringify(matchups.bot))

//   console.log(matchups)
//   console.log(matchups_not_found)

//   this.league.matchups = matchups
// }
  
module.exports = OpGgService
// function doRequest(url){
//   return new Promise((resolve, reject)=>{
//     https.get(url, (res) => {
//       const { statusCode } = res;
//       const contentType = res.headers['content-type'];
      
//       let error;
//       // Any 2xx status code signals a successful response but
//       // here we're only checking for 200.
//       if (statusCode !== 200) {
//         error = new Error('Request Failed.\n' +
//         `Status Code: ${statusCode}`);
//         console.log(res.headers.location)
//       }
//       if (error) {
//         console.error(error.message);
//         // Consume response data to free up memory
//         res.resume();
//         return;
//       }
      
//       res.setEncoding('utf8');
//       let rawData = '';
//       res.on('data', (chunk) => { rawData += chunk; });
//       res.on('end', () => {
//         resolve(rawData)
//       });
//     }).on('error', (e) => {
//       console.error(`Got error: ${e.message}`);
//       reject(e)
//     });
//   })
// }
