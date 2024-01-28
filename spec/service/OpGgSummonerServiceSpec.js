describe("OpGgSummonerServiceSpec", function(){
    var OpGgSummonerService = require("../../service/OpGgSummonerService")
  
    beforeEach(async function(){
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000
    })

    describe("main", function(){
        it("should return the latest match result (victory or defeat)", async function(){
            const op_gg_summoner_service = new OpGgSummonerService()
            await op_gg_summoner_service.main('na', 'Abomination', 'flame', 'Jimmy Bimmy', 'rankONyou123', 'Abomination', 'geet31', 'Cirqix')
            //await op_gg_summoner_service.main('na', 'Abomination', 'flame', 'Sörcha', 'arimic', 'Abomination', 'the carzy', 'Polenta Monster')
        })
    })
})