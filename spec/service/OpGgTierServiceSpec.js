describe('OpGgTierService', function(){
    var OpGgTierService = require('../../service/OpGgTierService')
    var OpGgService = require('../../service/OpGgService')

    beforeEach(async function(){
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
    })

    it('main', async function(){
        const op_gg_tier_service = new OpGgTierService()
        await op_gg_tier_service.main()
    })

})