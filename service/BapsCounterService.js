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
    let summoner = await readFile(path.resolve('cache', `${this.file}.json`), 'utf-8')
    summoner = JSON.parse(summoner)
    
    let tiers
    let tier = summoner.counters.tiers
    
    let counters = summoner.counters
    console.log(JSON.stringify(counters))



    // counters = counters.sort((a, b)=>{
    //     if(a.played > b.played) 
    //         return 1
    //     else if (a.played < b.played) 
    //         return -1
    //     else if(a.played == b.played){
    //         if(a.tiers){
    //             let win_a = a.win
    //             win_a = win_a.substring(0, 5)
    //             win_a = parseFloat(win_a)

    //             let win_b = b.win
    //             win_b = win_b.substring(0, 5)
    //             win_b = parseFloat(win_b)
    //         }
    //         if(win_a > win_b)
    //             return 1
    //         else if(win_a < win_b)
    //             return -1
    //         else 
    //             return 0
            

    //     }
    // })

    // switch(this.key){
    //     case 'Win Rates':
    //         break
    //     case 'Sample Sizes':
    //         break
    //     case 'Tiers':
    //         break

    // }

    summoner.counters = counters
    summoner = JSON.stringify(summoner)
    
    // await writeFile(path.resolve('cache', `${this.file}.json`), 'utf-8')
}

module.exports = BapsCounterService