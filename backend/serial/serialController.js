const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', {baudRate: 9600, autoOpen: false});
const parser = serialPort.pipe(new Readline());

const SerialParser = require('./parser');
// const SocketController = require("../socket/socketController");
const serialParser = new SerialParser();

class SerialController {
    constructor(SocketController) {
        this.SocketController = SocketController;
        serialPort.open(function (err) {
            console.log("Opening port...");
            if (err) {
                console.log('Error opening port: ', err.message)
            } else {
                console.log('Port opened successfully')
            }
        });

        parser.on('data', data => {
            try {
                const jsonData = JSON.parse(data);
                serialParser.parse(jsonData);
                this.SocketController.sendData(jsonData);
            } catch (e) {
                console.log(data);
                console.log("Error: ", e);
            }
        });
    }

    static sendData(data){
        console.log('[SERIAL] ', data);
    }
}

module.exports = SerialController;
