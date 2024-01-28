describe("OpGgDaoSpec", function(){
  const fs = require('fs')
  const path = require('path')
  const util = require('util')
  const readFile = util.promisify(fs.readFile)
  var OpGgDao = require('../../dao/OpGgDao')
  var opggdao

  beforeEach(function(){
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000
    opggdao = new OpGgDao()
  })

    describe('requestMatchHistory', function(){
      it('should be able to request match history', async function(){
        await opggdao.requestMatchHistory('na', 'Abomination', 'flame', 'Veigar', "Nocturne", 'Senna', "Kai'sa", 'Gwen')
      })
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

  // describe('returns [[championName, tier]...]', function(){
  //   it('champion tiers from /champions?region=!&tier=?&position=#', async function(){
  //     console.log(await opggdao.requestTiers('na', 'master_plus', 'top'))
  //     console.log(await opggdao.requestTiers('na', 'challenger', 'jungle'))
  //     console.log(await opggdao.requestTiers('na', 'platinum_plus', 'mid'))
  //     console.log(await opggdao.requestTiers('na', 'platinum_plus', 'adc'))
      
  //     const jungle = await opggdao.requestTiers('na', 'platinum_plus', 'jungle')

  //     expect("Graves").toEqual(jungle[0][0])
  //     expect("1").toEqual(jungle[0][1])
  
  //     expect("Nocturne").toEqual(jungle[1][0])
  //     expect("1").toEqual(jungle[1][1])
  
  //     expect("Shaco").toEqual(jungle[5][0])
  //     expect("2").toEqual(jungle[5][1])
  
  //     expect("Vi").toEqual(jungle[19][0])
  //     expect("3").toEqual(jungle[19][1])

  //     expect("Jarvan IV").toEqual(jungle[28][0])
  //     expect("4").toEqual(jungle[28][1])
  
  //     expect("Jax").toEqual(jungle[36][0])
  //     expect("5").toEqual(jungle[36][1])
  //   })

  //   it('single test', async function(){
  //     console.log(await opggdao.requestCounters('monkeyking', 'top'))
  //     console.log(await opggdao.requestCounters('monkeyking', 'jungle'))
  //     console.log(await opggdao.requestCounters('sona', 'support'))
  //     console.log(await opggdao.requestCounters('zac', 'jungle'))
  //     console.log(await opggdao.requestCounters('zac', 'support'))
  //     console.log(await opggdao.requestCounters('zac', 'top'))
  //   })
    
    // it('loop test for cheerio', function(){
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

    // it('loop test for puppeteer; nodejs memory leaks 😫', async function(){
    //   fs.readFile(path.resolve('cache', 'OpGgPositions.json'), 'utf-8', async function(error, OpGgPositions){
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
    //     console.log(promises)
    //     while(promises.length){
    //       await Promise.all( promises.splice(0, 1).map(p => p.then(()=>console.log('yay'), () => console.log('boo') )))
    //     }
    //   })
    // })
})

