eva.controller('scriptdata', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.listado = [];
    $scope.accion = locale().COMMON.ADD;
    $scope.icon = true;
    $scope.updateid;
    Object.assign($scope, dataTableValues());

    $scope.list = function () {
        $http.get(`${URL}/api/script/data/` + $scope.script).then(function successCallback(response) {
            $scope.listado = response.data;
            $scope.dataTable();
        }, function errorCallback(response) {
        });
    }

    $scope.slist = function () {
        $http.get(`${URL}/api/script`).then(function successCallback(response) {
            $scope.slistado = response.data;
            if (!!$routeParams.id) {
                $scope.script = $routeParams.id;
                $scope.list();
            }
        }, function errorCallback(response) {
        });
    }

    $scope.create = function () {
        var json = { campo1: $scope.c1.trim(), campo2: $scope.c2, campo3: $scope.c3, campo4: $scope.c4, script: $scope.script };
        $http.post(`${URL}/api/scriptdata`, json).then(function successCallback(response) {
            $scope.clear();
            notify(locale().SCRIPT_DATA.NOTIFY.POST.SUCCESS);
        }, function errorCallback(response) {
            notify(locale().SCRIPT_DATA.NOTIFY.ERROR,  'danger');
        });
    }

    $scope.update = function (l) {
        $scope.updateid = l._id;
        $scope.c1 = l.campo1;
        $scope.c2 = l.campo2;
        $scope.c3 = l.campo3;
        $scope.c4 = l.campo4;
        $scope.icon = false;
        $scope.accion = locale().COMMON.EDIT;
        $('#myModal').modal('show');
    }

    $scope.updatesend = function () {
        var json = { campo1: $scope.c1.trim(), campo2: $scope.c2, campo3: $scope.c3, campo4: $scope.c4 };
        $http.put(`${URL}/api/scriptdata/` + $scope.updateid, json).then(function successCallback(response) {
            $scope.clear();
            notify(locale().SCRIPT_DATA.NOTIFY.UPDATE.SUCCESS);
        }, function errorCallback(response) {
            notify(locale().SCRIPT_DATA.NOTIFY.ERROR,  'danger');
        });
    }

    $scope.delete = function (id) {
        if (confirm(locale().COMMON.DELETE)) {
            $http.delete(`${URL}/api/scriptdata/${id}`).then(function successCallback(response) {
                $scope.list();
                notify(locale().SCRIPT_DATA.NOTIFY.DELETE.SUCCESS);
            }, function errorCallback(response) {
                notify(locale().SCRIPT_DATA.NOTIFY.ERROR, 'danger');
            });
        }
    }

    $scope.speak = function (value) {
        var synth = window.speechSynthesis;
        var utterThis = new SpeechSynthesisUtterance(value);
        synth.speak(utterThis);
    }

    $scope.dataTable = function (way = 0) {
        let obj = dataTable($scope, way, 'campo1', 'campo2');
        Object.assign($scope, obj);
    }

    $scope.clear = function () {
        Object.assign($scope, { c1: '', c2: '', c3: '', c4: '', icon: true, accion: locale().COMMON.ADD });
        $('#myModal').modal('hide');
        $scope.list();
    }

    $scope.slist();
}]);


