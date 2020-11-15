describe("TextToJsonSpec", function(){
  var TextToJson = require('../../resources/TextToJson')
  var textToJson

  beforeEach(function(){
    textToJson = new TextToJson()
  })

  describe('Should be able to getChampionName', function(){
    it('Should have 1 Annie', async function(){
      const expect_key = "1"
      const expect_val = "Annie"
      const championDocument = await textToJson.readChampionId();
      const actual_val = championDocument[1]
      expect(expect_val).toEqual(actual_val)
    })
  })
})

