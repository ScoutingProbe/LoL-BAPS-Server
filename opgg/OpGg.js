const TextToJson = require('../text_to_json/TextToJson')
const https = require('https')
const path = require('path')
const util = require('util')
const fs = require('fs')
const cheerio = require('cheerio')
const { json } = require('express')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function OpGg(league){
  this.league = league
}

OpGg.prototype.getBan = async function(file, index){
  try{
    const p = this.league.myTeam[index].championId
  }catch(e) {
    return
  }

  let om0 = await readFile(path.resolve("opgg", file), "utf-8")
  om0 = JSON.parse(om0)
  // console.log(om0)

  const ob1 = om0.counters                           //undefined, defined
  const oci = om0.championId                          //0, 1-500
  const opi = om0.championPickIntent                  //0, 1-500
  
  // if(this.league.myTeam[index].summonerId != om0.summonerId){
  //   // await writeFile(path.resolve("opgg", file), JSON.stringify(this.league.myTeam[index]))
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

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){

    return
  }

  switch(this.league.myTeam[index].assignedPosition){
    case "bottom" : this.league.myTeam[index].assignedPosition = "bot"; break
    case "utility": this.league.myTeam[index].assignedPosition = "support"; break
    case "middle" : this.league.myTeam[index].assignedPosition = "mid"; break
    // default    : this.league.myTeam[i].assignedPosition = "mid"
  }

  console.log(`${championId} ${championName} ${this.league.myTeam[index].assignedPosition}`)

  const url = 'https://na.op.gg/champion/!/statistics/@/build'
  const irl = url.replace("!", championName).replace("@", this.league.myTeam[index].assignedPosition)
  
  console.log(irl)

  let p = new Promise((resolve, reject) => {
    https.get(irl, (res) =>{
      const {statusCode} = res
      // const contentType = res.headers['content-type']
      res.setEncoding('utf-8')
      let error

      if(statusCode !== 200){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
        console.error(res.headers.location)
      }

      if(error){
        console.error(error.message)
        res.resume()
        resolve(this.league)
      }

      let raw = ''
      res.on('data', (chunk) =>{raw += chunk})
      res.on('end', () => {
        // console.log(raw)

        const $ = cheerio.load(raw)

        let counters = $("tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)").text().replace(/\t/g, '').split('\n\n')
        for(let i = 0; i < counters.length; i++){
          counters[i] = counters[i].replace(/\n/g, '')
        }
        if(counters.length == 1){
          this.league.myTeam[index].counters = []
        } else {
          this.league.myTeam[index].counters = counters
        }

        let roles = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
        for(let i = 0; i < roles.length; i++){
          switch(roles[i]){
            case "Top"    : roles[i] = "top"; break
            case "Middle" : roles[i] = "mid"; break
            case "Jungle" : roles[i] = "jungle"; break
            case "Support": roles[i] = "support"; break
            case "Bottom" : roles[i] = "bot"; break
          }
        }

        switch(roles[0]){
          case "Top"    : this.league.myTeam[index].assignedPosition = "top"; break
          case "Middle" : this.league.myTeam[index].assignedPosition = "middle"; break
          case "Jungle" : this.league.myTeam[index].assignedPosition = "jungle"; break
          case "Support": this.league.myTeam[index].assignedPosition = "support"; break
          case "Bottom" : this.league.myTeam[index].assignedPosition = "bot"; break
        }

        this.league.myTeam[index].possiblePositions = roles

        console.log(`${counters}`)
        console.log(`${roles}`)
        console.log("---------------------------------")


        writeFile(path.resolve("opgg", file), JSON.stringify(this.league.myTeam[index]))
        resolve(this.league)

      }).on('error', (e) => {
        console.error(`OpGg#getBan HTTP error ${e.message}`)
        resolve(this.league)
      })
    })
  })
  return await p
}

