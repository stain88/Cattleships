angular
  .module('cattleshipsApp')
  .controller('cattleshipsController', cattleshipsController);

function cattleshipsController() {
  var self = this;
  self.board = {};

  self.boardSetup = function(size) {
    size = size || 10;
    board = {};
    for (var i=0;i<size;i++) {
      board["row"+i] = {"columns":{}};
      for (var j=0;j<size;j++) {
        board["row"+i]["columns"]["column"+j]="";
      };
    };
    console.log(board);
    self.board = board;
  }
}