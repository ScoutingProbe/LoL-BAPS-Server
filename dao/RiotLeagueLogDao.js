const fs = require('fs')
const os = require('os')
const util = require('util')
const path = require('path')

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const stringIncludesSession = "rcp-be-lol-champ-select| /lol-champ-select/v1/session: "
const stringIncludesReadyCheck = "rcp-be-lol-gameflow| GAMEFLOW_EVENT.ENTERED_CHAMP_SELECT"
const stringIncludesDodge = "rcp-be-lol-gameflow| Received dodge data."

RiotLeagueLogDao.prototype.setSession = async function(){
    const stringFile = await readFile(`${this.stringPath}/${this.stringFile}`, 'utf-8')
    // console.log(`${stringFile}`)
    const fileArray = stringFile.split(os.EOL).reverse()

    let stringSession = null
    for(let i = 0; i < fileArray.length; i++){
        let stringLine = fileArray[i]
        // console.log(stringLine)
        if(stringLine.includes(stringIncludesSession)){
            console.log("Session Information Found! ^^")
            stringSession = stringLine
            break
        }
        else if(stringLine.includes(stringIncludesReadyCheck) ||
                stringLine.includes(stringIncludesDodge)        ){
            this.doubleGameID = "0"
            this.jsonSession = {}
            await writeFile(path.resolve("cache", "gameID.txt"), "0")

            for(let i = 0; i < 5; i++){
                await writeFile(path.resolve("cache", `myTeam${i}.json`), "{}")
                await writeFile(path.resolve("cache", `theirTeam${i}.json`), "{}")
            }

            await writeFile(path.resolve("cache", "jungle.json"), "{}")
            await writeFile(path.resolve("cache", "support.json"), "{}")
            await writeFile(path.resolve("cache", "bot.json"), "{}")
            await writeFile(path.resolve("cache", "mid.json"), "{}")
            await writeFile(path.resolve("cache", "top.json"), "{}")

            console.log("Previous Game Information Clean -_-")
            break
        }
        
    }
    // console.log(stringSession)
    let intStart = stringSession == null ? 0 : stringSession.indexOf('{')
    stringSession = stringSession == null ? "{}" : stringSession.substring(intStart, stringSession.length).replace(/\\/g, '')
    // console.log(stringSession)
    try{
        this.jsonSession = stringSession == null ? {"Ready": "Hover a Champion! :D"} : JSON.parse(stringSession)
        this.doubleGameID = this.jsonSession.gameId == undefined ? "0" : "" + this.jsonSession.gameId
        // console.log(this.jsonSession)

        await writeFile(path.resolve("cache", "gameID.txt"), "" + this.doubleGameID)
        console.log(`Session GameID ${this.doubleGameID} found! ^^ `)
    } catch(error) {
        console.error(error)
        this.jsonSession = {"Error Message T-T": error.toString()}
        this.doubleGameID = "1"
    }
}

RiotLeagueLogDao.prototype.setFile = async function(){
    this.doubleGameID = await readFile(path.resolve("cache", "gameID.txt"), "utf-8")

    let stringNames = await readdir(this.stringPath)
    stringNames.reverse();
    this.stringFile = stringNames.find(e => e.includes('LeagueClient.log'))
}

function RiotLeagueLogDao(){
    if(os.type() == "Windows_NT")
        this.stringPath = 'C:/Riot Games/League of Legends/Logs/LeagueClient Logs' 
    else 
        this.stringPath = '/Applications/League of Legends.app/Contents/LoL/Logs/LeagueClient Logs' 
}

module.exports = RiotLeagueLogDao
