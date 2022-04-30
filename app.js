const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

var RiotLeagueLogDao = require('./dao/RiotLeagueLogDao')
var OpGgService = require('./service/OpGgService')
var OpGgPositionService = require('./service/OpGgPositionService')

// app.get('/', (req, res) => res.send('Hello World!'))

app.get('/league-client-reader-bans', async function(req, res){
    var league_client = new RiotLeagueLogDao()
    await league_client.setFile()
    await league_client.setSession()

    var op_gg = new OpGgService(league_client.jsonSession)
    await op_gg.getBan("myTeam0.json", 0)
    await op_gg.getBan("myTeam1.json", 1)
    await op_gg.getBan("myTeam2.json", 2)
    await op_gg.getBan("myTeam3.json", 3)
    await op_gg.getBan("myTeam4.json", 4)

    await op_gg.getPick("theirTeam0.json", 0)
    await op_gg.getPick("theirTeam1.json", 1)
    await op_gg.getPick("theirTeam2.json", 2)
    await op_gg.getPick("theirTeam3.json", 3)
    await op_gg.getPick("theirTeam4.json", 4) 
    
    res.send(op_gg.league)
})

app.post('/league-client-reader-picks/:position-:file', async function(req, res){
    var op_gg_position = new OpGgPositionService(req.params.position, req.params.file)
    await op_gg_position.main()
    res.send()
})

app.listen(port, () => {
    console.log(`http://localhost:3000/league-client-reader-bans`)
    console.log(`http://localhost:3000/league-client-reader-picks`)
})