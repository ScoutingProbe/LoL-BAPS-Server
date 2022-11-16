const path = require('path')
const util = require('util')
const fs = require('fs')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

function BapsCounterService(file, key){
    this.file = file
    this.key = key
    console.log(`BansCounterService sorting... ${this.file} ${this.key}`)
}

BapsCounterService.prototype.main = async function(){
    let summoner = await readFile(path.resolve('cache', `summoner-${this.file}.json`), 'utf-8')
    summoner = JSON.parse(summoner)
    
    let counters = summoner.counters
    // console.log(util.inspect(counters, false, null, true))



    switch(this.key){
        case 'winratios':
            counters = counters.sort((a, b)=>{
                // console.log(`${parseFloat(a.win.replace('%', ''))} ${a.win}`)
                // console.log(`${parseFloat(b.win.replace('%', ''))} ${b.win}`)
                if(parseFloat(a.win.replace('%', '')) > parseFloat(b.win.replace('%', ''))) 
                    return -1
                else if (parseFloat(a.win.replace('%', '')) < parseFloat(b.win.replace('%', ''))) 
                    return 1
                else
                    return 0
            })
            break
        case 'samplesizes':
            counters = counters.sort((a, b)=>{
                // console.log(`${parseInt(a.played.replace(',', ''))} ${a.played}`)
                // console.log(`${parseInt(b.played.replace(',', ''))} ${b.played}`)
                if(parseInt(a.played.replace(',', '')) > parseInt(b.played.replace(',', ''))) 
                    return -1
                else if (parseInt(a.played.replace(',', '')) < parseInt(b.played.replace(',', ''))) 
                    return 1
                else
                    return 0
            })
            break
        case 'tiers':
            counters = counters.sort((a, b)=>{
                // console.log(`${a.tiers[0].tier}`)
                // console.log(`${b.tiers[0].tier}`)
                if(a.tiers == undefined || b.tiers == undefined)
                    return 1
                else if(a.tiers[0].tier > b.tiers[0].tier) 
                    return 1
                else if (a.tiers[0].tier < b.tiers[0].tier) 
                    return -1
                else
                    return 0
            })
            break
    }

    // console.log(util.inspect(counters, false, null, true))

    summoner.counterSortKey = this.key
    summoner.counters = counters
    summoner = JSON.stringify(summoner)
    
    await writeFile(path.resolve('cache', `summoner-${this.file}.json`), summoner)
}

module.exports = BapsCounterService