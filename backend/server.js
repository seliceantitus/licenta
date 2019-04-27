const http = require('http');
const serverPort = 3000;
const app = require('./api/app');
const server = http.createServer(app);
server.listen(serverPort);

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', { baudRate: 9600 });
const parser = serialPort.pipe(new Readline());

const SerialController = require('./serial/controller');
const serialController = new SerialController();

parser.on('data', data => {
    const response = serialController.parse(JSON.parse(data));
    if (response){
        console.log("ACK and got response: ", response);
        // serialPort.write(response);
    } else {
        console.log("ACK");
    }
});