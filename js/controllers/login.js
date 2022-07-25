eva.controller("login", ['$scope', '$http', function ($scope, $http) {

    $scope.authenticate = function(provider) {
        if (provider === 'google') {
          google.accounts.id.initialize({
            client_id: '285606346890-n4n0u10t970qi4gjaegqepfjl444ei96.apps.googleusercontent.com',
            callback: function (params) {
              $http.post(`${URL}/oauth/google`, { value: params }).then(function successCallback(response) {
                console.log(response)
                sessionStorage.setItem('oauth_token', response);
              }, function errorCallback(response) {
              }
              );
              console.log(params);
            }
          });
          google.accounts.id.prompt();
        }
    };
}]);