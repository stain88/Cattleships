angular
    .module('cattleshipsApp', ['firebase', 'ui.router'])
    .config(MainRouter);

function MainRouter($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
       url: "/home",
       templateUrl: "home.html"
  })
    .state('archive', {
      url: "/archive",
      templateUrl: "archive.html"
  })
    .state('landing', {
      url: "/",
      templateUrl: "landing.html"
  })
    .state('instructions', {
      url: "/instructions",
      templateUrl: "instructions.html"
  });

  $urlRouterProvider.otherwise("/");
       

}