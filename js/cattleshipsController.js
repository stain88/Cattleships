angular
  .module('cattleshipsApp')
  .controller('cattleshipsController', cattleshipsController);

function cattleshipsController() {
  var self = this;
  self.board = {};
  self.size;
  self.ships = {ship0: {name:"carrier", length:5, placed:false, initial:"C"},ship1: {name:"battleship", length:4, placed:false, initial:"B"}, ship2:{name:"cruiser", length:3, placed:false, initial:"R"},ship3:{name:"submarine", length:3, placed:false, initial:"S"},ship4:{name:"destroyer", length:2, placed:false, initial:"D"}};
  self.selectedShip = "";
  self.rotation = "horizontal";

  self.boardSetup = function(size) {
    self.size = size || 10;
    board = {};
    for (var i=0;i<self.size;i++) {
      board["column"+i] = {id: i, "rows":{}};
      for (var j=0;j<self.size;j++) {
        board["column"+i]["rows"]["row"+j]="";
      };
    };
    console.log(board);
    self.board = board;
  }

  self.can_play = function(row_id, index) {
    console.log("row: "+row_id, "index: "+index);
    console.log(self.selectedShip.name);
  }

  self.can_place = function(row_id, index) {
    if (!self.selectedShip) return;
    if (self.rotation==="vertical") {
      return row_id + self.selectedShip.length<=self.size;
    } else if (self.rotation==="horizontal") {
      return index + self.selectedShip.length<=self.size;
    }
  };

  self.place_ship = function(row_id, index) {
    if (self.can_place(row_id, index)) {
      if (self.rotation==="horizontal") {
        for (var i=0;i<self.selectedShip.length;i++) {
          self.board["column"+(row_id)].rows["row"+(index+i)] = self.selectedShip.initial;
        }
      } else {
        for (var i=0;i<self.selectedShip.length;i++) {
          self.board["column"+(row_id+i)].rows["row"+index] = self.selectedShip.initial;
        }
      }
      self.selectedShip.placed = true;
      console.log(self.selectedShip);
    }
  }
}