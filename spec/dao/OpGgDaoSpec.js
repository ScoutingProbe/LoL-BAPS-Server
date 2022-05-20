describe("OpGgDaoSpec", function(){
  const fs = require('fs')
  const path = require('path')
  const util = require('util')
  const readFile = util.promisify(fs.readFile)
  var OpGgDao = require('../../dao/OpGgDao')
  var opggdao

  beforeEach(function(){
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
    opggdao = new OpGgDao()
  })

  // describe('Should be able to getChampionName', function(){
  //   it('Should have 1 Annie', async function(){
  //     await opggdao.readChampionId();
  //     const championDocument = opggdao.champion_json;
  //     const actual_val = championDocument[1]
  //     expect("Annie").toEqual(actual_val)
  //   })
  // })

  // describe('Should be able to writeChampionName', function(){
  //   it('should be able to write', async function(){
  //     await opggdao.readChampionId();
  //     await opggdao.writeChampionId();
  //   })
  // })

  // describe('Create positions.json for top, middle, jungle, utility, and bottom.', function(){
  //   it('read the console', async function(){
  //     await opggdao.createPositions()
  //   })
  // })

  describe('Write championName-role.json files inside /cache', function(){
    it('', async function(){
      await opggdao.writeCounter('monkeyking', 'top')
      // await opggdao.writeCounter('sona', 'support')
    })
    
    // it('read console', function(){
    //   fs.readFile(path.resolve('cache', 'OpGgPositions.json'), 'utf-8', function(error, OpGgPositions){
    //     if(error) 
    //       console.log(error)
    //     console.log(OpGgPositions)
    //     OpGgPositions = JSON.parse(OpGgPositions)
    //     // console.log(OpGgPositions.top)
    //     // OpGgPositions.top.forEach(async function(c, i, a){
    //     //   console.log(`${c} top`)
    //     // })
    //     let promises = []
    //     for(let role in OpGgPositions){
    //       for (let name of OpGgPositions[role] ){
    //         name = name.toLowerCase()
    //         name = name.includes("'") ? name.replace("'", "") : name
    //         name = name.includes(". ") ? name.replace(". ", "") : name
    //         name = name.includes(" ") ? name.replace(" ", "") : name
    //         name = name == 'nunu& willump' ? 'nunu' : name
    //         name = name == 'renata glasc' ? 'renata' : name
    //         name = name == 'wukong' ? 'monkeyking' : name
    //         // console.log(`${name} ${role}`)
    //         promises.push(opggdao.writeCounter(name, role))
    //       }
    //     }
    //     Promise.all(promises)
    //   })
    // })
  })
})

