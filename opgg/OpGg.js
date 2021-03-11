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
  this.opgg = league
}


OpGg.prototype.getBanFirst = async function(){
  let om0 = await readFile(path.resolve("opgg", "myTeam0.json"), "utf-8")
  om0 = JSON.parse(om0)
  
  // console.log(om0)

  const ob1 = om0.ban1                                // undefined, defined
  const oci = om0.championId                          // 0, 1-500 
  const opi = om0.championPickIntent                  // 0, 1-500
  try{
    const poo = this.opgg.myTeam[0].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }

  if(this.opgg.myTeam[0].summonerId != om0.summonerId){
    await writeFile(path.resolve("opgg", "myTeam0.json"), JSON.stringify(this.opgg.myTeam[0]))
    return
  }

  const lci = this.opgg.myTeam[0].championId          // 0, 1-500
  const lpi = this.opgg.myTeam[0].championPickIntent  // 0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  // console.log(`${eci} ${epi} ${eb1}`)

  if(eci && epi && ob1){
    this.opgg.myTeam[0] = om0
    return 
  }
  
  // if(!eci && !epi && ob1)
  //   return

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){
    return
  }

  let assignedPosition = this.opgg.myTeam[0].assignedPosition
  switch(assignedPosition){
    case "bottom": assignedPosition = "bot"; break
    case "utility": assignedPosition = "support"; break
    case "middle": assignedPosition = "mid"; break
    // default: assignedPosition = "mid";
  }
  
  console.log(`${championId} ${championName} ${assignedPosition}`)

  const url = 'https://www.op.gg/champion/!/statistics/@'
  const irl = url.replace("!", championName).replace("@", assignedPosition)//TODO

  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      
      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`)
        console.log(res.headers.location)
      }
      if (error) {
        console.error(error.message)
        // Consume response data to free up memory
        res.resume()
        resolve(this.opgg)
      }
      
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk });
      res.on('end', () => {
        // console.log(rawData)

        const $ = cheerio.load(rawData)
        const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
        const text = $(selector).text().replace(/\t/g, '')
        let text_array = text.split('\n\n')
        text_array[0] = text_array[0].replace(/\n/g, '')
        text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

        console.log($('title').text())
        console.log(`${text_array}`)
        console.log("-------------------------------------------------------")

        if(text_array.length == 1){
          this.opgg.myTeam[0].ban1 = "opgg"
          this.opgg.myTeam[0].ban2 = "not"
          this.opgg.myTeam[0].ban3 = "found"

        } else{
          this.opgg.myTeam[0].ban1 = text_array[0]
          this.opgg.myTeam[0].ban2 = text_array[1]
          this.opgg.myTeam[0].ban3 = text_array[2]
        }

        writeFile(path.resolve("opgg", "myTeam0.json"), JSON.stringify(this.opgg.myTeam[0]))
        resolve(this.opgg)
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
      resolve(this.opgg)
    })
  })

  return await p
}

OpGg.prototype.getBanSecond = async function(){
  let om1 = await readFile(path.resolve("opgg", "myTeam1.json"), "utf-8")
  om1 = JSON.parse(om1)
  
  // console.log(om1)

  const ob1 = om1.ban1                                // undefined, defined
  const oci = om1.championId                          // 0, 1-500 
  const opi = om1.championPickIntent                  // 0, 1-500
  try{
    const poo = this.opgg.myTeam[1].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }
  const lci = this.opgg.myTeam[1].championId          // 0, 1-500
  const lpi = this.opgg.myTeam[1].championPickIntent  // 0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  // console.log(`${eci} ${epi} ${eb1}`)

  if(eci && epi && ob1){
    this.opgg.myTeam[1] = om1
    return 
  }
  
  // if(!eci && !epi && ob1)
  //   return

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){
    return
  }

  let assignedPosition = this.opgg.myTeam[1].assignedPosition
  switch(assignedPosition){
    case "bottom": assignedPosition = "bot"; break
    case "utility": assignedPosition = "support"; break
    case "middle": assignedPosition = "mid"; break
    // default: assignedPosition = "support";
  }
  
  console.log(`${championId} ${championName} ${assignedPosition}`)

  const url = 'https://www.op.gg/champion/!/statistics/@'
  const irl = url.replace("!", championName).replace("@", assignedPosition)//TODO

  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      
      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`)
        console.log(res.headers.location)
      }
      if (error) {
        console.error(error.message)
        // Consume response data to free up memory
        res.resume()
        resolve(this.opgg)
      }
      
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk });
      res.on('end', () => {
        
        // console.log(rawData)
        const $ = cheerio.load(rawData)
        const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
        const text = $(selector).text().replace(/\t/g, '')
        let text_array = text.split('\n\n')
        text_array[0] = text_array[0].replace(/\n/g, '')
        text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

        console.log($('title').text())
        console.log(`${text_array}`)
        console.log("-------------------------------------------------------")

        if(text_array.length == 1){
          this.opgg.myTeam[1].ban1 = "opgg"
          this.opgg.myTeam[1].ban2 = "not"
          this.opgg.myTeam[1].ban3 = "found"

        } else{
          this.opgg.myTeam[1].ban1 = text_array[0]
          this.opgg.myTeam[1].ban2 = text_array[1]
          this.opgg.myTeam[1].ban3 = text_array[2]
        }

        writeFile(path.resolve("opgg", "myTeam1.json"), JSON.stringify(this.opgg.myTeam[1]))
        resolve(this.opgg)
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
      resolve(this.opgg)
    })
  })

  return await p
}

