const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', {baudRate: 9600, autoOpen: false});
const parser = serialPort.pipe(new Readline());

const SerialParser = require('./parser');
const serialParser = new SerialParser();

class SerialController {
    constructor(SocketController) {
        this.socketController = SocketController;

        serialPort.on('open', function () {
            console.log('Port opened');
        });

        serialPort.open(function (err) {
            console.log("In Open");
            if (err) {
                return console.log('Error opening port: ', err.message)
            }
        });

        parser.on('data', data => {
            try {
                const jsonData = JSON.parse(data);
                serialParser.parse(jsonData);
                this.socketController.sendData(jsonData);
            } catch (e) {
                console.log(data);
                console.log("Error: ", e);
            }
        });
    }
}

module.exports = SerialController;