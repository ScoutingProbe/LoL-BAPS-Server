const OpGgDao = require('../dao/OpGgDao')

function OpGgSummonerService(){
}


OpGgSummonerService.prototype.main = async function(region, summonername, summonertag, myTeam0, myTeam1, myTeam2, myTeam3, myTeam4){
    const opgg_dao = new OpGgDao()
    let lastUpdated = await opgg_dao.getLastUpdated(region, summonername, summonertag)
    if (lastUpdated.includes('Available in'))
        setTimeout(async function(){this.main(region, summonername, summonertag, myTeam0, myTeam1, myTeam2, myTeam3, myTeam4)}, 120000)
    else
        await opgg_dao.requestMatchHistory(region, summonername, summonertag, myTeam0, myTeam1, myTeam2, myTeam3, myTeam4)
    
}

module.exports = OpGgSummonerService