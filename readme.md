Features to build in the future:
1. After a game completes, update reference-league.json and reference-opgg.json with the match outcome.  Winning team, losing team, lane (top, mid, bot) first tower, lane first blood, and need to be saved. Then store the data into MongoDB and get a prediction model server stood up.
    a. op.gg data can be scraped with december 2023 implementation.
    b. riot games match api matchId and league of legends logs gameId do not match.  this would be preferable but riot games is probably refactoring their api.  need to check again next time i have some free time.
2. Riot Games API Champion Mastery endpoint works now and Data Dragon summoner ID lookup works for myself only (I know my inGameName and tagline).  It's possible to implement champion mastery for myself only.  I'd also like to implement champion mastery for my team as well but that's technically not possible due to Riot Games API status.  
