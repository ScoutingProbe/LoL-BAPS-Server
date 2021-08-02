describe("SkinnerSpec", function(){
  var Skinner = require('../../skins/Skinner')
  var skinner

  beforeEach(function(){
    skinner = new Skinner()
  })

  describe('Should be able to getChampionName', function(){
    it('Should have 1 Annie', async function(){
      const expect_key = "Varus"
      const expect_val = "Vayne"
      await skinner.readReckoning();
      const picks = skinner.picks;
      const actual_val = picks
      expect(expect_val).toEqual(actual_val)
    })
  })
})

