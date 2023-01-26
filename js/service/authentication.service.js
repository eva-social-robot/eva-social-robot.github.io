eva.factory('AuthenticationService', ['$http', function ($http) {
    var service = {};

    service.Login = Login;
    service.Logout = Logout;

    return service;
    
    function Login(username, password, callback) {
        sessionStorage.removeItem("currentUser");
        $http.post(`${URL}/login`, { username: username, password: password })
        .then(function successCallback(response) {
            if (response.data.value) {
                sessionStorage.setItem("currentUser", JSON.stringify({ ...response.data, username: username }));
                $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.value;
                callback(true);
            } else {
                callback(false);
            }
        }, function errorCallback(response) {
            callback(false);
        });
    }

    function Logout() {
        sessionStorage.removeItem("currentUser")
        $http.defaults.headers.common.Authorization = '';
    }
}]);