OpGg.prototype.getBanThird = async function(){
  let om2 = await readFile(path.resolve("opgg", "myTeam2.json"), "utf-8")
  om2 = JSON.parse(om2)
  
  // console.log(om2)

  const ob1 = om2.ban1                                // undefined, defined
  const oci = om2.championId                          // 0, 1-500 
  const opi = om2.championPickIntent                  // 0, 1-500
  try{
    const poo = this.opgg.myTeam[2].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }
  const lci = this.opgg.myTeam[2].championId          // 0, 1-500
  const lpi = this.opgg.myTeam[2].championPickIntent  // 0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  // console.log(`${eci} ${epi} ${eb1}`)

  if(eci && epi && ob1){
    this.opgg.myTeam[2] = om2
    return 
  }
  
  // if(!eci && !epi && ob1)
  //   return

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){
    return
  }

  let assignedPosition = this.opgg.myTeam[2].assignedPosition
  switch(assignedPosition){
    case "bottom": assignedPosition = "bot"; break
    case "utility": assignedPosition = "support"; break
    case "middle": assignedPosition = "mid"; break
    // default: assignedPosition = "top";
  }
  
  console.log(`${championId} ${championName} ${assignedPosition}`)

  const url = 'https://www.op.gg/champion/!/statistics/@'
  const irl = url.replace("!", championName).replace("@", assignedPosition)//TODO

  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      
      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`)
        console.log(res.headers.location)
      }
      if (error) {
        console.error(error.message)
        // Consume response data to free up memory
        res.resume()
        resolve(this.opgg)
      }
      
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk });
      res.on('end', () => {
        // console.log(rawData)

        const $ = cheerio.load(rawData)
        const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
        const text = $(selector).text().replace(/\t/g, '')
        let text_array = text.split('\n\n')
        text_array[0] = text_array[0].replace(/\n/g, '')
        text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

        console.log($('title').text())
        console.log(`${text_array}`)
        console.log("-------------------------------------------------------")

        if(text_array.length == 1){
          this.opgg.myTeam[2].ban1 = "opgg"
          this.opgg.myTeam[2].ban2 = "not"
          this.opgg.myTeam[2].ban3 = "found"

        } else{
          this.opgg.myTeam[2].ban1 = text_array[0]
          this.opgg.myTeam[2].ban2 = text_array[1]
          this.opgg.myTeam[2].ban3 = text_array[2]
        }

        writeFile(path.resolve("opgg", "myTeam2.json"), JSON.stringify(this.opgg.myTeam[2]))
        resolve(this.opgg)
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
      resolve(this.opgg)
    })
  })

  return await p
}

OpGg.prototype.getBanFourth = async function(){
  let om3 = await readFile(path.resolve("opgg", "myTeam3.json"), "utf-8")
  om3 = JSON.parse(om3)
  
  // console.log(om3)

  const ob1 = om3.ban1                                // undefined, defined
  const oci = om3.championId                          // 0, 1-500 
  const opi = om3.championPickIntent                  // 0, 1-500
  try{
    const poo = this.opgg.myTeam[3].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }
  const lci = this.opgg.myTeam[3].championId          // 0, 1-500
  const lpi = this.opgg.myTeam[3].championPickIntent  // 0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  // console.log(`${eci} ${epi} ${eb1}`)

  if(eci && epi && ob1){
    this.opgg.myTeam[3] = om3
    return 
  }
  
  // if(!eci && !epi && ob1)
  //   return

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){
    return
  }

  let assignedPosition = this.opgg.myTeam[3].assignedPosition
  switch(assignedPosition){
    case "bottom": assignedPosition = "bot"; break
    case "utility": assignedPosition = "support"; break
    case "middle": assignedPosition = "mid"; break
    // default: assignedPosition = "support";
  }
  
  console.log(`${championId} ${championName} ${assignedPosition}`)

  const url = 'https://www.op.gg/champion/!/statistics/@'
  const irl = url.replace("!", championName).replace("@", assignedPosition)//TODO

  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      
      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`)
        console.log(res.headers.location)
      }
      if (error) {
        console.error(error.message)
        // Consume response data to free up memory
        res.resume()
        resolve(this.opgg)
      }
      
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk });
      res.on('end', () => {
        // console.log(rawData)

        const $ = cheerio.load(rawData)
        const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
        const text = $(selector).text().replace(/\t/g, '')
        let text_array = text.split('\n\n')
        text_array[0] = text_array[0].replace(/\n/g, '')
        text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

        console.log($('title').text())
        console.log(`${text_array}`)
        console.log("-------------------------------------------------------")

        if(text_array.length == 1){
          this.opgg.myTeam[3].ban1 = "opgg"
          this.opgg.myTeam[3].ban2 = "not"
          this.opgg.myTeam[3].ban3 = "found"

        } else{
          this.opgg.myTeam[3].ban1 = text_array[0]
          this.opgg.myTeam[3].ban2 = text_array[1]
          this.opgg.myTeam[3].ban3 = text_array[2]
        }

        writeFile(path.resolve("opgg", "myTeam3.json"), JSON.stringify(this.opgg.myTeam[3]))
        resolve(this.opgg)
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
      resolve(this.opgg)
    })
  })

  return await p
}