OpGg.prototype.getPick = async function(file, index){
  try{
    const p = this.league.theirTeam[index].championId
  }catch(e){
    return
  }

  let ot0 = await readFile(path.resolve("opgg", file), "utf-8")
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

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championName = champion_json[lci]

  if(championName == undefined){
    return
  }  

  const url = 'https://na.op.gg/champion/!/statistics'
  let irl = url.replace("!", championName)
  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) =>{
      const { statusCode } = res
      const contentType = res.headers['content-type']
      res.setEncoding('utf8')

      let error
      if (statusCode !== 301 && statusCode !== 200){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if(error){
        console.error(error.message)
        res.resume()
        reject(this.league)
      }
      if (statusCode == 301){
        irl = `https://na.op.gg${res.headers.location}`

        https.get(irl, (res) =>{
          const {statusCode } = res
          const contentType = res.headers['content-type']
          res.setEncoding('utf8')
          
          let error
          if(statusCode !== 200){
            error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
          }

          if(error){
            console.error(error.message)
            res.resume()
            reject(this.league)
          }

          let rawData = ''
          res.on('data', (chunk) => {rawData += chunk})
          res.on('end', () => {
            const $ = cheerio.load(rawData)
            let counters = $("tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)").text().replace(/\t/g, '').split('\n\n')
            for(let j = 0; j < counters.length; j++)
              counters[j] = counters[j].replace(/\n/g, '')
            
            counters[0] = counters[0].replace(/\n/g, '')
            counters[counters.length - 1] = counters[counters.length-1].replace(/\n/g, '')

            let roles = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
            for(let j = 0; j < roles.length; j++){
              switch(roles[j]){
                case "Top": roles[j] = "top"; break
                case "Middle": roles[j] = "mid"; break
                case "Jungle": roles[j] = "jungle"; break
                case "Support": roles[j] = "support"; break
                case "Bottom": roles[j] = "bot"; break
              }
            }
            this.league.theirTeam[index].possiblePositions = roles
            this.league.theirTeam[index].assignedPosition = roles[0]

            console.log(`${counters}`)
            console.log(`${roles}`)
            console.log("-------------------------------------------------------")

            if(counters.length == 1){
              console.log(irl)
              console.log(`End of OpGg#getPick(${file} ${index})`)
              this.league.theirTeam[index].counters = []
            } else {
              this.league.theirTeam[index].counters = counters
            }
            writeFile(path.resolve("opgg", file), JSON.stringify(this.league.theirTeam[index]))
            resolve(this.league)
          }) // end response
        }) // end https
      } // end if (statusCode == 301){
      else if(statusCode == 200){
        console.log(irl)
        console.log(`End of OpGg#getPick(${file} ${index})`)
        this.league.theirTeam[index].counters = []
        // this.league.theirTeam[index].assignedPosition = ''
        writeFile(path.resolve("opgg", file), JSON.stringify(this.league.theirTeam[index]))
        resolve(this.league)
      }
    })
  })
  return await p
}

OpGg.prototype.getMatchup = async function(myTeamIndex, write, theirTeamOpen){
  try{
    const i = this.league.myTeam[myTeamIndex].championId
    const p = this.league.myTeam[myTeamIndex].championPickIntent
    if(i == 0 && p == 0)
      return
  } catch(e){
    return
  }

  let matchup = {}

  let ttj = new TextToJson()
  await ttj.readChampionId()

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

        matchup.myTeam = ttj.champion_json[our]
        matchup.theirTeam = ttj.champion_json[sus]

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

    matchup.myTeam = ttj.champion_json[our]
    matchup.theirTeam = ttj.champion_json[sus]

    url = url.replace('!', matchup.myTeam)
              .replace('@', this.league.myTeam[myTeamIndex].assignedPosition)
              .replace('#', sus)
  }

  console.log(theirTeamOpen)
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

// OpGg.prototype.getMatchup = async function(file, key){
//   try{
//     const o = this.league.matchups.key.myTeam.championId
//   }catch(e){
//     console.log(`OpGg#getMatchup Cannot find my champion ${file} ${key}`)
//     return
//   }
//   try{
//     const o = this.league.matchups.key.theirTeam.championId
//   } catch(e){
//     console.log(`OpGg#getMatchup Cannot find their champion ${file} ${key}`)
//     return
//   }

//   const w = await readFile(path.resolve("opgg", file), "utf-8")

//   let ttj = new TextToJson()
//   await ttj.readChampionId()
//   const champion_json = ttj.champion_json
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
//         writeFile(path.resolve("opgg", key), JSON.stringify(this.league.matchups.key))
//         resolve(this.league)
//       })
//     }).on('error', function(e) {
//       console.error(`Got error: ${e.message}`)
//       reject(e)
//     })
//   })

//   return await p
// }

// OpGg.prototype.setMatchups = async function(){
//   try{
//     const p = this.league.myTeam[0].assignedPosition
//   }catch(e){
//     console.log(`No game log found`)
//     return
//   }

//   this.league.theirTeam[0] = JSON.parse(await readFile(path.resolve("opgg", "theirTeam0.json"), "utf-8"))
//   this.league.theirTeam[1] = JSON.parse(await readFile(path.resolve("opgg", "theirTeam1.json"), "utf-8"))
//   this.league.theirTeam[2] = JSON.parse(await readFile(path.resolve("opgg", "theirTeam2.json"), "utf-8"))
//   this.league.theirTeam[3] = JSON.parse(await readFile(path.resolve("opgg", "theirTeam3.json"), "utf-8"))
//   this.league.theirTeam[4] = JSON.parse(await readFile(path.resolve("opgg", "theirTeam4.json"), "utf-8"))

//   let matchups_not_found = []
//   let matchups = {}

//   let mti, mmi, mbi, mji, msi
//   let tti, tmi, tbi, tji, tsi

//   for(let i = 0; i < 5; i++){
//     try{
//       const p = this.league.theirTeam[i].assignedPosition
//     }catch(e){
//       console.log(`OpGg#setMatchups Cannot find assignedPosition ${this.league.theirTeam[i]}`)
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

//   await writeFile(path.resolve("opgg", "jungle.json"), JSON.stringify(matchups.jungle))
//   await writeFile(path.resolve("opgg", "support.json"), JSON.stringify(matchups.support))
//   await writeFile(path.resolve("opgg", "top.json"), JSON.stringify(matchups.top))
//   await writeFile(path.resolve("opgg", "mid.json"), JSON.stringify(matchups.mid))
//   await writeFile(path.resolve("opgg", "bot.json"), JSON.stringify(matchups.bot))

//   console.log(matchups)
//   console.log(matchups_not_found)

//   this.league.matchups = matchups
// }
  
module.exports = OpGg
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
