eva.controller('interaccion', ['$scope', '$http', function ($scope, $http) {
  $scope.listado = [];
  $scope.rl = [];
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

  $scope.iniciarInteracciong = function (obj, robot) {
    publish(robot, obj.xml);
  };

  $scope.rl = function () {
    $http.get(`${URL}/api/robot`).then(function successCallback(response) {
      $scope.rl = response.data;
    }, function errorCallback(response) {
      $scope.rl = [];
    });
  }

  $scope.create = function () {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    console.log(JSON.stringify(xmlToJson(xml)));

    var json = { name: $scope.name, xml: xml_text };
    $http.post(`${URL}/api/interaction`, json).then(function successCallback(response) {
      $scope.reset();
      $scope.list();
      id = 0;
    }, function errorCallback(response) {
    });
  }

  $scope.update = function (l) {
    $scope.reset();
    $scope.updateid = l.id;
    $scope.name = l.name;
    var xml = Blockly.Xml.textToDom(l.xml);
    Blockly.Xml.domToWorkspace(xml, workspace);
  }

  $scope.updatesend = function (end = false) {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    console.log(JSON.stringify(xmlToJson(xml)));

    var json = { name: $scope.name, xml: xml_text };
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
      $http.delete(`${URL}/api/interaction/${id}`).then(function successCallback(response) {
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
    $scope.name = '';
    Blockly.Events.disable();
    workspace.clear();
    Blockly.Events.enable();
  }

  $scope.download = function (l, opt) {
    let filename = l.name + ".json";
    var blob = (opt === 1)
      ? new Blob([JSON.stringify(l, null, "\t")], { type: "text/plain;charset=utf-8" })
      : new Blob([Blockly.Xml.textToDom($scope.asSimulator(l.name, xmlToJson(Blockly.Xml.textToDom(l.xml))))], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  }

  $scope.jsonToNodes = function (obj) {
    let nodes = [];
    if (!!obj.block) {
      let temp = obj.block;
      let node = { key: temp["@attributes"].id, type: temp["@attributes"].type }
      switch (temp["@attributes"].type) {
        case "controls_if":
          node.type = 'if';
          node['condition'] = [];
          let values = [].concat(temp.value);
          for (let i = 0; i < values.length; i++) {
            const element = values[i];
            if (!!element.block && element.block['@attributes']['type'] == "logic_compare") {
              let condition = { OP: element.block.field['#text'] };
              for (let j = 0; j < element.block.value.length; j++) {
                const attr = element.block.value[j];
                if (attr.block['@attributes'].type == 'speak_script') {
                  condition[attr['@attributes'].name] = `%${attr.block.field['#text']}`;
                } else {
                  condition[attr['@attributes'].name] = attr.block.field['#text'];
                }
              }
              let thenDo = temp.statement
                .find(x => x['@attributes'].name == `DO${element['@attributes'].name.substring(2)}`);
              if (!!thenDo || !!temp.next) {
                condition['next'] = !!thenDo ? thenDo.block['@attributes'].id : temp.next.block['@attributes'].id;
              }
              node['condition'].push(condition);
              if (!!thenDo) {
                nodes.push(...($scope.jsonToNodes(thenDo)));
              }
            }
          }
          let elseDo = temp.statement.find(x => x['@attributes'].name == 'ELSE');
          node['condition'].push({ next: elseDo.block['@attributes'].id });
          nodes.push(...($scope.jsonToNodes(elseDo)));
          break;
        case "controls_repeat_ext":
          node.type = 'for';
          if (!!temp.value.block && temp.value.block['@attributes'].type == 'math_random_int') {
            let valueBlock = temp.value.block.value;
            node['min'] = (!!valueBlock[0].block ? valueBlock[0].block.field['#text'] : valueBlock[0].shadow.field['#text']);
            node['max'] = (!!valueBlock[1].block ? valueBlock[1].block.field['#text'] : valueBlock[1].shadow.field['#text']);
          } else {
            node['iteraciones'] = parseInt(temp.value.shadow.field['#text']);
          }
          node['first'] = temp.statement.block["@attributes"].id;
          break;
        case "emotion":
          node['emotion'] = temp.field[0]['#text'];
          node['level'] = parseInt(temp.field[1]['#text']);
        case "image":
          node['url'] = temp.field['#text'];
          break;
        case "led":
          node['anim'] = temp.field['#text'];
          break;
        case "listen":
          node['service'] = temp.field[0]['#text'].includes('BroadbandModel') ? 'watson' : 'google';
          node['langcode'] = temp.field[0]['#text'];
          node['opt'] = temp.field[1]['#text'] || "";
          break;
        case "mov":
          node['mov'] = parseInt(temp.field['#text']);
          break;
        case "record":
        case "wait":
          node['time'] = parseInt(temp.field['#text']);
          break;
        case "sound":
          node['src'] = temp.field[0]['#text'];
          node['wait'] = temp.field[1]['#text'] == 'TRUE';
          if (!!temp.statement) {
            node['anim'] = temp.statement.block.field['#text'];
          }
          break;
        case "script":
          node['sc'] = temp.field[0]['#text'];
          node['random'] = temp.field[1]['#text'] == 'TRUE';
          node['read'] = temp.field[2]['#text'] == 'TRUE';
          node['order'] = temp.field[3]['#text'];
          node['unique'] = temp.field[4]['#text'];
          node['remove'] = temp.field[5]['#text'] == 'TRUE';
          //node['data'] = await LoadScriptData(node);
          break;
        case "speak":
          node['text'] = temp.field['#text'];
          break;
        case "speak_combine":
          node = { ...node, type: 'speak', text: '' };
          let subText = temp.value;
          while (!!subText.block) {
            if (subText.block['@attributes'].type == 'speak_text') {
              node.text += ` ${subText.block.field['#text']}`;
            } else if (subText.block['@attributes'].type == 'speak_var') {
              node.text += ` #${subText.block.field['#text']}`;
            } else if (subText.block['@attributes'].type == 'speak_script') {
              node.text += ` %${subText.block.field['#text']}`;
            } else if (subText.block['@attributes'].type == 'math_random_int') {
              node.text += 'r' + (!!subText.block.value[0].block
                ? subText.block.value[0].block.field['#text']
                : subText.block.value[0].shadow.field['#text'])
                + 't' + (!!subText.block.value[1].block
                  ? subText.block.value[1].block.field['#text']
                  : subText.block.value[1].shadow.field['#text']);
            }
            subText = subText.block.value || {};
          }
          node.text = node.text.trim();
          break;
        case "variables_set":
          node = { ...node, type: 'counter', count: temp.field['#text'] };
          if (temp.value.block['@attributes'].type == 'math_arithmetic') {
            node['ops'] = temp.value.block.field['#text'];
            let valueBlock = temp.value.block.value;
            node['first'] = (!!valueBlock[0].block ? valueBlock[0].block.field['#text'] : valueBlock[0].shadow.field['#text']);
            node['second'] = (!!valueBlock[1].block ? valueBlock[1].block.field['#text'] : valueBlock[1].shadow.field['#text']);
          } else if (temp.value.block['@attributes'].type == 'math_random_int') {
            node['ops'] = 'random';
            let valueBlock = temp.value.block.value;
            node['first'] = (!!valueBlock[0].block ? valueBlock[0].block.field['#text'] : valueBlock[0].shadow.field['#text']);
            node['second'] = (!!valueBlock[1].block ? valueBlock[1].block.field['#text'] : valueBlock[1].shadow.field['#text']);
          } else {
            node = { ...node, ops: 'assign', value: temp.value.block.field['#text'] };
          }
          break;
        case "voice":
          node['voice'] = temp.field[0]['#text'];
          node['translate'] = temp.field[1]['#text'] == 'TRUE';
          node['sourcelang'] = temp.field[2]['#text'];
        default:
          break;
      }
      if (!!temp.next) {
        if (temp.next.block['@attributes'].type == 'int') {
          temp.next = findById(temp.next.block.field['#text']);
        }
        node['next'] = temp.next.block['@attributes'].id;
      }
      nodes.push(node);
      if (!!node.first && node.type == 'for') {
        nodes.push(...($scope.jsonToNodes(temp.statement)));
      }
      if (!!node.next) {
        nodes.push(...($scope.jsonToNodes(temp.next)));
      }
    }
    return nodes;
  }

  $scope.asSimulator = function (name, obj) {

    let nodes = $scope.jsonToNodes(obj);
    let settings = "";
    let body = [];

    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i];

      if (element.type == "emotion") {
        let emotion = { ini: "NEUTRAL", joy: "HAPPY", sad: "SAD", anger: "ANGER" };
        body.push(`<evaEmotion emotion="${emotion[element.emotion]}" />`);
      } else if (element.type == "speak") {
        body.push(`<talk>${element.text}</talk>`);
      } else if (element.type == "wait") {
        body.push(`<wait duration="${element.time}"></wait>`);
      } else if (element.type == "listen") {
        body.push(`<listen />`);
      } else if (element.type == "sound") {
        body.push(`<audio source="${element.src}" block="TRUE"/>`);
      }

    }
    return `<?xml version="1.0" encoding="UTF-8"?>
    <evaml name="${name}" xsi:noNamespaceSchemaLocation="EvaML-Schema/evaml_schema.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    ${settings}
    ${body.join("\n")}
    </evaml>`;
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
  $scope.rl();
}]);