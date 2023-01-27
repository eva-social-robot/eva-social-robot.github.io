var dataLed = [["option", "OPTIONNAME"]];
var led = new Promise((resolve, reject) => {
  if (sessionStorage.getItem("currentUser")) {
    fetch(`${URL}/api/led`,
      {
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem("currentUser")).token
        }
      })
      .then(response => response.json())
      .then(data => {
        dataLed = [];
        for (let i = 0; i < data.length; i++) {
          dataLed.push([data[i].nombre, data[i].id]);
        }
      })
  }
  resolve();
})

Blockly.Blocks['led'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(locale().INTERACTION.LED)
      .appendField(new Blockly.FieldDropdown(dataLed), "leds");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip(locale().INTERACTION.LED);
    this.setHelpUrl("");
  }
};