eva.controller('voice', ['$scope', '$http', function ($scope, $http) {
    $scope.listado = [];
    $scope.icon = true;
    $scope.updateid;
    $scope.accion = locale().COMMON.ADD;
    Object.assign($scope, dataTableValues());

    $scope.list = function () {
        $http.get(`${URL}/api/voice`).then(function successCallback(response) {
            $scope.listado = response.data;
            $scope.dataTable();
        }, function errorCallback(response) {
        });
    }

    $scope.create = function () {
        var json = { idioma: $scope.idioma, servicio: $scope.servicio, codigo: $scope.codigo, nombre: $scope.nombre };
        $http.post(`${URL}/api/voice`, json).then(function successCallback(response) {
            $scope.clear();
            notify(locale().VOICE.NOTIFY.POST.SUCCESS);
        }, function errorCallback(response) {
            notify(locale().VOICE.NOTIFY.ERROR,  'danger');
        });
    }

    $scope.update = function (l) {
        $scope.updateid = l._id;
        $scope.idioma = l.idioma;
        $scope.servicio = l.servicio;
        $scope.codigo = l.codigo;
        $scope.nombre = l.nombre;
        $scope.icon = false;
        $scope.accion = locale().COMMON.EDIT;
        $('#myModal').modal('show');
    }

    $scope.updatesend = function () {
        var json = { idioma: $scope.idioma, servicio: $scope.servicio, codigo: $scope.codigo, nombre: $scope.nombre };
        $http.put(`${URL}/api/voice/` + $scope.updateid, json).then(function successCallback(response) {
            $scope.clear();
            notify(locale().VOICE.NOTIFY.UPDATE.SUCCESS);
        }, function errorCallback(response) {
            notify(locale().VOICE.NOTIFY.ERROR,  'danger');
        });
    }

    $scope.enable = function (obj) {
        obj.enabled = !(!!obj.enabled);
        $http.put(`${URL}/api/voice/${obj._id}`, obj).then(function successCallback(response) {
            $scope.clear();
            notify(locale().LISTEN.NOTIFY.UPDATE.SUCCESS);
        }, function errorCallback(response) {
            notify(locale().LISTEN.NOTIFY.ERROR,  'danger');
        });
    }

    $scope.delete = function (id) {
        if (confirm(locale().COMMON.DELETE)) {
            $http.delete(`${URL}/api/voice/${id}`).then(function successCallback(response) {
                $scope.list();
                notify(locale().VOICE.NOTIFY.DELETE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().VOICE.NOTIFY.ERROR, 'danger');
            });
        }
    }

    $scope.dataTable = function (way = 0) {
        let obj = dataTable($scope, way, 'nombre', 'codigo', 'idioma', 'servicio');
        Object.assign($scope, obj);
    }

    $scope.clear = function () {
        Object.assign($scope, { idioma: '', servicio: '', codigo: '', nombre: '', icon: true, accion: locale().COMMON.ADD });
        $('#myModal').modal('hide');
        $scope.list();
    }

    $scope.list();
}]);