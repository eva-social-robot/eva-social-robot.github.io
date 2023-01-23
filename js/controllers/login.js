eva.controller("login", ['$scope', '$rootScope', 'AuthenticationService', '$location', function ($scope, $rootScope, AuthenticationService, $location) {

    $scope.initController = function() {
      $rootScope.loggedIn = false;
      AuthenticationService.Logout();
    };
    
    $scope.authenticate = function() {
      AuthenticationService.Login($scope.username, $scope.password, function (result) {
        if (result === true) {
          if (window.location.href.includes('?')) {
            localStorage.setItem('currentUser', sessionStorage.getItem('currentUser'));
            let values = window.location.href
            .split('?')[1]
            .split('&')
            .map(i => { 
              let temp = i.split('=');
              return { key: temp[0], value: decodeURIComponent(temp[1]) } });
              window.location.replace(values[0].value);
          } else {
            $location.path('/controlAngular');
            $rootScope.loggedIn = true;
            $rootScope.user = JSON.parse(atob(JSON.parse(sessionStorage.getItem('currentUser')).token.split('.')[1])).name || $scope.username;
          }
        } else {
            // vm.error = 'Username or password is incorrect';
            $rootScope.loggedIn = false;
        }
    });
  }

  $scope.initController();

}]);