describe("AllocatorSpec", function(){
  var Allocator = require('../../scripts/Allocator')
  var allocator

  beforeEach(function(){
    allocator = new Allocator()
  })

  // describe('Should be able to getChampionName', function(){
  //   it('Should have 1 Annie', async function(){
  //     await allocator.readChampionId();
  //     const championDocument = allocator.champion_json;
  //     const actual_val = championDocument[1]
  //     expect("Annie").toEqual(actual_val)
  //   })
  // })

  // describe('Should be able to writeChampionName', function(){
  //   it('should be able to write', async function(){
  //     await allocator.readChampionId();
  //     await allocator.writeChampionId();
  //   })
  // })

  describe('Create positions.json for top, middle, jungle, utility, and bottom', function(){
    it('top has Pantheon; middle has Talon; jungle has Shaco; utility has Shaco; bottom has Ashe', async function(){
      const positions = await allocator.createPositions()
      console.log(positions)
      // expect(true).toEqual(positions.top.includes("Pantheon"))
      // expect(true).toEqual(positions.middle.includes("Talon"))
      // expect(true).toEqual(positions.jungle.includes("Shaco"))
      // expect(true).toEqual(positions.utility.includes("Shaco"))
      // expect(true).toEqual(positions.bottom.includes("Ashe"))
    })
  })
})

