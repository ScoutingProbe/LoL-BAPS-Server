const TextToJson = require('../text_to_json/TextToJson')
const https = require('https')
const path = require('path')
const util = require('util')
const fs = require('fs')
const cheerio = require('cheerio')

const { MongoClient } = require('mongodb')
const { exception } = require('console')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function Mongo(){
}

Mongo.prototype.trashcan = async function(jsonSession){
  let myTeam4 = await readFile(path.resolve("opgg", "myTeam4.json"), "utf-8")
  let theirTeam4 = await readFile(path.resolve("opgg", "theirTeam4.json"), "utf-8")

  myTeam4 = JSON.parse(myTeam4)
  theirTeam4 = JSON.parse(theirTeam4)

  if(myTeam4.assignedPosition == undefined || theirTeam4.assignedPosition == undefined){
    console.log('DB not needed... -_-')
    return
  }

  try{
    let l = jsonSession.matchups.jungle.theirTeam.winrate
  }catch(e){
    console.error(`Mongo#insert op.gg data is missing... T-T ${JSON.stringify(jsonSession.gameId)}`)
    return
  }

  const client = new MongoClient('')
  await client.connect()
  const db = client.db("lol-draft-ban-pick-scraper-mongo")
  const collection = db.collection('a')
  await collection.insertOne(jsonSession)
  console.log(`Insert successfully to lol-draft-ban-pick-scraper-mongo! ^^`)
  await client.close()

  await writeFile(path.resolve("league", "gameID.txt"), "0")

  for(let i = 0; i < 5; i++){
    await writeFile(path.resolve("opgg", `myTeam${i}.json`), "{}")
    await writeFile(path.resolve("opgg", `theirTeam${i}.json`), "{}")
  }

  await writeFile(path.resolve("opgg", "jungle.json"), "{}")
  await writeFile(path.resolve("opgg", "support.json"), "{}")
  await writeFile(path.resolve("opgg", "bot.json"), "{}")
  await writeFile(path.resolve("opgg", "mid.json"), "{}")
  await writeFile(path.resolve("opgg", "top.json"), "{}")

  console.log("Previous Game Information Clean -_-")

  return
}

module.exports = Mongo