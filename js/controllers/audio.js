eva.controller('audio', ['$scope', '$http', function ($scope, $http) {
    $scope.listado = [];
    $scope.icon = true;
    $scope.updateid;
    Object.assign($scope, dataTableValues());

    $scope.list = function () {
        $http.get(`${URL}/api/audio`).then(function successCallback(response) {
            $scope.listado = response.data;
            $scope.dataTable();
        }, function errorCallback(response) {
        });
    }

    $scope.details = function (id) {
        const downloadLink = document.createElement("a");
        downloadLink.href = `${URL}/api/audio/${id}`;
        downloadLink.download = id;
        downloadLink.click();
    }

    $scope.delete = function (id) {
        if (confirm(locale().COMMON.DELETE)) {
            $http.delete(`${URL}/api/audio/${id}`).then(function successCallback(response) {
                $scope.list();
                notify(locale().AUDIO.NOTIFY.DELETE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().AUDIO.NOTIFY.ERROR,  'danger');
            });
        }
    }
        
    $scope.dataTable = function (way = 0) {
        let obj = dataTable($scope, way, 'nombre');
        Object.assign($scope, obj);
    }

    $("div#drop").dropzone({ url: `${URL}/api/audio`, acceptedFiles: '.wav', timeout: 100000, maxFilesize: 100 });

    $scope.list();
}]);