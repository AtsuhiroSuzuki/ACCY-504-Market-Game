# ACCY-504-Market-Game
This is the web app adapation of a market simulation game for a graduate accounting class taught by Mark Peecher, with the live version designed by University of Illinois professors and Deloitte, and porting done by Atsuhiro Suzuki. The purpose is to provide an interactive experience that teaches market principles and the value of auditing.

## Overview
The game is split into 3 distinct phases and any number of periods. It consists of 7 teams: 4 buyers and 3 sellers. Each period the sellers choose which product quality to sell (low, medium, and high) and what price to sell at. There is a production cost for each quality, which is unknown to the buyers. Then, the buyers go in a random order and select which seller to buy from. The buyers have a resale price, which is unknown to sellers. Profit is then calculated at the end of the period for sellers by _(Units Sold)\*((Sale Price) - (Production Cost))_. Profit is calculated for buyers by _(Resale Price for Bought Quality) - (Buy Price)_. The gameplay changes based on the phase the game is in. In the first phase, all buyers can see what qualities the sellers are selling. In the second phase, the qualities are hidden. In the last phase, an auditor is introduced that every player can bid on. If a seller wins the bid, their products will be verified and have the quality shown to the buyers. If a buyer wins, they will be able to see the qualities of all the sellers. The goal of the game is to make the most profit.

## Implementation Notes


## Tech Stack
### Front-End
HTML and CSS with Bootstrap<br>
Plain Javascript

### Back-End
NodeJS<br>
SocketIO

### Database
MySQL
