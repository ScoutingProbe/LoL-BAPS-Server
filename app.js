const express = require('express')
const app = express()
const port = 3000

var LeagueClient = require('./lib/main/LeagueClient')

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/league-client-reader', async function(req, res){
    var league_client = new LeagueClient();
    await league_client.setLatestFile();
    await league_client.setLatestJson();
    res.send(league_client.latest_json);
})

app.listen(port, () => console.log(`http://localhost:3000/league-client-reader`))