eva.controller("login", ['$scope', '$http', function ($scope, $http) {

    $scope.authenticate = function() {
        if (!sessionStorage.getItem('oauth_token')) {
          windows.google.accounts.id.initialize({
            client_id: '285606346890-n4n0u10t970qi4gjaegqepfjl444ei96.apps.googleusercontent.com',
            callback: function (params) {
              console.log(params);
              $http.post(`${URL}/oauth/google`, { value: params.credential }).then(function successCallback(response) {
                sessionStorage.setItem('oauth_token', `Bearer ${response.data.value}`);
                $http.defaults.headers.common['Authorization'] = sessionStorage.getItem('oauth_token')
              }, function errorCallback(response) {
              }
              );
            }
          });
          google.accounts.id.prompt();
        }
    };
}]);