const express = require('express')
const cors = require('cors')
const fs = require('fs')
const util = require('util')
const path = require('path')

const app = express()
const port = 3000

const writeFile = util.promisify(fs.writeFile)

app.use(cors())

var RiotLeagueLogDao = require('./dao/RiotLeagueLogDao')
var OpGgService = require('./service/OpGgService')
var OpGgPositionService = require('./service/OpGgPositionService')
var OpGgTierService = require('./service/OpGgTierService')
var BapsCounterService = require('./service/BapsCounterService')

// app.get('/', (req, res) => res.send('Hello World!'))

app.get('/league-client-reader-bans', async function(req, res){
    var league_client = new RiotLeagueLogDao()
    await league_client.setFile()
    await league_client.setSession()

    var op_gg = new OpGgService(league_client.jsonSession)
    await op_gg.getBan("summoner-myTeam0.json", 0)
    await op_gg.getBan("summoner-myTeam1.json", 1)
    await op_gg.getBan("summoner-myTeam2.json", 2)
    await op_gg.getBan("summoner-myTeam3.json", 3)
    await op_gg.getBan("summoner-myTeam4.json", 4)

    await op_gg.getPick("summoner-theirTeam0.json", 0)
    await op_gg.getPick("summoner-theirTeam1.json", 1)
    await op_gg.getPick("summoner-theirTeam2.json", 2)
    await op_gg.getPick("summoner-theirTeam3.json", 3)
    await op_gg.getPick("summoner-theirTeam4.json", 4) 
    
    await writeFile(path.resolve("cache", "reference-opgg.json"), JSON.stringify(op_gg.league))
    res.send(op_gg.league)
})

app.post('/opgg-positions/:position-:file', async function(req, res){
    var op_gg_position = new OpGgPositionService(req.params.position, req.params.file)
    await op_gg_position.main()
    res.send()
})

app.get('/opgg-tiers', async function(req, res){
    var op_gg_tiers = new OpGgTierService()
    const tierUpdateTimestamp = await op_gg_tiers.main()
    res.send(tierUpdateTimestamp)
})

app.post('/baps-counters/:file-:key', async function(req, res){
    var baps_counters = new BapsCounterService(req.params.file, req.params.key)
    await baps_counters.main()
    res.send()
})

app.listen(port, () => {
    console.log(`😤 Listening on http://localhost:3000/`)
})