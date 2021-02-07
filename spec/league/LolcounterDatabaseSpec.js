describe("LolcounterDatabaseSpec", function(){
    var LolcounterDatabase = require('../../league/LolcounterDatabase')
    var lolcounter_database;

    beforeEach(async function(){
        lolcounter_database = new LolcounterDatabase();
    })

    describe("connect", function(){
        beforeEach(function(){
            lolcounter_database.connect();
        })

        it("should return non null", function(){
            const actual = lolcounter_database.connect;
            expect(actual).not.toBeNull();
        })
    })

    describe("queryChampion", function(){
        beforeEach(function(){
            lolcounter_database.connect();
            lolcounter_database.queryChampion();
        })

        it("should have 1: Annie", function(){
            const actual = lolcounter_database.champion['1'];
            expected(actual).toEqual("Annie");
        })

    })
})