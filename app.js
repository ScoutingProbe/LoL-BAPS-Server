const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

var LeagueClient = require('./lib/main/LeagueClient')
var OpGg = require('./lib/main/OpGg')

var former_json = 0

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/league-client-reader', async function(req, res){
    var league_client = new LeagueClient()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    res.send(league_client.latest_json)
})

app.get('/league-client-reader-bans', async function(req, res){
    var league_client = new LeagueClient()
    var op_gg = new OpGg()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    
    if(former_json == 0){
        former_json = league_client.latest_json
    }

    // console.log(`latest_json ${league_client.latest_json.myTeam}`)
    // console.log(`former_json ${former_json.myTeam}`)

    await op_gg.getBans(league_client.latest_json, former_json)
    former_json = op_gg.opgg_json
    res.send(former_json)
})

app.listen(port, () => {
    console.log(`http://localhost:3000/league-client-reader`)
    console.log(`http://localhost:3000/league-client-reader-bans`)
})