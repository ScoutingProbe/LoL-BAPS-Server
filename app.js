const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

var LeagueClient = require('./league/LeagueClient')
var OpGg = require('./opgg/OpGg')

app.get('/', (req, res) => res.send('Hello World!'))
// app.get('/league-client-reader', async function(req, res){
//     var league_client = new LeagueClient()
//     await league_client.setLatestFile()
//     await league_client.setLatestJson()
//     res.send(league_client.latest_json)
// })

app.get('/league-client-reader-bans', async function(req, res){
    var league_client = new LeagueClient()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    var op_gg = new OpGg(league_client.latest_json)
    await op_gg.getBans()
    res.send(op_gg.opgg_json)
})

app.listen(port, () => {
    console.log(`http://localhost:3000/league-client-reader`)
    console.log(`http://localhost:3000/league-client-reader-bans`)
})