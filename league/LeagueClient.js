const fs = require('fs');
const os = require('os');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

function LeagueClient(){
    if(os.type() == "Windows_NT")
        this.directory_path = 'C:/Riot Games/League of Legends/Logs/LeagueClient Logs' 
    else 
        this.directory_path = '/Applications/League of Legends.app/Contents/LoL/Logs/LeagueClient Logs' 
    
}

LeagueClient.prototype.setLatestFile = async function(){
    let names = await readdir(this.directory_path);
    names.reverse();
    this.latest_file = names.find(element => element.includes('LeagueClient.log'));
}

LeagueClient.prototype.setLatestJson = async function(){
    const file_string = await readFile(`${this.directory_path}/${this.latest_file}`, 'utf-8');
    // const file_array = file_string.split('\\r\\n'); #TODO windows
    const file_array = file_string.split(os.EOL);
    const file_array_reverse = file_array.reverse();
    const searchForMe = "rcp-be-lol-champ-select| /lol-champ-select/v1/session: ";
    let resultString = "";
    for(let i = 0; i < file_array_reverse.length; i++){
        let line = file_array_reverse[i];
        if(line.includes(searchForMe)){
            resultString = line;
            break;
        }
    }
    let start = resultString === null ? 0 : resultString.indexOf('{');
    resultString = resultString === null ? "{}" : resultString.substring(start, resultString.length);
    resultString = resultString.replace(/\\/g, '');
    // console.log(resultString);
    try{
        this.league = resultString === "" ? {} : JSON.parse(resultString);
        // console.log(this.latest_json);
    } catch(error) {
        console.error(error);
        this.league = {};
    }
}

module.exports = LeagueClient;