//============================================
//Backend functionality for the admin control.
//============================================

//Import express app and mysql connection
var serverfile = require('./server.js');

var admin_control = function(){

	//The 'Stats' loaded include the current phase, period, and stage
	serverfile.app.io.route('statLoad', function(req) {
		serverfile.connection.query('SELECT cur_period FROM history ORDER BY history_id DESC LIMIT 1;', function(err, result){
			if (err) {
				console.error(err);
				return;
			}
			var period = result[0]["cur_period"];
			serverfile.connection.query('SELECT cur_phase FROM history ORDER BY history_id DESC LIMIT 1;', function(err, result){
				if (err) {
					console.error(err);
					return;
				}
				var phase = result[0]["cur_phase"];
				var stats = {
					period : period,
					phase : phase,
					stage : null
				};
				serverfile.connection.query('SELECT stage_id FROM game WHERE game_id = 1', function(err, result){
					if (err) {
						console.error(err);
						return;
					}
					stats.stage = result[0]["stage_id"];
					req.io.emit("stats", stats);
				});
			});
		});
	});

	//Uses count of sellers in offers to query # of offers submitted
	//TODO: Use table joins to check game id as well
	serverfile.app.io.route('sellerUpdate', function(req) {
		serverfile.connection.query('SELECT COUNT(*) FROM offers', function(err, result){
			if (err) {
				console.error(err);
				return;
			}
			var num_of_offers = result[0]["COUNT(*)"];
			req.io.emit("sellerUpdated", num_of_offers);
		});
	});

	
	//Uses count of buyers in bid to query # of bids submitted
	//TODO: Use table joins to check game id as well
	serverfile.app.io.route('buyerUpdate', function(req) {
		serverfile.connection.query('SELECT COUNT(*) FROM bid', function(err, result){
			if (err) {
				console.error(err);
				return;
			}
			var num_of_bids = result[0]["COUNT(*)"];
			req.io.emit("buyerUpdated", num_of_bids);
		});
	});


	//On period update, a new history row is created, the buy order is randomized, and the offers/bid tables are cleared
    serverfile.app.io.route('updatePeriod', function(req) {
		var curPeriod = serverfile.connection.query('SELECT cur_phase, cur_period FROM history ORDER BY history_id DESC LIMIT 1;', function(err, result){
    		if (err) {
				console.error(err);
				return;
			}
			var newPeriod = ++result[0]["cur_period"];
			var phase = result[0]["cur_phase"];
			var newHistory = {
				cur_phase : phase,
				cur_period : newPeriod,
				game_id : 1
			};

			var newQuery = serverfile.connection.query('INSERT INTO history SET ?', newHistory, function(err, result){
				if (err) {
					console.error(err);
					return;
				}
			});

			randomizeBuyOrder();

			var newStage;
			if(phase == 3)
				newStage = 5;
			else
				newStage = 0;

			serverfile.connection.query('UPDATE game SET stage_id = ? WHERE game_id = 1', newStage, function(err, result){
				if (err) {
					console.error(err);
					return;
				}
				serverfile.app.io.broadcast("stageUpdated", newStage);
			});

			clearPeriodData();
    		req.io.emit("periodUpdate", newPeriod);
    	});
	});

	//On phase update, a new history row is created, the buy order is randomized, and the offers/bid tables are cleared
	//Stage is updated based on whether or not it is phase 3 (if phase == 3, auditor bid stage is set)
	serverfile.app.io.route('updatePhase', function(req) {
		serverfile.connection.query('SELECT cur_phase, cur_period FROM history ORDER BY history_id DESC LIMIT 1;', function(err, result){
    		if (err) {
				console.error(err);
				return;
			}
			var newPhase = ++result[0]["cur_phase"];
			var newPeriod = ++result[0]["cur_period"];
			var newHistory = {
				cur_phase : newPhase,
				cur_period : newPeriod,
				game_id : 1
			};

			var newQuery = serverfile.connection.query('INSERT INTO history SET ?', newHistory, function(err, result){
				if (err) {
					console.error(err);
					return;
				}
			});

			randomizeBuyOrder();

			var newStage;
			if(newPhase == 3)
				newStage = 5;
			else
				newStage = 0;

			serverfile.connection.query('UPDATE game SET stage_id = ? WHERE game_id = 1', newStage, function(err, result){
				if (err) {
					console.error(err);
					return;
				}
				serverfile.app.io.broadcast("stageUpdated", newStage);
			});

			clearPeriodData();
    		req.io.emit("periodUpdate", newPeriod);
    		req.io.emit("phaseUpdate", newPhase);
    	});
	});

	//Doesn't change stage number, simply loads it
	serverfile.app.io.route('stageUpdate', function(req) {
		serverfile.connection.query('SELECT stage_id FROM game WHERE game_id = 1', function(err, result){
			var cur_stage = result[0]["stage_id"];
			req.io.emit("stageUpdated", cur_stage);
		});
	});
};


//Buy order must be randomized at the start of every period/phase
//This function uses a shuffle helper function to insert a randomized
//buy order
function randomizeBuyOrder() {
	var order = shuffle([1, 2, 3, 4]);
	var list = [0, 1, 2 , 3];
	list.forEach(function(element){
		serverfile.connection.query('SELECT user_id FROM `buyer list`', function(err, result){
			if (err) {
				console.error(err);
				return;
			}
			user = result[element]["user_id"];
			buyPosition = order[element];
			serverfile.connection.query('UPDATE user SET buy_pos = ? WHERE user_id = ?', [buyPosition, user], function(err, result) {
				if (err) {
					console.error(err);
					return;
				}
			});
		});
	});
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function clearPeriodData(){
	serverfile.connection.query('DELETE FROM bid;', function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
	});
	serverfile.connection.query('ALTER TABLE bid AUTO_INCREMENT 1;', function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
	});
	serverfile.connection.query('DELETE FROM offers;', function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
	});
	serverfile.connection.query('ALTER TABLE offers AUTO_INCREMENT 1;', function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
	});
}

module.exports.admin_control = admin_control;