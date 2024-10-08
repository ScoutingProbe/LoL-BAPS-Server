const fs = require('fs')
const os = require('os')
const util = require('util')
const path = require('path')

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const unlink = util.promisify(fs.unlink)

const stringIncludesSession = "rcp-be-lol-champ-select| /lol-champ-select/v1/session: "
const stringIncludesReadyCheck = "rcp-be-lol-gameflow| GAMEFLOW_EVENT.ENTERED_CHAMP_SELECT"
const stringIncludesDodge = "rcp-be-lol-gameflow| Received dodge data."
const stringIncludesGameEnd = "rcp-be-lol-gameflow| GameflowStateMachine HandleEvent 'GAMEFLOW_EVENT.GAME_COMPLETED'"

RiotLeagueLogDao.prototype.isGameComplete = async function(){
    if(this.doubleGameId == 0)
        return false
    const stringFile = await readFile(`${this.stringPath}/${this.stringFile}`, 'utf-8')
    // console.log(`${stringFile}`)
    const fileArray = stringFile.split(os.EOL).reverse()

    let isGameComplete = false
    for(let i = 0; i < fileArray.length; i++){
        if(fileArray[i].includes(stringIncludesGameEnd)) 
            isGameComplete = true
        if(isGameComplete && fileArray[i].includes(this.doubleGameID))
            return true
    }
}

RiotLeagueLogDao.prototype.setSession = async function(){
    this.doubleGameID = await readFile(path.resolve("cache", "gameID.txt"), "utf-8")
    let stringNames = await readdir(this.stringPath)
    stringNames.reverse();
    this.stringFile = stringNames.find(e => e.includes('LeagueClient.log'))
    const stringFile = await readFile(`${this.stringPath}/${this.stringFile}`, 'utf-8')
    // console.log(`${stringFile}`)
    const fileArray = stringFile.split(os.EOL).reverse()

    let stringSession = null
    for(let i = 0; i < fileArray.length; i++){
        let stringLine = fileArray[i]
        // console.log(stringLine)
        if(stringLine.includes(stringIncludesSession)){
            console.log("😎 Session information found!")
            stringSession = stringLine
            break
        }
        else if(stringLine.includes(stringIncludesReadyCheck) || stringLine.includes(stringIncludesDodge)){
            let op_gg_augmented_league = await readFile(path.resolve("lake", `${this.doubleGameID}.json`), 'utf-8')
            op_gg_augmented_league = JSON.parse(op_gg_augmented_league)
            op_gg_augmented_league.gameResult = 'Dodge'
            op_gg_augmented_league.gameResultLink = ''
            await writeFile(path.resolve("lake", `${this.doubleGameID}.json`), JSON.stringify(op_gg_augmented_league))
            this.doubleGameID = "0"
            this.jsonSession = {}
            await writeFile(path.resolve("cache", "gameID.txt"), "0")

            for(let i = 0; i < 5; i++){
                await writeFile(path.resolve("cache", `summoner-myTeam${i}.json`), "{}")
                await writeFile(path.resolve("cache", `summoner-theirTeam${i}.json`), "{}")
            }

            // await writeFile(path.resolve("cache", "matchups-jungle.json"), "{}")
            // await writeFile(path.resolve("cache", "matchups-support.json"), "{}")
            // await writeFile(path.resolve("cache", "matchups-bot.json"), "{}")
            // await writeFile(path.resolve("cache", "matchups-mid.json"), "{}")
            // await writeFile(path.resolve("cache", "matchups-top.json"), "{}")

            console.log("😅 Previous session information cleaned.")
            break
        }
        
    }
    // console.log(stringSession)
    let intStart = stringSession == null ? 0 : stringSession.indexOf('{')
    stringSession = stringSession == null ? "{}" : stringSession.substring(intStart, stringSession.length).replace(/\\/g, '')
    // console.log(stringSession)
    try{
        this.jsonSession = stringSession == null ? {"Ready": "😀 Hover a Champion!"} : JSON.parse(stringSession)
        this.doubleGameID = this.jsonSession.gameId == undefined ? "0" : "" + this.jsonSession.gameId
        // console.log(this.jsonSession)

        await writeFile(path.resolve("cache", "gameID.txt"), "" + this.doubleGameID)
        console.log(`😁 Session ${this.doubleGameID} found!`)
    } catch(error) {
        console.error(error)
        this.jsonSession = {"Error message 😥": error.toString()}
        this.doubleGameID = "1"
    }
}

function RiotLeagueLogDao(){
    this.stringPath = 'C:/Riot Games/League of Legends/Logs/LeagueClient Logs' 
}

module.exports = RiotLeagueLogDao
