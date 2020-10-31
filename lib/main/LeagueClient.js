const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

function LeagueClient(){
    this.directory_path = 'C:/Riot Games/League of Legends/Logs/LeagueClient Logs'
}

LeagueClient.prototype.setLatestFile = async function(){
    let names = await readdir(this.directory_path);
    names.reverse();
    this.latest_file = names.find(element => element.includes('LeagueClient.log'));
}

LeagueClient.prototype.setLatestJson = async function(){
    let content = await readFile(`${this.directory_path}/${this.latest_file}`, 'utf-8');
    content = JSON.stringify(content)
    content = content.split('\\r\\n');
    content.reverse();
    content = content.find(element => element.includes('rcp-be-lol-champ-select| /lol-champ-select/v1/session: '));
    let start = content.indexOf('{');
    content = content.substring(start, content.length);
    content = content.replace(/\\/g, '');
    try{
        this.latest_json = JSON.parse(content);
        // console.log(this.latest_json);
    } catch(error) {
        console.error(error);
    }
}

module.exports = LeagueClient;