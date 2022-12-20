var client = new Paho.Client('broker.mqttdashboard.com', Number(8000), "asdasd987987asdasdasd987987");

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({ onSuccess: onConnect });

function onConnect() {
    client.subscribe("eva/server");
}

function publish(id, text) {
    message = new Paho.Message(text);
    message.destinationName = `eva/${id}`;
    client.send(message);
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    let response = JSON.parse(message.payloadString);
}