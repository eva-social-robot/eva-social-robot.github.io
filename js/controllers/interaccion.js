eva.controller('interaccion', ['$scope', '$http', function ($scope, $http) {
  $scope.listado = [];
  $scope.stt = [];
  $scope.icon = true;
  $scope.updateid;
  var workspace = null;

  $scope.list = function () {
    getData(`${URL}/api/interaction`, 'listado');
  }

  $scope.slist = function () {
    Promise.all([led, sound, mov, voice, listen, image]).then(values => {
      var toolbox = document.getElementById("toolbox");

      var options = {
        toolbox: toolbox, collapse: false, comments: false, disable: false, maxBlocks: 0, trashcan: true, horizontalLayout: false, toolboxPosition: 'start',
        css: true, media: 'https://blockly-demo.appspot.com/static/media/', rtl: false, scrollbars: true, sounds: true, oneBasedIndex: true,
        zoom: { controls: true, wheel: true, startScale: 1, maxScale: 3, minScale: 0.5, scaleSpeed: 1.01 }
      };

      workspace = Blockly.inject("myDiagramDiv", options);
      var workspaceBlocks = document.getElementById("workspaceBlocks");
      Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);
    })
  }

  function getData(url, property) {
    $http.get(url).then(function successCallback(response) {
      $scope[property] = response.data;
    }, function errorCallback(response) {
    });
  }

  $scope.iniciarInteracciong = function (id) {
    $http.get(`${URL}api/interaction/` + id).then(function (res) {
    }, function (error) {
      console.log(error);
    });
  };

  $scope.create = function () {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    console.log(JSON.stringify(xmlToJson(xml)));

    var json = { nombre: $scope.nombre, xml: xml_text, descripcion: $('#desc').val() ?? "" };
    $http.post(`${URL}/api/interaction`, json).then(function successCallback(response) {
      $scope.reset();
      $scope.list();
      id = 0;
    }, function errorCallback(response) {
    });
  }

  $scope.update = function (l) {
    $scope.reset();
    $scope.updateid = l._id;
    $scope.nombre = l.nombre;
    $('#desc').val(l.descripcion);
    var xml = Blockly.Xml.textToDom(l.xml);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }

  $scope.updatesend = function (end = false) {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    console.log(JSON.stringify(xmlToJson(xml)));

    var json = { nombre: $scope.nombre, xml: xml_text, descripcion: $('#desc').val() ?? "" };
    $http.put(`${URL}/api/interaction/` + $scope.updateid, json).then(function successCallback(response) {
      if (end) {
        $scope.reset();
      }
      $scope.list();
    }, function errorCallback(response) {
    });
  }

  $scope.delete = function (id) {
    if (confirm(locale().COMMON.DELETE)) {
      $http.delete(`${URL}/api/interaction/` + id).then(function successCallback(response) {
        $scope.list();
      }, function errorCallback(response) {
      });
    }
  }

  $scope.add = function () {
    $scope.reset();
  }

  $scope.reset = function () {
    $scope.updateid = '';
    $scope.nombre = '';
    Blockly.Events.disable();
    workspace.clear();
    Blockly.Events.enable();
  }

  $scope.download = function (id) {
    if (!sessionStorage.getItem('currentUser')) {
      //notify(locale().LED.NOTIFY.ERROR, 'danger');
      notify("Necesitas estar autenticado.", 'danger');
      return;
    }
  }

  $scope.import = function () {
    $scope.update(JSON.parse($('textarea').val()));
    $scope.updateid = '';
    $scope.accion = locale().COMMON.ADD;
    $scope.icon = true;
    $('#modalimport').modal('hide');
  }

  $scope.list();
  $scope.slist();
}]);