OpGg.prototype.getBanFifth = async function(){
  let om4 = await readFile(path.resolve("opgg", "myTeam4.json"), "utf-8")
  om4 = JSON.parse(om4)
  
  // console.log(om4)

  const ob1 = om4.ban1                                // undefined, defined
  const oci = om4.championId                          // 0, 1-500 
  const opi = om4.championPickIntent                  // 0, 1-500
  try{
    const poo = this.opgg.myTeam[4].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }
  const lci = this.opgg.myTeam[4].championId          // 0, 1-500
  const lpi = this.opgg.myTeam[4].championPickIntent  // 0, 1-500

  // console.log(`${oci} ${lci}`)
  // console.log(`${opi} ${lpi}`)
  // console.log(`${ob1}`)

  const eci = oci == lci
  const epi = opi == lpi
  const eb1 = ob1 != undefined

  // console.log(`${eci} ${epi} ${eb1}`)

  if(eci && epi && ob1){
    this.opgg.myTeam[4] = om4
    return 
  }
  
  // if(!eci && !epi && ob1)
  //   return

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championId = lci == "0" ? lpi : lci
  const championName = champion_json[championId]

  if(championName == undefined){
    return
  }

  let assignedPosition = this.opgg.myTeam[4].assignedPosition
  switch(assignedPosition){
    case "bottom": assignedPosition = "bot"; break
    case "utility": assignedPosition = "support"; break
    case "middle": assignedPosition = "mid"; break
    // default: assignedPosition = "top";
  }
  
  console.log(`${championId} ${championName} ${assignedPosition}`)

  const url = 'https://www.op.gg/champion/!/statistics/@'
  const irl = url.replace("!", championName).replace("@", assignedPosition)//TODO

  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      
      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`)
        console.log(res.headers.location)
      }
      if (error) {
        console.error(error.message)
        // Consume response data to free up memory
        res.resume()
        resolve(this.opgg)
      }
      
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk });
      res.on('end', () => {
        // console.log(rawData)

        const $ = cheerio.load(rawData)
        const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
        const text = $(selector).text().replace(/\t/g, '')
        let text_array = text.split('\n\n')
        text_array[0] = text_array[0].replace(/\n/g, '')
        text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

        console.log($('title').text())
        console.log(`${text_array}`)
        console.log("-------------------------------------------------------")

        this.opgg.myTeam[4].ban1 = text_array[0]
        if(text_array.length == 1)
          this.opgg.myTeam[4].ban1 = "opgg sez summoner is troll"
        this.opgg.myTeam[4].ban2 = text_array[1]
        this.opgg.myTeam[4].ban3 = text_array[2]

        writeFile(path.resolve("opgg", "myTeam4.json"), JSON.stringify(this.opgg.myTeam[4]))
        resolve(this.opgg)
      })
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
      resolve(this.opgg)
    })
  })

  return await p
}

// PICKS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PICKS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PICKS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PICKS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PICKS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PICKS/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


OpGg.prototype.getPickFirst = async function(){
  let ot0 = await readFile(path.resolve("opgg", "theirTeam0.json"), "utf-8")
  ot0 = JSON.parse(ot0)

  // console.log(ot0)
  // console.log(this.opgg.theirTeam[0])

  const tb1 = ot0.ban1
  const tci = ot0.championId

  try{
    const poo = this.opgg.theirTeam[0].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }

  const lci = this.opgg.theirTeam[0].championId          // 0, 1-500

  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.opgg.theirTeam[0] = ot0
    return
  }

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championName = champion_json[lci]

  if(championName == undefined){
    return
  }

  const url = 'https://www.op.gg/champion/!/statistics'
  let irl = url.replace("!", championName)
  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) =>{
      const { statusCode } = res
      const contentType = res.headers['content-type']
      res.setEncoding('utf8')

      let error
      if (statusCode !== 301){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if(error){
        console.error(error.message)
        res.resume()
        reject(this.opgg)
      }
      if (statusCode == 301){
        irl = `https://www.op.gg${res.headers.location}`

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
            reject(this.opgg)
          }

          let rawData = ''
          res.on('data', (chunk) => {rawData += chunk})
          res.on('end', () => {
            const $ = cheerio.load(rawData)
            let text_array = $("tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)").text().replace(/\t/g, '').split('\n\n')
            text_array[0] = text_array[0].replace(/\n\g/, '')
            text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

            let text_array2 = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
            this.opgg.theirTeam[0].possiblePositions = text_array2
            this.opgg.theirTeam[0].assignedPosition = text_array2[0]
            console.log(`${text_array2}`)
            console.log($('title').text())
            console.log(`${text_array}`)
            console.log("-------------------------------------------------------")

            if(text_array.length == 1){
              this.opgg.theirTeam[0].ban1 = "opgg"
              this.opgg.theirTeam[0].ban2 = "not"
              this.opgg.theirTeam[0].ban3 = "found"
            } else {
              this.opgg.theirTeam[0].ban1 = text_array[0]
              this.opgg.theirTeam[0].ban2 = text_array[1]
              this.opgg.theirTeam[0].ban3 = text_array[2]
            }

            
            // if(text_array2.length == 1){
            //   this.opgg.theirTeam[0].possibleRoles = []
            // } else{
            //   this.opgg.theirTeam[0].possibleRoles = text_array2
            // }

            writeFile(path.resolve("opgg", "theirTeam0.json"), JSON.stringify(this.opgg.theirTeam[0]))
            resolve(this.opgg)
          })
        })
      }
    })
  })
  return await p
}

