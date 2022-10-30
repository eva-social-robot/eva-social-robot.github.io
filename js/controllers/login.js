eva.controller("login", ['$scope', '$http', function ($scope, $http) {

    $scope.authenticate = function() {
      if (!sessionStorage.getItem('oauth_token')) {
        if (!$scope.username || !$scope.password) {
          alert("Please enter your email address or password");
        } else {
          $http.post(`${URL}/login`, { username: $scope.username, password: $scope.password }).then(function successCallback(response) {
                sessionStorage.setItem('oauth_token', `Bearer ${response.data.value}`);
                $http.defaults.headers.common['Authorization'] = sessionStorage.getItem('oauth_token')
              }, function errorCallback(response) {
            }
          );
        }
      }
    };
}]);