angular
  .module('cattleshipsApp')
  .controller('cattleshipsController', cattleshipsController);

function cattleshipsController($firebaseObject, $firebaseArray) {
  var self = this;
  self.PlayingState = {watching: 0, joining:1, playing:2}
  var cattleRef = new Firebase('https://angular-cattleships.firebaseio.com/');
  var player0 = cattleRef.child('player0');
  var player1 = cattleRef.child('player1');
  var p0Board = player0.child('board');
  var p1Board = player1.child('board');
  var count   = cattleRef.child('count');
  self.data = $firebaseObject(cattleRef);
  self.defenseBoard = {};
  self.attackBoard = {};
  self.size;
  var catsAndCows = [
    {ships: {
    ship0: {name:"hipster cat", length:5, placed:false, initial:"FC"},
    ship1: {name:"grumpty cat", length:4, placed:false, initial:"FB"}, 
    ship2:{name:"angry cat", length:3, placed:false, initial:"FR"},
    ship3:{name:"possessed cat", length:3, placed:false, initial:"FS"},
    ship4:{name:"hissler cat", length:2, placed:false, initial:"FD"}
  }},
  {ships: {
    ship0: {name:"nosey cow", length:5, placed:false, initial:"BC"},
    ship1: {name:"psycho cow", length:4, placed:false, initial:"BB"}, 
    ship2:{name:"curious cow", length:3, placed:false, initial:"BR"},
    ship3:{name:"tame cow", length:3, placed:false, initial:"BS"},
    ship4:{name:"mad cow", length:2, placed:false, initial:"BD"}
  }}
  ]
  self.ships = {};
  self.selectedShip = "";
  self.rotation = "horizontal";

  self.gameSetup = function(){
    var defBoard = self.boardSetup('defense');
    player0.update({board: defBoard});
    var atkBoard = self.boardSetup('attack');
    player1.update({board:atkBoard});
    count.transaction(function(current_value) {
      return (current_value || 0 ) + 1
    });
    self.playingState = self.PlayingState.watching;
    self.waitToJoin();
  };

  self.waitToJoin = function() {
    var selfie = this;
    cattleRef.child('player0/online').on('value', function(onlineSnap){
      if (onlineSnap.val() === null && selfie.playingState === self.PlayingState.watching) {
        self.tryToJoin(0);
      }
    })
    cattleRef.child('player1/online').on('value', function(onlineSnap){
      if (onlineSnap.val() === null && selfie.playingState === self.PlayingState.watching) {
        self.tryToJoin(1);
      }
    })
  }

  self.tryToJoin = function(playerNum) {
    self.playingState = self.PlayingState.joining;
    var selfie = this;
    cattleRef.child('player' + playerNum + '/online').transaction(function(onlineVal) {
      if (onlineVal===null) {
        return true
      } else {
        return
      }
    }, function(error, committed) {
      if (committed) {
        selfie.playingState = self.PlayingState.playing;
        self.startPlaying(playerNum);
      } else {
        selfie.playingState = self.PlayingState.watching;
      }
    })
  }

  self.startPlaying = function (playerNum) {
    self.myPlayerRef = cattleRef.child('player' + playerNum);
    self.opponentPlayerRef = cattleRef.child('player' + (1-playerNum));
    self.ships = catsAndCows[playerNum].ships;
    self.myPlayerRef.child('online').onDisconnect().remove();
  }

  self.boardSetup = function(grid, size) {
    self.size = size || 10;
    board = {};
    for (var i = 0; i < self.size; i++) {
      board["column" + i] = {id: i, "rows": {}};
      for (var j = 0; j < self.size; j++) {
        board["column" + i]["rows"]["row" + j]="";
      };
    };
    if (grid === "defense") self.defenseBoard = board;
    if (grid === "attack") self.attackBoard = board;
    return board;
  }

  self.can_place = function(row_id, index) {
    if (!self.selectedShip) return;
    if (self.selectedShip.placed) return false;
    if (self.rotation === "vertical") {
      if (row_id + self.selectedShip.length > self.size) return false;
      for (var i = 0; i < self.selectedShip.length; i++) {
        if (self.defenseBoard["column" + (row_id + i)].rows["row" + index] !== "") return false;
      }
      return row_id + self.selectedShip.length <= self.size;
    } else if (self.rotation === "horizontal") {
      for (var i = 0; i < self.selectedShip.length; i++) {
        if (self.defenseBoard["column" + row_id].rows["row" + (index + i)] !== "") return false;
      }
      return index + self.selectedShip.length<=self.size;
    }
  };

  self.place_ship = function(row_id, index) {
    if (self.can_place(row_id, index)) {
      if (self.rotation === "horizontal") {
        for (var i = 0; i < self.selectedShip.length; i++) {
          self.defenseBoard["column" + (row_id)].rows["row" + (index + i)] = self.selectedShip.initial;
        }
      } else {
        for (var i = 0; i < self.selectedShip.length; i++) {
          self.defenseBoard["column" + (row_id + i)].rows["row" + index] = self.selectedShip.initial;
        }
      }
      self.selectedShip.placed = true;
      self.myPlayerRef.update({board:self.defenseBoard});
    }
  }

  self.all_ships_placed = function() {
    for (var ship in self.ships) {
      if (!self.ships[ship].placed) return false;
    }
    return true;
  }

  self.player_move = function(row_id, index) {
    var playerTurn;
    count.transaction(function(current_value) {
      playerTurn = current_value;
    });
    playerTurn = (playerTurn % 2 === 0)? 'player0':'player1';
    if (self.myPlayerRef.toString().substr(-7) !== playerTurn) {
      self.message = "It is your opponent's turn";
      return;
    }
    else self.message = "It is your turn";
    var board = $firebaseObject(self.opponentPlayerRef.child('board'));

    board.$loaded(function() {
      self.attackBoard["column" + row_id].rows["row" + index] = board["column" + row_id].rows['row' + index] || 'M';
      count.transaction(function(current_value) {
        return current_value + 1;
        console.log(count)
      })
    });
  }

  self.clearGame = function() {
    cattleRef.remove();
    count.transaction(function(current_value) {
      return (current_value = 0)
    });
  }

  self.checkForWin = function(){

  }
}