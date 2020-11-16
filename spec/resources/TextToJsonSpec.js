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
      await textToJson.readChampionId();
      const championDocument = textToJson.champion_json;
      const actual_val = championDocument[1]
      expect(expect_val).toEqual(actual_val)
    })
  })

  describe('Should be able to writeChampionName', function(){
    it('should be able to write', async function(){
      await textToJson.readChampionId();
      await textToJson.writeChampionId();
    })
  })
})

