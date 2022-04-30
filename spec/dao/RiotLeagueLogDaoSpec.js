describe("RiotLeagueLogDaoSpec", function(){
    var RiotLeagueLogDao = require('../../dao/RiotLeagueLogDao')

    // it("setLatestFile", async function(){
    //     let league_client = new RiotLeagueLogDao()
    //     const expected = '2021-07-13T15-12-47_12100_LeagueClient.log'
    //     const actual = league_client.stringFile
    //     expect(expected).toEqual(actual)
    // })

    it("test RiotLeagueLogDao.jsonSession dodge", async function(){
        let league_client = new RiotLeagueLogDao()
        league_client.stringPath = "C:/Users/andre/Documents/vscode-workspace/LoL-BAPS-Server/spec/dao"
        league_client.stringFile = "dodge.log"
        await league_client.setSession()
        expect(league_client.doubleGameID).toEqual("0")
        expect(league_client.jsonSession).toEqual({})
    })

    it("test RiotLeagueLogDao.jsonSession session", async function(){
        let league_client = new RiotLeagueLogDao()
        league_client.stringPath = "C:/Users/andre/Documents/vscode-workspace/LoL-BAPS-Server/spec/dao"
        league_client.stringFile = "session.log"
        await league_client.setSession()
        const l = {"actions":[[{"actorCellId":0,"championId":34,"completed":true,"id":0,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":1,"championId":157,"completed":true,"id":1,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":2,"championId":119,"completed":true,"id":2,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":3,"championId":235,"completed":true,"id":3,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":4,"championId":36,"completed":true,"id":4,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":5,"championId":17,"completed":true,"id":5,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":6,"championId":67,"completed":true,"id":6,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":7,"championId":121,"completed":true,"id":7,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":8,"championId":50,"completed":true,"id":8,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":9,"championId":131,"completed":true,"id":9,"isAllyAction":false,"isInProgress":false,"type":"ban"}],[{"actorCellId":-1,"championId":0,"completed":true,"id":100,"isAllyAction":false,"isInProgress":false,"type":"ten_bans_reveal"}],[{"actorCellId":0,"championId":78,"completed":true,"id":10,"isAllyAction":true,"isInProgress":false,"type":"pick"}],[{"actorCellId":5,"championId":75,"completed":true,"id":11,"isAllyAction":false,"isInProgress":false,"type":"pick"},{"actorCellId":6,"championId":81,"completed":true,"id":12,"isAllyAction":false,"isInProgress":false,"type":"pick"}],[{"actorCellId":1,"championId":876,"completed":true,"id":13,"isAllyAction":true,"isInProgress":false,"type":"pick"},{"actorCellId":2,"championId":45,"completed":true,"id":14,"isAllyAction":true,"isInProgress":false,"type":"pick"}],[{"actorCellId":7,"championId":0,"completed":false,"id":15,"isAllyAction":false,"isInProgress":true,"type":"pick"},{"actorCellId":8,"championId":0,"completed":false,"id":16,"isAllyAction":false,"isInProgress":true,"type":"pick"}],[{"actorCellId":3,"championId":9,"completed":false,"id":17,"isAllyAction":true,"isInProgress":false,"type":"pick"},{"actorCellId":4,"championId":240,"completed":false,"id":18,"isAllyAction":true,"isInProgress":false,"type":"pick"}],[{"actorCellId":9,"championId":0,"completed":false,"id":19,"isAllyAction":false,"isInProgress":false,"type":"pick"}]],"allowBattleBoost":false,"allowDuplicatePicks":false,"allowLockedEvents":false,"allowRerolling":false,"allowSkinSelection":true,"bans":{"myTeamBans":[],"numBans":0,"theirTeamBans":[]},"benchChampionIds":[],"benchEnabled":false,"boostableSkinCount":0,"chatDetails":{"chatRoomName":"f39c3bea-98c7-403d-ae0b-a619f43dc859@champ-select.pvp.net","chatRoomPassword":null},"counter":41,"entitledFeatureState":{"additionalRerolls":0,"unlockedSkinIds":[]},"gameId":3978256318,"hasSimultaneousBans":true,"hasSimultaneousPicks":false,"isCustomGame":false,"isSpectating":false,"localPlayerCellId":0,"lockedEventIndex":-1,"myTeam":[{"assignedPosition":"jungle","cellId":0,"championId":78,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":78007,"spell1Id":11,"spell2Id":4,"summonerId":28339051,"team":1,"wardSkinId":1},{"assignedPosition":"middle","cellId":1,"championId":876,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":876000,"spell1Id":14,"spell2Id":4,"summonerId":2650566872246176,"team":1,"wardSkinId":-1},{"assignedPosition":"bottom","cellId":2,"championId":45,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":45000,"spell1Id":4,"spell2Id":21,"summonerId":2565155668853984,"team":1,"wardSkinId":-1},{"assignedPosition":"utility","cellId":3,"championId":0,"championPickIntent":9,"entitledFeatureType":"NONE","selectedSkinId":0,"spell1Id":14,"spell2Id":12,"summonerId":2700171504862848,"team":1,"wardSkinId":-1},{"assignedPosition":"top","cellId":4,"championId":0,"championPickIntent":240,"entitledFeatureType":"NONE","selectedSkinId":0,"spell1Id":14,"spell2Id":4,"summonerId":98913414,"team":1,"wardSkinId":-1}],"rerollsRemaining":0,"skipChampionSelect":false,"theirTeam":[{"assignedPosition":"","cellId":5,"championId":75,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":75000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":6,"championId":81,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":81000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":7,"championId":0,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":0,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":8,"championId":0,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":0,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":9,"championId":0,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":0,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1}],"timer":{"adjustedTimeLeftInPhase":29996,"internalNowInEpochMs":1626398504845,"isInfinite":false,"phase":"BAN_PICK","totalTimeInPhase":30000},"trades":[]}
        expect(league_client.doubleGameID).toEqual("3978256318")
        expect(league_client.jsonSession).toEqual(l)
    })

    it("test RiotLeagueLogDao.jsonSession readyCheck", async function(){
        let league_client = new RiotLeagueLogDao()
        league_client.stringPath = "C:/Users/andre/Documents/vscode-workspace/LoL-BAPS-Server/spec/dao"
        league_client.stringFile = "readyCheck.log"
        await league_client.setSession()
        expect(league_client.doubleGameID).toEqual("0")
        expect(league_client.jsonSession).toEqual({})
    })
    
})
