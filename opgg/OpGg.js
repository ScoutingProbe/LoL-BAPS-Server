const TextToJson = require('../text_to_json/TextToJson')
const https = require('https')
const cheerio = require('cheerio')
const { json } = require('express')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
const url = 'https://www.op.gg/champion/!/statistics/@'

function OpGg(latest_json){
  this.opgg_json = latest_json
  
}



function doRequest(url){
  return new Promise((resolve, reject)=>{
    let ttj = new TextToJson()
    await ttj.readChampionId()
    const champion_json = ttj.champion_json
    

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

// OpGg.prototype.getBans = async function(latest_json, former_json){
//   if(former_json == undefined){
//     this.opgg_json = latest_json
//     return 
//   } else if(latest_json == undefined){
//     this.opgg_json = former_json
//     return
//   } else if((former_json == undefined) &&
//             (latest_json == undefined) ){
//     throw new Error("wtf")
//   }

//   let ttj = new TextToJson()
//   await ttj.readChampionId()
//   const champion_json = ttj.champion_json
//   const url = 'https://www.op.gg/champion/!/statistics/@'
//   const selector = "tr[data-champion-id] > td.champion-stats-header-matchup__table__champion:nth-child(1)"
  
//   for(let i = 0; i < 5; i++){
//     const championId = latest_json.myTeam[i].championId == "0" ? latest_json.myTeam[i].championPickIntent : latest_json.myTeam[i].championId
//     const championName = champion_json[championId]

//     // console.log(`${championId} ${championName}`)
    
//     let assignedPosition = latest_json.myTeam[i].assignedPosition
//     switch(assignedPosition){
//       case "bottom": assignedPosition = "bot"; break
//       case "utility": assignedPosition = "support"; break
//       case "middle": assignedPosition = "mid"; break
//     }
    
//     const hasBans = former_json.myTeam[i].ban1 !== undefined
//     const hasChange = (former_json.myTeam[i].championPickIntent != latest_json.championPickIntent) ||
//                       (former_json.myTeam[i].championId != latest_json.myTeam[i].championId)
//     const wasDown = former_json.myTeam[i].wasDown == "OP.GG down :("

//     console.log(`former_json.pi | latest_json.pi: ${former_json.myTeam[i].championPickIntent} ${latest_json.myTeam[i].championPickIntent}`)
//     console.log(`former_json.ci | latest_json.ci: ${former_json.myTeam[i].championId} ${latest_json.myTeam[i].championId}`)
//     // console.log(`hasBans0: ${hasBans} | hasChange0: ${hasChange} | wasDown0: ${wasDown}`)
    
//     if(championName == undefined){
//       continue
//     }
//     if(former_json.myTeam[i]){

//     }


//     if( (hasBans && hasChange && wasDown) ||
//     (hasBans && hasChange && !wasDown) ||
//     (hasBans && !hasChange && wasDown) ||
//     (!hasBans && hasChange && wasDown) ||
//     (!hasBans && hasChange && !wasDown) ||
//     (!hasBans && !hasChange && wasDown) ||
//     (!hasBans && !hasChange && !wasDown)){
//       const irl = url.replace("!", championName).replace("@", assignedPosition)
      


//       const html = await doRequest(irl)

//       console.log(irl)
//       console.log("-------------------------------------------------------")
//       const $ = cheerio.load(html)
//       const text = $(selector).text().replace(/\t/g, '')
//       let text_array = text.split('\n\n')
//       text_array[0] = text_array[0].replace(/\n/g, '')
//       text_array[text_array.length - 1] = text_array[text_array.length-1].replace(/\n/g, '')
      
      
//       // console.log($('title').text())
//       // console.log(`${text_array}`)
      
//       latest_json.myTeam[i].ban1 = text_array[0]
//       latest_json.myTeam[i].ban2 = text_array[1]
//       latest_json.myTeam[i].ban3 = text_array[2]
      
//       this.opgg_json = latest_json
      
//     } else {
//       this.opgg_json = former_json
//     }
//   }
// }
  
module.exports = OpGg