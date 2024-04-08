const OpGgDao = require('../dao/OpGgDao')
const https = require('https')
const path = require('path')
const util = require('util')
const fs = require('fs')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function OpGgService(league){
  this.op_gg_augmented_league = league
}

OpGgService.prototype.getGameResult = async function(isGameComplete){
  if(isGameComplete == false || this.op_gg_augmented_league.myTeam == undefined)
    return

  const gameID = await readFile(path.resolve("cache", "gameID.txt"), "utf-8")
  if(gameID == '0')
    return
  
  try{
    await readFile(path.resolve("lake", `${gameID}.json`), "utf-8")
  } catch(e){
    await writeFile(path.resolve("lake", `${gameID}.json`), JSON.stringify(this.op_gg_augmented_league))
  }
  const op_gg_json = await readFile(path.resolve("lake", `${gameID}.json`), "utf-8")
  // console.log(`${gameID} ${JSON.parse(op_gg_json).gameResult}`)
  if(JSON.parse(op_gg_json).gameResult != undefined)
    return

  let region = await readFile(path.resolve("config", "opgg-region.txt"), "utf-8")
  region = region.split("\r\n")[14]
  let summonername = await readFile(path.resolve("config", "opgg-username.txt"), "utf-8")
  summonername = summonername.split("\r\n")[1]
  let summonertag = await readFile(path.resolve("config", "opgg-username.txt"), "utf-8")
  summonertag = summonertag.split("\r\n")[4]

  // console.log(`${region} ${summonername} ${summonertag}`)

  let opggdao = new OpGgDao()
  await opggdao.readChampionId()
  const champion_json = opggdao.champion_json

  let op_gg_dao_match_history = await opggdao.requestMatchHistory(
    region, summonername, summonertag, 
    champion_json[this.op_gg_augmented_league.myTeam[0].championId],
    champion_json[this.op_gg_augmented_league.myTeam[1].championId],
    champion_json[this.op_gg_augmented_league.myTeam[2].championId],
    champion_json[this.op_gg_augmented_league.myTeam[3].championId],
    champion_json[this.op_gg_augmented_league.myTeam[4].championId]
  )
  // console.log(op_gg_dao_match_history)

  if(op_gg_dao_match_history != null){
    this.op_gg_augmented_league.gameResult = op_gg_dao_match_history.result
    this.op_gg_augmented_league.gameResultLink = op_gg_dao_match_history.link
  }
  await delete this.op_gg_augmented_league.chatDetails
  await writeFile(path.resolve("lake", `${gameID}.json`), JSON.stringify(this.op_gg_augmented_league))
}

