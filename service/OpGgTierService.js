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

OpGgTierService.prototype.main = async function(){
  let past = await readFile(path.resolve("cache", "tiers-update-time.txt"), "utf-8")
  past = new Date(past)
  
  const present = new Date()
  
  const difference = present - past

  console.log(`😐 ${difference} MilliSeconds since last OpGg Tiers scraped`)

  if(difference < 600000){
    return past.toLocaleString()
  }

  let region = await readFile(path.resolve("config", "opgg-region.txt"), "utf-8")
  region = region.split("\n")[14]
  let tier = await readFile(path.resolve("config", "opgg-tier.txt"), "utf-8")
  tier = tier.split("\n")[16]

  console.log(`😐 OP.GG region is ${region} and summoner rank is ${tier}`)

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
}

module.exports = OpGgTierService