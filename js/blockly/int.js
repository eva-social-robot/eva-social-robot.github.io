var dataInteraction = [["option", "OPTIONNAME"]];
var interaction = new Promise((resolve, reject) => {
  fetch(`${URL}/api/interaction`,
    {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem("currentUser")).token
      }
    })
    .then(response => response.json())
    .then(data => {
      dataInteraction = [];
      for (let i = 0; i < data.length; i++) {
        dataInteraction.push([data[i].nombre, data[i].id]);
      }
    })
  resolve();
})

Blockly.Blocks['int'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(locale().INTERACTION.INT)
      .appendField(new Blockly.FieldDropdown(dataInteraction), "int");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip(locale().INTERACTION.INT);
    this.setHelpUrl("");
  }
};