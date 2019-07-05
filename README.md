# ACCY-504-Market-Game
This is the web app adapation of a market simulation game for a graduate accounting class taught by University of Illinois professor Mark Peecher, with the live version designed by University of Illinois professors and Deloitte, and porting done by Atsuhiro Suzuki. The purpose is to provide an interactive experience that teaches market principles and the value of auditing.

## Overview
The game is split into 3 distinct phases and any number of periods. It consists of 7 teams: 4 buyers and 3 sellers. Each period the sellers choose which product quality to sell (low, medium, and high) and what price to sell at. There is a production cost for each quality, which is unknown to the buyers. Then, the buyers go in a random order and select which seller to buy from. The buyers have a resale price, which is unknown to sellers. Profit is then calculated at the end of the period for sellers by _(Units Sold)\*((Sale Price) - (Production Cost))_. Profit is calculated for buyers by _(Resale Price for Bought Quality) - (Buy Price)_. The gameplay changes based on the phase the game is in. In the first phase, all buyers can see what qualities the sellers are selling. In the second phase, the qualities are hidden. In the last phase, an auditor is introduced that every player can bid on. If a seller wins the bid, their products will be verified and have the quality shown to the buyers. If a buyer wins, they will be able to see the qualities of all the sellers. The goal of the game is to make the most profit.

## Implementation Notes
The game persists through multiple web pages so the application must be able to keep track of user sessions. For this I decided to implement user account sign-up and sign-in (done using passport.js). This information, along with game state (e.g. phase, period, profits, roles), needs to be stored, which is done in a MySQL DB. Game information like a leaderboard showing player profits and transaction history is calculated and shown to players at the end of every period. Professor specific controls are abstracted to a professor type user in the form of a dashboard. The dashboard has game related information like players and their roles, the leaderboard, transaction histories, etc. It also has controls that allow the professor to move onto the next period or phase. Furthermore, when a game is created by a professor, they have the ability to choose what the production costs and resale prices of each quality are, which are then stored to be used in the game.

At the beggining of each period, sellers are directed to a page that allows them to select a quality to sell and a price to sell at, while buyers are held in a wait screen. Upon all sellers submission, the sellers are then themselves routed to a wait screen and the buyers are (in a randomized order) one by one redirected to a selection screen where they are presented with the options submitted by the sellers and can choose what to buy, or a no buy option.

In the live game, the auditor role is played by students. However, since the auditor role can easily be automated by checking which user submitted the highest bid, that has been done in this implementation. Also, depending on the phase and bid state, corresponding quality information will be calculated and displayed to each buyer.

## Tech Stack
### Front-End
HTML and CSS with Bootstrap<br>
Plain Javascript
### Back-End
NodeJS<br>
SocketIO
### Database
MySQL
