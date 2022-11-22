eva.controller("login", ['$scope', '$rootScope', 'AuthenticationService', '$location', function ($scope, $rootScope, AuthenticationService, $location) {

    $scope.initController = function() {
      $rootScope.loggedIn = false;
      AuthenticationService.Logout();
    };
    
    $scope.authenticate = function() {
      AuthenticationService.Login($scope.username, $scope.password, function (result) {
        if (result === true) {
            $location.path('/controlAngular');
            $rootScope.loggedIn = true;
            $rootScope.user = JSON.parse(atob(JSON.parse(sessionStorage.getItem('currentUser')).token.split('.')[1])).name || $scope.username;
        } else {
            // vm.error = 'Username or password is incorrect';
            $rootScope.loggedIn = false;
        }
    });
  }

  $scope.initController();

}]);