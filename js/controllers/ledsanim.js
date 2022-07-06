eva.controller('ledsanim', ['$scope', '$http', function ($scope, $http) {
    $scope.listado = [];
    $scope.icon = true;
    $scope.updateid;
    Object.assign($scope, dataTableValues());

    $scope.list = function () {
        $http.get(`${URL}/api/ledsanimations`).then(function successCallback(response) {
            $scope.listado = response.data;
            $scope.dataTable();
        }, function errorCallback(response) {
        });
    }

    $scope.details = function (id) {
        $http.get(`${URL}/api/ledsanimations/${id}`).then(function successCallback(response) {
            const downloadLink = document.createElement("a");
            downloadLink.href = `data:application/javascript;base64,${response.data.data}`;
            downloadLink.download = response.data.fileName;
            downloadLink.click();
        }, function errorCallback(response) {
        });
    }

    $scope.delete = function (id) {
        if (confirm(locale().COMMON.DELETE)) {
            $http.delete(`${URL}/api/ledsanimations/${id}`).then(function successCallback(response) {
                $scope.list();
                notify(locale().AUDIO.NOTIFY.DELETE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().AUDIO.NOTIFY.ERROR,  'danger');
            });
        }
    }
        
    $scope.dataTable = function (way = 0) {
        Object.assign($scope, dataTable($scope, way, 'name'));
    }

    $("div#drop").dropzone({ url: `${URL}/api/ledsanimations`, acceptedFiles: '.js', timeout: 100000, maxFilesize: 100 });
    $scope.list();
}]);