OpGgService.prototype.getBan = async function(file, index){
  try{
    const p = this.op_gg_augmented_league.myTeam[index].championId
  }catch(e) {
    return
  }

  let om0 = await readFile(path.resolve("cache", file), "utf-8")
  om0 = JSON.parse(om0)
  // console.log(om0)

  const ob1 = om0.counters                           //undefined, defined
  const oci = om0.championId                          //0, 1-500
  const opi = om0.championPickIntent                  //0, 1-500

  const lci = this.op_gg_augmented_league.myTeam[index].championId          //0, 1-500
  const lpi = this.op_gg_augmented_league.myTeam[index].championPickIntent  //0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  if(eci && epi && ob1){
    this.op_gg_augmented_league.myTeam[index] = om0
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

  switch(this.op_gg_augmented_league.myTeam[index].assignedPosition){
    case "bottom" : this.op_gg_augmented_league.myTeam[index].assignedPosition = "adc"; break
    case "utility": this.op_gg_augmented_league.myTeam[index].assignedPosition = "support"; break
    case "middle" : this.op_gg_augmented_league.myTeam[index].assignedPosition = "mid"; break
  }

  // console.log(`${championId} ${championName} ${this.league.myTeam[index].assignedPosition}`)

  let championList
  try{
    championList = await opggdao.requestCounters(championName, this.op_gg_augmented_league.myTeam[index].assignedPosition)
  }catch(e){
    return
  }
  let counters = championList[0]
  let possible_positions = championList[1]

  const tiers_support = JSON.parse(await readFile(path.resolve('cache', 'tiers-support.json')))
  const tiers_adc = JSON.parse(await readFile(path.resolve('cache', 'tiers-adc.json')))
  const tiers_mid = JSON.parse(await readFile(path.resolve('cache', 'tiers-mid.json')))
  const tiers_jungle = JSON.parse(await readFile(path.resolve('cache', 'tiers-jungle.json')))
  const tiers_top = JSON.parse(await readFile(path.resolve('cache', 'tiers-top.json')))

  // console.log(championList)

  this.op_gg_augmented_league.myTeam[index].counterSortKey = 'winratio'
  for(let counter of counters){
    switch(this.op_gg_augmented_league.myTeam[index].assignedPosition){
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

  this.op_gg_augmented_league.myTeam[index].counters = counters
  this.op_gg_augmented_league.myTeam[index].possiblePositions = possible_positions

  writeFile(path.resolve("cache", file), JSON.stringify(this.op_gg_augmented_league.myTeam[index]))
  return this.op_gg_augmented_league
}

OpGgService.prototype.getPick = async function(file, index){
  try{
    const p = this.op_gg_augmented_league.theirTeam[index].championId
  }catch(e){
    return
  }

  let ot0 = await readFile(path.resolve("cache", file), "utf-8")
  ot0 = JSON.parse(ot0)

  //console.log(ot0)
  //console.log(this.league.theirTeam[index])

  const tb1 = ot0.counters
  const tci = ot0.championId
  const lci = this.op_gg_augmented_league.theirTeam[index].championId               //0, 1-500
  
  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.op_gg_augmented_league.theirTeam[index] = ot0
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
  
  const tiers_support = JSON.parse(await readFile(path.resolve('cache', 'tiers-support.json')))
  const tiers_adc = JSON.parse(await readFile(path.resolve('cache', 'tiers-adc.json')))
  const tiers_mid = JSON.parse(await readFile(path.resolve('cache', 'tiers-mid.json')))
  const tiers_jungle = JSON.parse(await readFile(path.resolve('cache', 'tiers-jungle.json')))
  const tiers_top = JSON.parse(await readFile(path.resolve('cache', 'tiers-top.json')))

  let opggPositions = {
    'top': [],
    'mid': [],
    'jungle': [],
    'adc': [],
    'support': []
  }

  for(let top of tiers_top) 
    opggPositions.top.push(top[0])  
  for(let mid of tiers_mid)
    opggPositions.mid.push(mid[0])
  for(let jungle of tiers_jungle) 
    opggPositions.jungle.push(jungle[0])
  for(let adc of tiers_adc)
    opggPositions.adc.push(adc[0])
  for(let support of tiers_support)
    opggPositions.support.push(support[0])

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

  let championRolesAndPosition
  try{
    championRolesAndPosition = await opggdao.requestCounters(championName, position)
  } catch(e){
    return
  }

  // console.log(championRolesAndPosition)

  this.op_gg_augmented_league.theirTeam[index].counterSortKey = 'winratio'
  this.op_gg_augmented_league.theirTeam[index].assignedPosition = championRolesAndPosition[1][0]
  this.op_gg_augmented_league.theirTeam[index].possiblePositions = championRolesAndPosition[1]
  let counters = championRolesAndPosition[0]

  for(let t of counters){
    for(let p in opggPositions){
      for(let championOPGGPosition of opggPositions[p]){
        if(t.counter == championOPGGPosition){
          // console.log(`${t.counter} ${p} ${c}`)
          switch(p){
            case "adc":
              for(let r of tiers_adc){
                if(r[0] == championOPGGPosition)
                  t.tiers == undefined ? t.tiers = [{'tier': r[1], 'role': 'Bottom'}] : t.tiers.push({'tier': r[1], 'role': 'Bottom'})
              }
              break
            case "support":
              for(let r of tiers_support){
                if(r[0] == championOPGGPosition)
                  t.tiers == undefined ? t.tiers = [{'tier': r[1], 'role': 'Support'}] : t.tiers.push({'tier': r[1], 'role': 'Support'})
              }
              break
            case "jungle":
              for(let r of tiers_jungle){
                if(r[0] == championOPGGPosition)
                  t.tiers == undefined ? t.tiers = [{'tier': r[1], 'role': 'Jungle'}] : t.tiers.push({'tier': r[1], 'role': 'Jungle'})
              }
              break
            case "mid":
              for(let r of tiers_mid){
                if(r[0] == championOPGGPosition)
                  t.tiers == undefined ? t.tiers = [{'tier': r[1], 'role': 'Middle'}] : t.tiers.push({'tier': r[1], 'role': 'Middle'})
              }
              break
            case "top":
              for(let r of tiers_top){
                if(r[0] == championOPGGPosition)
                  t.tiers == undefined ? t.tiers = [{'tier': r[1], 'role': 'Top'}] : t.tiers.push({'tier': r[1], 'role': 'Top'})
              }
              break
          }
        }
      }
    }
  }


  this.op_gg_augmented_league.theirTeam[index].counters = counters

  // console.log(this.league.theirTeam[index])

  writeFile(path.resolve("cache", file), JSON.stringify(this.op_gg_augmented_league.theirTeam[index]))
  return this.op_gg_augmented_league
}

//need to convert from cheerio to puppeteer 
OpGgService.prototype.getMatchup = async function(myTeamIndex, write, theirTeamOpen){
  try{
    const i = this.op_gg_augmented_league.myTeam[myTeamIndex].championId
    const p = this.op_gg_augmented_league.myTeam[myTeamIndex].championPickIntent
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
      if(theirTeamOpen[i].possiblePositions[j] == this.op_gg_augmented_league.myTeam[myTeamIndex].assignedPosition){
        // console.log(theirTeamOpen[i])
        
        const susi = theirTeamOpen[i].championId
        const susp = theirTeamOpen[i].championPickIntent
        const sus  = susi == 0 ? susp : susi

        const ouri = this.op_gg_augmented_league.myTeam[myTeamIndex].championId
        const ourp = this.op_gg_augmented_league.myTeam[myTeamIndex].championPickIntent
        const our  = ouri == 0 ? ourp : ouri

        theirTeamOpen.splice(i, 1)

        matchup.myTeam = opggdao.champion_json[our]
        matchup.theirTeam = opggdao.champion_json[sus]

        url = url.replace('!', matchup.myTeam)
                  .replace('@', this.op_gg_augmented_league.myTeam[myTeamIndex].assignedPosition)
                  .replace('#', sus) 
      } // if theirPosition equals ourPosition
    } // loops jungle support top mid bot
  } // loops theirTeam0 theirTeam1 theirTeam2 theirTeam3 theirTeam4 theirTeam5
  
  if(matchup.myTeam == undefined){
    const susi = theirTeamOpen[0].championId
    const susp = theirTeamOpen[0].championPickIntent
    const sus  = susi == 0 ? susp : susi

    const ouri = this.op_gg_augmented_league.myTeam[myTeamIndex].championId
    const ourp = this.op_gg_augmented_league.myTeam[myTeamIndex].championPickIntent
    const our  = ouri == 0 ? ourp : ouri

    theirTeamOpen.splice(0, 1)

    matchup.myTeam = opggdao.champion_json[our]
    matchup.theirTeam = opggdao.champion_json[sus]

    url = url.replace('!', matchup.myTeam)
              .replace('@', this.op_gg_augmented_league.myTeam[myTeamIndex].assignedPosition)
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

        if(this.op_gg_augmented_league.matchups == undefined)
          this.op_gg_augmented_league.matchups = []
        
        this.op_gg_augmented_league.matchups[myTeamIndex] = matchup

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

module.exports = OpGgService