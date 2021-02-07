var mysql = require('mysql');

function LolcounterDatabase(){
}

LolcounterDatabase.prototype.connect = function(){
    this.connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "lolcounter"
    });
}

LolcounterDatabase.prototype.queryChampion = function(){
    this.connection.query("SELECT * FROM champion;", async function (error, result) {
        if (error) throw error;
        this.champion = {};
        
        await Promise.all(
            result.forEach(function(champion){
                this.champion[champion.champion_id] = champion.name;
            })
        )

        console.log(` this.champion ${this.champion}`);
    });
}

module.exports = LolcounterDatabase;