OpGg.prototype.getPickSecond = async function(){
  let ot1 = await readFile(path.resolve("opgg", "theirTeam1.json"), "utf-8")
  ot1 = JSON.parse(ot1)

  // console.log(ot1)
  // console.log(this.opgg.theirTeam[1])

  const tb1 = ot1.ban1
  const tci = ot1.championId

  try{
    const poo = this.opgg.myTeam[1].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }

  const lci = this.opgg.theirTeam[1].championId          // 0, 1-500

  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.opgg.theirTeam[1] = ot1
    return
  }

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championName = champion_json[lci]

  if(championName == undefined){
    return
  }

  const url = 'https://www.op.gg/champion/!/statistics'
  let irl = url.replace("!", championName)
  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) =>{
      const { statusCode } = res
      const contentType = res.headers['content-type']
      res.setEncoding('utf8')

      let error
      if (statusCode !== 301){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if(error){
        console.error(error.message)
        res.resume()
        reject(this.opgg)
      }
      if (statusCode == 301){
        irl = `https://www.op.gg${res.headers.location}`
        console.log(irl)

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
            reject(this.opgg)
          }

          let rawData = ''
          res.on('data', (chunk) => {rawData += chunk})
          res.on('end', () => {
            const $ = cheerio.load(rawData)
            const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
            const text = $(selector).text().replace(/\t/g, '')
            let text_array = text.split('\n\n')
            text_array[0] = text_array[0].replace(/\n\g/, '')
            text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

            let text_array2 = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
            this.opgg.theirTeam[1].possiblePositions = text_array2
            this.opgg.theirTeam[1].assignedPosition = text_array2[0]
            console.log(text_array2)
            console.log($('title').text())
            console.log(`${text_array}`)
            console.log("-------------------------------------------------------")

            if(text_array.length == 1){
              this.opgg.theirTeam[1].ban1 = "opgg"
              this.opgg.theirTeam[1].ban2 = "not"
              this.opgg.theirTeam[1].ban3 = "found"
            } else {
              this.opgg.theirTeam[1].ban1 = text_array[0]
              this.opgg.theirTeam[1].ban2 = text_array[1]
              this.opgg.theirTeam[1].ban3 = text_array[3]
            }

            writeFile(path.resolve("opgg", "theirTeam1.json"), JSON.stringify(this.opgg.theirTeam[1]))
            resolve(this.opgg)
          })
        })
      }
    })
  })
  return await p
}

