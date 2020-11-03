const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

var LeagueClient = require('./lib/main/LeagueClient')
var ChampionNames = require('./lib/main/ChampionNames')

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/league-client-reader', async function(req, res){
    var league_client = new LeagueClient()
    var champion_names = new ChampionNames()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    await champion_names.setChampionNames(league_client.latest_json)
    console.log(champion_names.latest_json)
    res.send(league_client.latest_json)
})

app.listen(port, () => console.log(`http://localhost:3000/league-client-reader`))