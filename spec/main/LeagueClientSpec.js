describe("LeagueClient", function(){
    var LeagueClient = require('../../lib/main/LeagueClient')
    var league_client;

    beforeEach(function(){
        league_client = new LeagueClient();
    });

    it("should have a directory_path", function(){
        // const expected = 'C:/Riot Games/League of Legends/Logs/LeagueClient Logs';
        const expected = '/Applications/League of Legends.app/Contents/LoL/Logs/LeagueClient Logs';
        const actual = league_client.directory_path;
        expect(expected).toEqual(actual);
    });


    describe("LeagueClient setLatestFile", function(){
        beforeEach(async function(){
            await league_client.setLatestFile();
        })

        it("should have a latest_file", function(){
            const expected = '2020-10-31T13-10-41_832_LeagueClient.log'
            const actual = league_client.latest_file;
            expect(expected).toEqual(actual);
        })
    });

    describe("LeagueClient setLatestJson", function(){
        beforeEach(async function(){
            await league_client.setLatestFile();
            await league_client.setLatestJson();
        })

        it("should have a latest_json", function(){
            const expected = {"actions":[[{"actorCellId":0,"championId":11,"completed":true,"id":0,"isAllyAction":true,"type":"ban"},{"actorCellId":1,"championId":555,"completed":true,"id":1,"isAllyAction":true,"type":"ban"},{"actorCellId":2,"championId":157,"completed":true,"id":2,"isAllyAction":true,"type":"ban"},{"actorCellId":3,"championId":875,"completed":true,"id":3,"isAllyAction":true,"type":"ban"},{"actorCellId":4,"championId":53,"completed":true,"id":4,"isAllyAction":true,"type":"ban"},{"actorCellId":5,"championId":17,"completed":true,"id":5,"isAllyAction":false,"type":"ban"},{"actorCellId":6,"championId":24,"completed":true,"id":6,"isAllyAction":false,"type":"ban"},{"actorCellId":7,"championId":53,"completed":true,"id":7,"isAllyAction":false,"type":"ban"},{"actorCellId":8,"championId":142,"completed":true,"id":8,"isAllyAction":false,"type":"ban"},{"actorCellId":9,"championId":25,"completed":true,"id":9,"isAllyAction":false,"type":"ban"}],[{"actorCellId":-1,"championId":0,"completed":true,"id":102,"isAllyAction":false,"type":"ten_bans_reveal"}],[{"actorCellId":0,"championId":48,"completed":true,"id":10,"isAllyAction":true,"type":"pick"}],[{"actorCellId":5,"championId":82,"completed":true,"id":11,"isAllyAction":false,"type":"pick"},{"actorCellId":6,"championId":203,"completed":true,"id":12,"isAllyAction":false,"type":"pick"}],[{"actorCellId":1,"championId":16,"completed":true,"id":13,"isAllyAction":true,"type":"pick"},{"actorCellId":2,"championId":131,"completed":true,"id":14,"isAllyAction":true,"type":"pick"}],[{"actorCellId":7,"championId":235,"completed":true,"id":15,"isAllyAction":false,"type":"pick"},{"actorCellId":8,"championId":45,"completed":true,"id":16,"isAllyAction":false,"type":"pick"}],[{"actorCellId":3,"championId":86,"completed":true,"id":17,"isAllyAction":true,"type":"pick"},{"actorCellId":4,"championId":236,"completed":true,"id":18,"isAllyAction":true,"type":"pick"}],[{"actorCellId":9,"championId":22,"completed":true,"id":19,"isAllyAction":false,"type":"pick"}]],"allowBattleBoost":false,"allowDuplicatePicks":false,"allowLockedEvents":false,"allowRerolling":false,"allowSkinSelection":true,"bans":{"myTeamBans":[],"numBans":0,"theirTeamBans":[]},"benchChampionIds":[],"benchEnabled":false,"boostableSkinCount":0,"chatDetails":{"chatRoomName":"ed7255b0-da05-441e-a027-2d54ddd879c0@champ-select.pvp.net","chatRoomPassword":null},"counter":42,"entitledFeatureState":{"additionalRerolls":0,"unlockedSkinIds":[]},"hasSimultaneousBans":true,"hasSimultaneousPicks":false,"isSpectating":false,"localPlayerCellId":4,"lockedEventIndex":-1,"myTeam":[{"assignedPosition":"JUNGLE","cellId":0,"championId":48,"championPickIntent":0,"entitledFeatureType":"NONE","playerType":"","selectedSkinId":48006,"spell1Id":4,"spell2Id":11,"summonerId":91526462,"team":1,"wardSkinId":-1},{"assignedPosition":"UTILITY","cellId":1,"championId":16,"championPickIntent":0,"entitledFeatureType":"NONE","playerType":"","selectedSkinId":16007,"spell1Id":7,"spell2Id":4,"summonerId":23260862,"team":1,"wardSkinId":-1},{"assignedPosition":"MIDDLE","cellId":2,"championId":131,"championPickIntent":0,"entitledFeatureType":"NONE","playerType":"","selectedSkinId":131022,"spell1Id":14,"spell2Id":4,"summonerId":53408103,"team":1,"wardSkinId":-1},{"assignedPosition":"TOP","cellId":3,"championId":86,"championPickIntent":0,"entitledFeatureType":"NONE","playerType":"","selectedSkinId":86022,"spell1Id":14,"spell2Id":4,"summonerId":94231375,"team":1,"wardSkinId":-1},{"assignedPosition":"BOTTOM","cellId":4,"championId":236,"championPickIntent":0,"entitledFeatureType":"NONE","playerType":"","selectedSkinId":236000,"spell1Id":7,"spell2Id":4,"summonerId":24481735,"team":1,"wardSkinId":1}],"rerollsRemaining":0,"skipChampionSelect":false,"theirTeam":[{"assignedPosition":"","cellId":5,"championId":82,"championPickIntent":0,"entitledFeatureType":"","playerType":"","selectedSkinId":82000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":6,"championId":203,"championPickIntent":0,"entitledFeatureType":"","playerType":"","selectedSkinId":203000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":7,"championId":235,"championPickIntent":0,"entitledFeatureType":"","playerType":"","selectedSkinId":235000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":8,"championId":45,"championPickIntent":0,"entitledFeatureType":"","playerType":"","selectedSkinId":45000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1},{"assignedPosition":"","cellId":9,"championId":22,"championPickIntent":0,"entitledFeatureType":"","playerType":"","selectedSkinId":22000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":2,"wardSkinId":-1}],"timer":{"adjustedTimeLeftInPhase":0,"adjustedTimeLeftInPhaseInSec":0,"internalNowInEpochMs":1580715710309,"isInfinite":false,"phase":"GAME_STARTING","timeLeftInPhase":0,"timeLeftInPhaseInSec":0,"totalTimeInPhase":0},"trades":[]};
            const actual = league_client.latest_json;
            expect(expected).toEqual(actual);
        })
    })
});