OpGg.prototype.getPickThird = async function(){
  let ot2 = await readFile(path.resolve("opgg", "theirTeam2.json"), "utf-8")
  ot2 = JSON.parse(ot2)

  // console.log(ot2)
  // console.log(this.opgg.theirTeam[1])

  const tb1 = ot2.ban1
  const tci = ot2.championId

  try{
    const poo = this.opgg.myTeam[2].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }

  const lci = this.opgg.theirTeam[2].championId          // 0, 1-500

  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.opgg.theirTeam[2] = ot2
    return
  }

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championName = champion_json[lci]

  if(championName == undefined){
    return
  }

  const url = 'https://www.op.gg/champion/!/statistics'
  let irl = url.replace("!", championName)
  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) =>{
      const { statusCode } = res
      const contentType = res.headers['content-type']
      res.setEncoding('utf8')

      let error
      if (statusCode !== 301){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if(error){
        console.error(error.message)
        res.resume()
        reject(this.opgg)
      }
      if (statusCode == 301){
        irl = `https://www.op.gg${res.headers.location}`
        console.log(irl)

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
            reject(this.opgg)
          }

          let rawData = ''
          res.on('data', (chunk) => {rawData += chunk})
          res.on('end', () => {
            const $ = cheerio.load(rawData)
            const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
            const text = $(selector).text().replace(/\t/g, '')
            let text_array = text.split('\n\n')
            text_array[0] = text_array[0].replace(/\n\g/, '')
            text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

            let text_array2 = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
            this.opgg.theirTeam[2].possiblePositions = text_array2
            this.opgg.theirTeam[2].assignedPosition = text_array2[0]
            console.log(text_array2)
            console.log($('title').text())
            console.log(`${text_array}`)
            console.log("-------------------------------------------------------")

            if(text_array.length == 1){
              this.opgg.theirTeam[2].ban1 = "opgg"
              this.opgg.theirTeam[2].ban2 = "not"
              this.opgg.theirTeam[2].ban3 = "found"
            } else {
              this.opgg.theirTeam[2].ban1 = text_array[0]
              this.opgg.theirTeam[2].ban2 = text_array[1]
              this.opgg.theirTeam[2].ban3 = text_array[3]
            }

            writeFile(path.resolve("opgg", "theirTeam2.json"), JSON.stringify(this.opgg.theirTeam[2]))
            resolve(this.opgg)
          })
        })
      }
    })
  })
  return await p
}

