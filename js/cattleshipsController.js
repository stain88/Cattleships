angular
  .module('cattleshipsApp')
  .controller('cattleshipsController', cattleshipsController);

function cattleshipsController($firebaseObject) {
  var self = this;
  var cattleRef = new Firebase('https://angular-cattleships.firebaseio.com/');
  var player0 = cattleRef.child('player0');
  var player1 = cattleRef.child('player1');
  var p0Board = player0.child('board');
  var p1Board = player1.child('board');
  self.data = $firebaseObject(cattleRef);
  self.defenseBoard = {};
  self.attackBoard = {};
  self.size;
  self.ships = {ship0: {name:"carrier", length:5, placed:false, initial:"C"},ship1: {name:"battleship", length:4, placed:false, initial:"B"}, ship2:{name:"cruiser", length:3, placed:false, initial:"R"},ship3:{name:"submarine", length:3, placed:false, initial:"S"},ship4:{name:"destroyer", length:2, placed:false, initial:"D"}};
  self.selectedShip = "";
  self.rotation = "horizontal";
  // self.gameSetup();

  self.gameSetup = function(){
    cattleRef.remove();
    var defBoard = self.boardSetup('defense');
    player0.update({board: defBoard});
    var atkBoard = self.boardSetup('attack');
    player1.update({board:atkBoard});
  };

  self.boardSetup = function(grid, size) {
    console.log(grid);
    self.size = size || 10;
    board = {};
    for (var i=0;i<self.size;i++) {
      board["column"+i] = {id: i, "rows":{}};
      for (var j=0;j<self.size;j++) {
        board["column"+i]["rows"]["row"+j]="";
      };
    };
    console.log(board);
    if (grid=="defense") self.defenseBoard = board;
    if (grid=="attack") self.attackBoard = board;
    return board;
  }

  self.can_play = function(row_id, index) {
    console.log("row: "+row_id, "index: "+index);
    console.log(self.selectedShip.name);
  }

  self.can_place = function(row_id, index) {
    if (!self.selectedShip) return;
    if (self.selectedShip.placed) return false;
    if (self.rotation==="vertical") {
      if (row_id+self.selectedShip.length>self.size) return false;
      for (var i=0;i<self.selectedShip.length;i++) {
        if (self.defenseBoard["column"+(row_id+i)].rows["row"+index]!=="") return false;
      }
      return row_id + self.selectedShip.length<=self.size;
    } else if (self.rotation==="horizontal") {
      for (var i=0;i<self.selectedShip.length;i++) {
        if (self.defenseBoard["column"+row_id].rows["row"+(index+i)]!=="") return false;
      }
      return index + self.selectedShip.length<=self.size;
    }
  };

  self.place_ship = function(row_id, index) {
    if (self.can_place(row_id, index)) {
      if (self.rotation==="horizontal") {
        for (var i=0;i<self.selectedShip.length;i++) {
          self.defenseBoard["column"+(row_id)].rows["row"+(index+i)] = self.selectedShip.initial;
        }
      } else {
        for (var i=0;i<self.selectedShip.length;i++) {
          self.defenseBoard["column"+(row_id+i)].rows["row"+index] = self.selectedShip.initial;
        }
      }
      self.selectedShip.placed = true;
      console.log(self.selectedShip);
      
    }
  }

  self.all_ships_placed = function() {
    for (var ship in self.ships) {
      if (!self.ships[ship].placed) return false;
    }
    return true;
  }

  self.player_move = function(row_id, index) {
    console.log("square: ", row_id, index);
    cattleRef.push({
      move: [row_id, index]
    })
  }

  self.makeMove =function(){
    
  }

  cattleRef.on('child_added', function(snapshot){
    var p = snapshot.val().move;
    console.log(p)
  })

}