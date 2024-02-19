## Introduction
When I play LoL I ponder, of the 150+ champions, which one should I play?  Like rock-paper-scissors, Pokémon, Super Smash Brothers, and Defense of the Ancients, League of Legends challenges summoners to consider enemy counter matchups and ally synergy pairings during the initial ban and pick phase of the game.  LoL-BAPS aggregates matchup data from different webpages on httsp://op.gg into a dashboard that informs users of the favorable counter matchups to predict a winning outcome.  LoL, like the technology world, is constantly evolving and I continue development on the project as a creative codebase to hone my skills.  I have deprioritized video games after interacting with many gamers in real life and observing the undesirable effects.  It is a time leech when there are more important things required to succeed in life.  
## Description
The following is a screenshot of BAPS in use during the pick and ban stage of the game.  The blue champion links on the left are hyperlinks to https://op.gg the Puppeteer data source.  The bans column is a list of champions that should be banned to counter the enemy picks; the picks column is a list of champions that should be picked to synergize with allies and deny enemy picks.  The positions buttons on the right displays the roles that the champion can fill, according to OP.GG.  Clicking the button sends another HTTPS request to update the bans and picks column.
![image](https://github.com/ScoutingProbe/LoL-BAPS-Server/assets/6277124/4c678b68-6e97-40df-9509-b1b4160cb523)

## Features to build in the future:
1. After a game completes, update reference-league.json and reference-opgg.json with the match outcome.  Winning team, losing team, lane (top, mid, bot) first tower, lane first blood, and need to be saved. Then store the mapped json data into SQL and get a prediction model server stood up.
    a. op.gg data can be scraped with december 2023 implementation.
    b. riot games match api matchId and league of legends logs gameId do not match.  this would be preferable but riot games is probably refactoring their api.  need to check again next time i have some free time.
2. Riot Games API Champion Mastery endpoint works now and Data Dragon summoner ID lookup works for myself only (I know my inGameName and tagline).  It's possible to implement champion mastery for myself only.  I'd also like to implement champion mastery for my team as well but that's technically not possible due to Riot Games API status.  
3. Flex picks by the opposing team is a difficult problem and there's a math problem buried in there somewhere.  Need to create some scenarios, define the logic, and design a user interface to solve that problem.

## Pending requirements
1. Sort and annotate bans and picks champion list with OP.GG tiers.  Tiers are updated depending on the metagame and Riot Games patches.
2. Filter picks champion list by Team Fight Tactics classes: knights, guardians, brawlers, challengers, rangers, assassins, mages, sorcerers, and mystics.  Middle-Jungle, Middle-Top, Jungle-Top, and Support-Bottom synergies contribute to two-versus-two skirmish outcomes.
3. Create a test harness so the end-to-end application can be tested without queueing up for a real game.  
4. Create a CICD pipeline to deploy to a private AWS S3 bucket to emulate a production deployment process.  There is zero intention to distribute this software publicly and is developed purely as an academic exercise.  After personal user acceptance testing, I consider this to be an unethical hack on a beloved game company offering a negligible improvement in win rate.

## How to run
1.  You can't run the full application.  The client side has been intentionally left private because this is not for use by the public but you are welcome to take a look at the code.
2.  Clone the repository then reference the npm run scripts for unit tests on the data access objects and services.  
