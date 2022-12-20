var dataSound = [["option", "OPTIONNAME"]];
var sound = new Promise((resolve, reject) => {
  fetch(`${URL}/api/audio`,
    {
      headers: {
        'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem("currentUser")).token
      }
    })
    .then(response => response.json())
    .then(data => {
      dataSound = [];
      for (let i = 0; i < data.length; i++) {
        dataSound.push([data[i].nombre, data[i].nombre]);
      }
    })
  resolve();
});

Blockly.Blocks['sound'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(locale().INTERACTION.SOUND)
      .appendField(new Blockly.FieldDropdown(dataSound), "sound")
      .appendField(locale().INTERACTION.WAIT)
      .appendField(new Blockly.FieldCheckbox("FALSE"), "wait");
    this.appendStatementInput("led")
      .setCheck(null)
      .appendField(locale().INTERACTION.LED);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip(locale().INTERACTION.SOUND);
    this.setHelpUrl("");
  }
};