OpGg.prototype.getPickFourth = async function(){
  let ot3 = await readFile(path.resolve("opgg", "theirTeam3.json"), "utf-8")
  ot3 = JSON.parse(ot3)

  // console.log(ot3)
  // console.log(this.opgg.theirTeam[1])

  const tb1 = ot3.ban1
  const tci = ot3.championId

  try{
    const poo = this.opgg.myTeam[3].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }

  const lci = this.opgg.theirTeam[3].championId          // 0, 1-500

  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.opgg.theirTeam[3] = ot3
    return
  }

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championName = champion_json[lci]

  if(championName == undefined){
    return
  }

  const url = 'https://www.op.gg/champion/!/statistics'
  let irl = url.replace("!", championName)
  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) =>{
      const { statusCode } = res
      const contentType = res.headers['content-type']
      res.setEncoding('utf8')

      let error
      if (statusCode !== 301){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if(error){
        console.error(error.message)
        res.resume()
        reject(this.opgg)
      }
      if (statusCode == 301){
        irl = `https://www.op.gg${res.headers.location}`
        console.log(irl)

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
            reject(this.opgg)
          }

          let rawData = ''
          res.on('data', (chunk) => {rawData += chunk})
          res.on('end', () => {
            const $ = cheerio.load(rawData)
            const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
            const text = $(selector).text().replace(/\t/g, '')
            let text_array = text.split('\n\n')
            text_array[0] = text_array[0].replace(/\n\g/, '')
            text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')

            let text_array2 = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
            this.opgg.theirTeam[3].possiblePositions = text_array2
            this.opgg.theirTeam[3].assignedPosition = text_array2[0]
            console.log(text_array2)
            console.log($('title').text())
            console.log(`${text_array}`)
            console.log("-------------------------------------------------------")

            if(text_array.length == 1){
              this.opgg.theirTeam[3].ban1 = "opgg"
              this.opgg.theirTeam[3].ban2 = "not"
              this.opgg.theirTeam[3].ban3 = "found"
            } else {
              this.opgg.theirTeam[3].ban1 = text_array[0]
              this.opgg.theirTeam[3].ban2 = text_array[1]
              this.opgg.theirTeam[3].ban3 = text_array[3]
            }

            writeFile(path.resolve("opgg", "theirTeam3.json"), JSON.stringify(this.opgg.theirTeam[3]))
            resolve(this.opgg)
          })
        })
      }
    })
  })
  return await p
}

