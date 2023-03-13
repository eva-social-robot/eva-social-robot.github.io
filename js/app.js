var eva = angular.module("evaApp", [
  "ngRoute",
  "dndLists",
  "pascalprecht.translate",
  "ngSanitize"
]);

var lang = { es: es, en: en, pt: pt };
function locale() {
  return lang[localStorage.getItem("lang") || "es"];
}

eva.config(function ($translateProvider) {
  let array = Object.keys(lang);
  for (let i = 0; i < array.length; i++) {
    $translateProvider.translations(array[i], lang[array[i]]);
  }
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.preferredLanguage(localStorage.getItem("lang") || "es");
});

eva.controller("menu", function ($scope, $rootScope, $translate, $http, $location) {

  $rootScope.loggedIn = false;

  $scope.changeLanguage = function (key) {
    localStorage.setItem("lang", key);
    $translate.use(key);
  };

  $scope.login = function () {
      sessionStorage.removeItem("currentUser");
      $rootScope.loggedIn = false;
      $location.path('/login');
  }

  $scope.init = function () {
    if (!!sessionStorage.getItem("currentUser")) {
      let token = JSON.parse(sessionStorage.getItem("currentUser")).token;
      //$http.defaults.headers.common.Authorization = 'Bearer ' + token;
      $rootScope.loggedIn = true;
      $rootScope.user = JSON.parse(atob(token.split('.')[1])).name || JSON.parse(atob(token.split('.')[1])).sub;
    } else {
      $location.path('/login');
    }
  }
  $scope.init();
});

eva
  .config([
    "$locationProvider",
    "$routeProvider",
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("!");
      $routeProvider
        .when("/controlAngular", {
          templateUrl: "/plantillas/controlAngular.html",
          activetab: "controlAngular"
        })
        .when("/login", {
          templateUrl: "/plantillas/login.html",
          activetab: "login"
        })
        .when("/interaccion", {
          templateUrl: "/plantillas/interaccion.html",
          activetab: "interaccion"
        })
        .when("/ledsanim", {
          templateUrl: "/plantillas/ledsanim.html",
          activetab: "led"
        })
        .when("/audio", {
          templateUrl: "/plantillas/audio.html",
          activetab: "audio"
        })
        .when("/script", {
          templateUrl: "/plantillas/script.html",
          activetab: "script"
        })
        .when("/scriptdata", {
          templateUrl: "/plantillas/scriptdata.html",
          activetab: "script"
        })
        .when("/scriptdata/:id", {
          templateUrl: "/plantillas/scriptdata.html",
          activetab: "script"
        })
        .when("/voice", {
          templateUrl: "/plantillas/voice.html",
          activetab: "lang"
        })
        .when("/listen", {
          templateUrl: "/plantillas/listen.html",
          activetab: "lang"
        })
        .when("/led", {
          templateUrl: "/plantillas/led.html",
          activetab: "led"
        })
        .when("/lededitor", {
          templateUrl: "/plantillas/lededitor.html",
          activetab: "lededitor"
        })
        .when("/lededitor/{id}", {
          templateUrl: "/plantillas/lededitor.html",
          activetab: "lededitor"
        })
        .when("/mov", {
          templateUrl: "/plantillas/mov.html",
          activetab: "mov"
        })
        .when("/images", {
          templateUrl: "/plantillas/images.html",
          activetab: "images"
        })
        .when("/account", {
          templateUrl: "/plantillas/account.html",
          activetab: ""
        })
        .when("/robot", {
          templateUrl: "/plantillas/robot.html",
          activetab: ""
        })
        .when("/woo", {
          templateUrl: "/plantillas/woo.html",
          activetab: "woo"
        })
        .otherwise("/controlAngular");
    },
  ])
  .run(function ($rootScope, $route, $http, $location) {
  });
