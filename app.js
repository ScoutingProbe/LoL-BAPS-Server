const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

var LeagueClient = require('./lib/main/LeagueClient')

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/league-client-reader', async function(req, res){
    var league_client = new LeagueClient()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    res.send(league_client.latest_json)
})

app.get('/league-client-reader-with-names', async function(req, res){
    var league_client = new LeagueClient()
    await league_client.setLatestFile()
    await league_client.setLatestJson()
    await champion_names.setChampionNames(league_client.latest_json)
    console.log(champion_name.latest_json)
    res.send(league_client.latest_json)
})

app.listen(port, () => {
    console.log(`http://localhost:3000/league-client-reader`)
    console.log(`http://localhost:3000/league-client-reader-with-names`)
})