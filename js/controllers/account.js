eva.controller('account', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    
    $scope.init = function () {
        let user = JSON.parse(sessionStorage.getItem('currentUser'));
        $scope.givenName = user.givenName;
        $scope.familyName = user.familyName;
        $scope.email = user.username;
    }

    $scope.update = function () {
        if (!!$scope.email && $scope.email !== '') {
            var json = { email: $scope.email, givenName: $scope.givenName, familyName: $scope.familyName, picture: '' };
            $http.put(`${URL}/api/user/`, json).then(function successCallback(response) {
                $rootScope.user = (!!$scope.givenName && !!$scope.familyName && $scope.givenName !== '' && $scope.familyName !== '') 
                ? `${$scope.givenName} ${$scope.familyName}` 
                : $scope.familyName;$scope.email;
                notify(locale().ROBOT.NOTIFY.UPDATE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().ROBOT.NOTIFY.ERROR, 'danger');
            });
        } else {
            notify(locale().ACCOUNT.EMAILERROR, 'warning');
        }
    }

    $scope.init();

}]);