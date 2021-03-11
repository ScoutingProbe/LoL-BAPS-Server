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
//     res.send(league_client.league)
// })

app.get('/league-client-reader-bans', async function(req, res){
    var league_client = new LeagueClient()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    var op_gg = new OpGg(league_client.league)
    await op_gg.getBanFirst()
    await op_gg.getBanSecond()
    await op_gg.getBanThird()
    await op_gg.getBanFourth()
    await op_gg.getBanFifth()
    await op_gg.getPickFirst()
    await op_gg.getPickSecond()
    await op_gg.getPickThird()
    await op_gg.getPickFourth()
    await op_gg.getPickFifth()
    res.send(op_gg.opgg)
})

app.post('league-client-reader-picks', async function(req, res){
    res.send(op_gg.opgg)
})

app.listen(port, () => {
    console.log(`http://localhost:3000/league-client-reader`)
    console.log(`http://localhost:3000/league-client-reader-bans`)
})