OpGg.prototype.getPickFifth = async function(){
  let ot4 = await readFile(path.resolve("opgg", "theirTeam4.json"), "utf-8")
  ot4 = JSON.parse(ot4)

  // console.log(ot3)
  // console.log(this.opgg.theirTeam[1])

  const tb1 = ot4.ban1
  const tci = ot4.championId

  try{
    const poo = this.opgg.theirTeam[4].championId
  }catch(e){
    console.log(`No game log found`)
    return
  }

  const lci = this.opgg.theirTeam[4].championId          // 0, 1-500

  // console.log(`${tci} ${lci}`)
  // console.log(`${tb1}`)

  const eci = tci == lci
  const eb1 = tb1 != undefined

  if(eci && eb1){
    this.opgg.theirTeam[4] = ot4
    return
  }

  let ttj = new TextToJson()
  await ttj.readChampionId()
  const champion_json = ttj.champion_json
  const championName = champion_json[lci]

  if(championName == undefined){
    return
  }

  const url = 'https://www.op.gg/champion/!/statistics'
  let irl = url.replace("!", championName)
  console.log(irl)

  let p = new Promise((resolve,reject) =>{
    https.get(irl, (res) =>{
      const { statusCode } = res
      const contentType = res.headers['content-type']
      res.setEncoding('utf8')

      let error
      if (statusCode !== 301){
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      }
      if(error){
        console.error(error.message)
        res.resume()
        reject(this.opgg)
      }
      if (statusCode == 301){
        irl = `https://www.op.gg${res.headers.location}`
        console.log(irl)

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
            reject(this.opgg)
          }

          let rawData = ''
          res.on('data', (chunk) => {rawData += chunk})
          res.on('end', () => {
            const $ = cheerio.load(rawData)
            const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
            const text = $(selector).text().replace(/\t/g, '')
            let text_array = text.split('\n\n')
            text_array[0] = text_array[0].replace(/\n\g/, '')
            text_array[0] = text_array[0].replace(/\r\g/, '')
            text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')
            let text_array2 = $(".champion-stats-header__position__role").text().split(/(?=[A-Z])/)
            this.opgg.theirTeam[4].possiblePositions = text_array2
            this.opgg.theirTeam[4].assignedPosition = text_array2[0]
            console.log(text_array2)
            console.log($('title').text())
            console.log(`${text_array}`)
            console.log("-------------------------------------------------------")

            if(text_array.length == 1){
              this.opgg.theirTeam[4].ban1 = "opgg"
              this.opgg.theirTeam[4].ban2 = "not"
              this.opgg.theirTeam[4].ban3 = "found"
            } else {
              this.opgg.theirTeam[4].ban1 = text_array[0]
              this.opgg.theirTeam[4].ban2 = text_array[1]
              this.opgg.theirTeam[4].ban3 = text_array[2]
            }

            writeFile(path.resolve("opgg", "theirTeam4.json"), JSON.stringify(this.opgg.theirTeam[4]))
            resolve(this.opgg)
          })
        })
      }
    })
  })
  return await p
}


// b1 ci pi 
// 1  0  0
// 1  0  1
// 1  1  0
// 1  1  1
// 0  0  0
// 0  0  1
// 0  1  0
// 0  1  1


function doRequest(url){
  return new Promise((resolve, reject)=>{
    https.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
      
      let error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
        console.log(res.headers.location)
      }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return;
      }
      
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        resolve(rawData)
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
      reject(e)
    });
  })
}
  
module.exports = OpGg