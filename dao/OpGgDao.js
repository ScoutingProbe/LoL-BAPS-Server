const fs = require('fs')
const util = require('util')
const path = require('path')
const puppeteer = require('puppeteer')

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
    const championNumber = championDocumentLinePair[1].replace('\r', '')
    // console.log(`${championName} ${championNumber}`)
    championJson[championNumber] = championName
  }
  this.champion_json = championJson
}

OpGgDao.prototype.writeChampionId = async function(){
  await writeFile(path.resolve("cache", "RiotChampionsIDs.json"), JSON.stringify(this.champion_json))
  console.log(this.champion_json)
}

OpGgDao.prototype.requestCounters = async function(name, role){
  let url = `https://www.op.gg/champions/${name}/counters/${role}`
  // url += '?tier=all'
  // url += '&region=na'
  console.log(`😫 ${url} request sent`)
  const browser = await puppeteer.launch({
    headless: 'new', 
    args: [
      '--window-size=1920,1080'
    ],
    defaultViewport: {
      width: 1920, height: 1080
    }
  })
  const page = await browser.newPage()
  await page.goto(url)

  const scraped = await page.evaluate(()=>{
    return[
      Array.from(document.getElementsByClassName("css-72rvq0 ee0p1b94")).map(function(i){ return i.textContent}),
      Array.from(document.getElementsByClassName("css-ekbdas ee0p1b92")).map(function(i){ return i.textContent}),
      Array.from(document.getElementsByClassName("css-1nfew2i ee0p1b90")).map(function(i){ return i.textContent}),
      document.getElementsByClassName("css-ya0ckv e19c8h541").item(0) == null ? null : document.getElementsByClassName("css-ya0ckv e19c8h541").item(0).firstChild.firstChild.alt,
      document.getElementsByClassName("css-1yesfem e19c8h541").item(0) == null ? null : document.getElementsByClassName("css-1yesfem e19c8h541").item(0).firstChild.firstChild.alt,
      document.getElementsByClassName("css-1yesfem e19c8h541").item(1) == null ? null : document.getElementsByClassName("css-1yesfem e19c8h541").item(1).firstChild.firstChild.alt
    ]
  })

  await browser.close()

  // console.log(scraped)

  const counters = []
  for(let i = 0; i < scraped[0].length; i++){
    counters.push(
      {
        'counter': scraped[0][i],
        'win': scraped[1][i],
        'played': scraped[2][i]
      }
    )
  }

  counters.sort((a, b) => {
    let winA = a.win.replace('%', '')
    let winB = b.win.replace('%', '')

    winA = parseFloat(winA)
    winB = parseFloat(winB)
    
    return winB - winA
  })

  const lanes = [ scraped[3], scraped[4], scraped[5] ]

  for(let i = 0; i < lanes.length; i++){
    if(lanes[i] == undefined){
      lanes.splice(i)
    }
  }

  // console.log(lanes)
  // console.log(JSON.stringify([counters, lanes]))

  console.log(`😎 ${url} request complete`)
  return [ counters, lanes]
}

OpGgDao.prototype.requestTiers = async function(region, tier, position){
  let url = `https://www.op.gg/champions?region=${region}&tier=${tier}&position=${position}`
  console.log(`😫 ${url} request sent`)
  const browser = await puppeteer.launch({
    headless: 'new', 
    args: [
      '--window-size=1920,1080'
    ],
    defaultViewport: {
      width: 1920, height: 1080
    }
  })
  const page = await browser.newPage()
  await page.goto(url)

  const scraped = await page.evaluate(()=>{
    let scrapelength = document.getElementsByTagName('tbody').item(0).children.length
    let scraped = []
    for (let i = 0; i < scrapelength; i++){
      if(document.getElementsByTagName('tbody').item(0).children.item(i).children.item(1) == null)
        continue
      scraped.push(
        [ document.getElementsByTagName('tbody').item(0).children.item(i).children.item(1).textContent, 
          document.getElementsByTagName('tbody').item(0).children.item(i).children.item(2).textContent
        ]
      )
    }
    return scraped
  })

  await browser.close()

  console.log(`😎 ${url} request complete`)
  return scraped
}

OpGgDao.prototype.requestMatchHistory = async function(region, summonername, summonertag, myTeam0, myTeam1, myTeam2, myTeam3, myTeam4){
  let url = `https://www.op.gg/summoners/${region}/${summonername}-${summonertag}`
  console.log(`😫 ${url} request match history request sent`)
  const browser = await puppeteer.launch({
    headless: false, 
    args: [
      '--window-size=1920,1080'
    ],
    defaultViewport: {
      width: 1920, height: 1080
    }
  })
  const page = await browser.newPage()
  await page.goto(url)
  
  page.on('dialog', async dialog => {
    //get alert message
    console.log(dialog.message());
    //accept alert
    await dialog.accept();
 })
  
  while(true){
    try{
      await page.evaluate(()=>{
        document.querySelector(".buttons > button").click()
      })
    } catch(e){ 
      break 
    }
    let divLastUpdate = await page.evaluate(()=>{
      return document.getElementsByClassName('last-update').item(0).textContent
    })
    console.log(divLastUpdate)
    if(divLastUpdate.includes("Available in ") ||
        divLastUpdate.includes("Last updated: a few seconds ago"))
      break
    await page.goto(url)
  }

  const expandElement = await page.waitForSelector("pierce/div.css-1jxewmm > div:nth-of-type(1) div.actions > button")
  await expandElement.click()
  await page.waitForSelector("td.champion > a > div > img") // await new Promise(resolve => setTimeout(resolve, 1000))
  const myTeam = await page.evaluate(()=>{
    return [
      document.querySelectorAll("td.champion > a > div > img").item(0).alt,
      document.querySelectorAll("td.champion > a > div > img").item(1).alt,
      document.querySelectorAll("td.champion > a > div > img").item(2).alt,
      document.querySelectorAll("td.champion > a > div > img").item(3).alt,
      document.querySelectorAll("td.champion > a > div > img").item(4).alt  
    ]
  })
  const result = await page.evaluate(()=>{
    return {
      'result': document.querySelector("span.result").innerHTML,
      'link': document.querySelector("input.copy-link").value
    }
  })
  await browser.close()
  console.log(result)
  console.log(`${myTeam0} ${myTeam1} ${myTeam2} ${myTeam3} ${myTeam4}`)
  console.log(`${myTeam}`)
  console.log(`😎 ${url} request match history request complete`)
  return result
}


module.exports = OpGgDao