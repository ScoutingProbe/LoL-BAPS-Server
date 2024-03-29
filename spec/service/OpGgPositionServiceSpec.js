describe('OpGgPositionService', function(){
  var OpGgPositionService = require('../../service/OpGgPositionService')
  var OpGgService = require('../../service/OpGgService')
  
  beforeEach(async function(){
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000
      const client_json = JSON.parse(`{"actions":[[{"actorCellId":0,"championId":12,"completed":true,"id":0,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":1,"championId":143,"completed":true,"id":1,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":2,"championId":238,"completed":true,"id":2,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":3,"championId":84,"completed":true,"id":3,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":4,"championId":39,"completed":true,"id":4,"isAllyAction":false,"isInProgress":false,"type":"ban"},{"actorCellId":5,"championId":99,"completed":true,"id":5,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":6,"championId":202,"completed":true,"id":6,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":7,"championId":238,"completed":true,"id":7,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":8,"championId":82,"completed":true,"id":8,"isAllyAction":true,"isInProgress":false,"type":"ban"},{"actorCellId":9,"championId":555,"completed":true,"id":9,"isAllyAction":true,"isInProgress":false,"type":"ban"}],[{"actorCellId":-1,"championId":0,"completed":true,"id":101,"isAllyAction":false,"isInProgress":false,"type":"ten_bans_reveal"}],[{"actorCellId":0,"championId":81,"completed":true,"id":10,"isAllyAction":false,"isInProgress":false,"type":"pick"}],[{"actorCellId":5,"championId":35,"completed":true,"id":11,"isAllyAction":true,"isInProgress":false,"type":"pick"},{"actorCellId":6,"championId":18,"completed":true,"id":12,"isAllyAction":true,"isInProgress":false,"type":"pick"}],[{"actorCellId":1,"championId":235,"completed":true,"id":13,"isAllyAction":false,"isInProgress":false,"type":"pick"},{"actorCellId":2,"championId":90,"completed":true,"id":14,"isAllyAction":false,"isInProgress":false,"type":"pick"}],[{"actorCellId":7,"championId":142,"completed":true,"id":15,"isAllyAction":true,"isInProgress":false,"type":"pick"},{"actorCellId":8,"championId":234,"completed":true,"id":16,"isAllyAction":true,"isInProgress":false,"type":"pick"}],[{"actorCellId":3,"championId":64,"completed":true,"id":17,"isAllyAction":false,"isInProgress":false,"type":"pick"},{"actorCellId":4,"championId":15,"completed":true,"id":18,"isAllyAction":false,"isInProgress":false,"type":"pick"}],[{"actorCellId":9,"championId":44,"completed":true,"id":19,"isAllyAction":true,"isInProgress":false,"type":"pick"}]],"allowBattleBoost":false,"allowDuplicatePicks":false,"allowLockedEvents":false,"allowRerolling":false,"allowSkinSelection":true,"bans":{"myTeamBans":[],"numBans":0,"theirTeamBans":[]},"benchChampions":[],"benchEnabled":false,"boostableSkinCount":0,"chatDetails":{"chatRoomName":"429ef7fe-980d-42f1-aafc-c49e3d5ab2cc@champ-select.pvp.net","chatRoomPassword":null,"multiUserChatJWT":"eyJraWQiOiIxIiwiYWxnIjoiUlMyNTYifQ.eyJ0Z3QiOiJuYTEiLCJzdWIiOiIzZjBkZTY1Yy1lMTA0LTUyNDctYjMxZC1hNmNjZWQ0YzgwMTciLCJjaG4iOiI0MjllZjdmZS05ODBkLTQyZjEtYWFmYy1jNDllM2Q1YWIyY2MiLCJ0eXAiOiJsb2wtdGIiLCJleHAiOjE2NjYyMjc4MzEsImlhdCI6MTY2NjIyNzIzMSwianRpIjoiNmRiNmQxNDgtYzI0Yi00OWJmLWE3NTQtYzk0MjEwMTI4ZmIyIn0.OYeIfZMi_eqpNuDA28iqctymW4Ece9F0qWYQqUsyoAxsTT-6mq2ZzHrgZRyb3wjtZoTTzVcX9e2tL24964DMPC5d_oZyLmY4eSiGHcZowSJbxg8OeIFCIYbHKMytmPa1r1ytjzOmbzPPdpszGjEA1E49Xs6zWeqWSArdvYKFtcgMu5iS4Ltj9LsYrC8rTDIaJvu3838SNds-zjY-JqpyXviMwWQjl8aBjf-XqVOV4ORy3y9NBLUkoNyWgjPZiu71KFoRKQdZN0ll0sDvbPDDRIzQmorq04lnr2fz2zB_t5fi5OsHGM7J0aDEzgG7iCgryFBzpzcgnEWqZd45BHz8cw"},"counter":54,"entitledFeatureState":{"additionalRerolls":0,"unlockedSkinIds":[]},"gameId":4469593116,"hasSimultaneousBans":true,"hasSimultaneousPicks":false,"isCustomGame":false,"isSpectating":false,"localPlayerCellId":5,"lockedEventIndex":-1,"myTeam":[{"assignedPosition":"jungle","cellId":5,"championId":35,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":35006,"spell1Id":11,"spell2Id":14,"summonerId":28339051,"team":2,"wardSkinId":1},{"assignedPosition":"bottom","cellId":6,"championId":18,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":18011,"spell1Id":14,"spell2Id":4,"summonerId":121590076,"team":2,"wardSkinId":-1},{"assignedPosition":"middle","cellId":7,"championId":142,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":142018,"spell1Id":4,"spell2Id":14,"summonerId":55406771,"team":2,"wardSkinId":-1},{"assignedPosition":"Jungle","cellId":8,"championId":154,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":121000,"spell1Id":0,"spell2Id":0,"summonerId":58880984,"team":2,"wardSkinId":-1},{"assignedPosition":"utility","cellId":9,"championId":44,"championPickIntent":0,"entitledFeatureType":"NONE","selectedSkinId":44000,"spell1Id":7,"spell2Id":4,"summonerId":114082741,"team":2,"wardSkinId":-1}],"recoveryCounter":0,"rerollsRemaining":0,"skipChampionSelect":false,"theirTeam":[{"assignedPosition":"","cellId":0,"championId":81,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":81000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":1,"wardSkinId":-1},{"assignedPosition":"","cellId":1,"championId":235,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":235000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":1,"wardSkinId":-1},{"assignedPosition":"","cellId":2,"championId":90,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":90000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":1,"wardSkinId":-1},{"assignedPosition":"","cellId":3,"championId":910,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":910000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":1,"wardSkinId":-1},{"assignedPosition":"","cellId":4,"championId":15,"championPickIntent":0,"entitledFeatureType":"","selectedSkinId":15000,"spell1Id":0,"spell2Id":0,"summonerId":0,"team":1,"wardSkinId":-1}],"timer":{"adjustedTimeLeftInPhase":0,"internalNowInEpochMs":1666227436279,"isInfinite":false,"phase":"GAME_STARTING","totalTimeInPhase":0},"trades":[]}`)
      var op_gg_service = new OpGgService(client_json)
      await op_gg_service.getBan("summoner-myTeam3.json", 3)
      await op_gg_service.getPick("summoner-theirTeam3.json", 3)
  })

  // it('main mid ourTeam3.json', async function(){
  //   let op_gg_position_service = new OpGgPositionService("Jungle", "summoner-myTeam3.json")
  //   await op_gg_position_service.main()
  //   console.log(op_gg_position_service.summoner.counters[0].tiers)
  //   console.log(op_gg_position_service.summoner)

  //   op_gg_position_service = new OpGgPositionService("Top", "summoner-myTeam3.json")
  //   await op_gg_position_service.main()
  //   console.log(op_gg_position_service.summoner.counters[0].tiers)
  //   console.log(op_gg_position_service.summoner)

  //   op_gg_position_service = new OpGgPositionService("Support", "summoner-myTeam3.json")
  //   await op_gg_position_service.main()
  //   console.log(op_gg_position_service.summoner.counters[0].tiers)
  //   console.log(op_gg_position_service.summoner)

  //   op_gg_position_service = new OpGgPositionService("Jungle", "summoner-myTeam3.json")
  //   await op_gg_position_service.main()
  //   console.log(op_gg_position_service.summoner.counters[0].tiers)
  //   console.log(op_gg_position_service.summoner)
  // });

  it('main Jungle theirTeam.json', async function(){
    let op_gg_position_service = new OpGgPositionService("Middle", "summoner-theirTeam3.json")
    await op_gg_position_service.main()
    console.log(op_gg_position_service.summoner.counters[0].tiers)
    console.log(op_gg_position_service.summoner)

    op_gg_position_service = new OpGgPositionService("Support", "summoner-theirTeam3.json")
    await op_gg_position_service.main() 
    console.log(op_gg_position_service.summoner.counters[0].tiers)
    console.log(op_gg_position_service.summoner)

    op_gg_position_service = new OpGgPositionService("Middle", "summoner-theirTeam3.json") 
    await op_gg_position_service.main()
    console.log(op_gg_position_service.summoner.counters[0].tiers)
    console.log(op_gg_position_service.summoner)
  })
})