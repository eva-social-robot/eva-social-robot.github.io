eva.controller('robot', ['$scope', '$http', function ($scope, $http) {
    $scope.listado = [];
    $scope.icon = true;
    $scope.updateid;
    $scope.accion = locale().COMMON.ADD;
    Object.assign($scope, dataTableValues());

    $scope.list = function () {
        $http.get(`${URL}/api/robot`).then(function successCallback(response) {
            $scope.listado = response.data;
            $scope.dataTable();
        }, function errorCallback(response) {
            $scope.listado = []
        });
    }

    $scope.create = function () {
        if ($scope.validuuid($scope.robot) && !!$scope.alias && $scope.alias !== '') {
            var json = { alias: $scope.alias, robot: $scope.robot };
            $http.post(`${URL}/api/robot`, json).then(function successCallback(response) {
                $scope.clear();
                notify(locale().ROBOT.NOTIFY.POST.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().ROBOT.NOTIFY.ERROR, 'danger');
            });
        } else {
            notify(locale().ROBOT.NOTIFY.UUID, 'warning');
        }
    }

    $scope.update = function (l) {
        $scope.updateid = l.id;
        $scope.alias = l.alias;
        $scope.robot = l.robot;
        $scope.icon = false;
        $scope.accion = locale().COMMON.EDIT;
        $('#myModal').modal('show');
    }

    $scope.updatesend = function () {
        if ($scope.validuuid($scope.robot) && !!$scope.alias && $scope.alias !== '') {
            var json = { alias: $scope.alias, robot: $scope.robot };
            $http.put(`${URL}/api/robot/` + $scope.updateid, json).then(function successCallback(response) {
                $scope.clear();
                notify(locale().ROBOT.NOTIFY.UPDATE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().ROBOT.NOTIFY.ERROR, 'danger');
            });
        } else {
            notify(locale().ROBOT.NOTIFY.UUID, 'warning');
        }
    }

    $scope.enable = function (obj) {
        obj.enabled = !(!!obj.enabled);
        $http.put(`${URL}/api/robot/${obj.id}`, obj).then(function successCallback(response) {
            $scope.clear();
            notify(locale().ROBOT.NOTIFY.UPDATE.SUCCESS);
        }, function errorCallback(response) {
            notify(locale().ROBOT.NOTIFY.ERROR, 'danger');
        });
    }

    $scope.clear = function () {
        Object.assign($scope, { alias: '', robot: '', watson: '', icon: true, accion: locale().COMMON.ADD })
        $('#myModal').modal('hide');
        $scope.list();
    }

    $scope.delete = function (id) {
        if (confirm(locale().COMMON.DELETE)) {
            $http.delete(`${URL}/api/robot/${id}`).then(function successCallback(response) {
                $scope.list();
                notify(locale().ROBOT.NOTIFY.DELETE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().ROBOT.NOTIFY.ERROR, 'danger');
            });
        }
    }
    
    $scope.dataTable = function (way = 0) {
        let obj = dataTable($scope, way, 'alias', 'robot');
        Object.assign($scope, obj);
    }

    $scope.validuuid = function (uuid) {
        return (/^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid));
    }

    $scope.list();
}]);