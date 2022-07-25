eva.controller("ControlEvaController", function ($scope, $http) {

    $scope.status = function () {
        $http.get(`${URL}/status`).then(function successCallback(response) {
        }, function errorCallback(response) {
        });
    }
    $scope.status();
});
