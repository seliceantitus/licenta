const http = require('http');
const app = require('./api/app');
const server = http.createServer(app);
server.listen(3000);

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const serialPort = new SerialPort('COM5', { baudRate: 9600 });
const parser = serialPort.pipe(new Readline());

const SerialController = require('./serial/controller');
const serialController = new SerialController();

parser.on('data', data => {
    try{
        const jsonData = JSON.parse(data);
        serialController.parse(jsonData);
    } catch (e) {
        console.log("Error: ", e);
    }
});