const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('COM5', { baudRate: 9600 });
const parser = port.pipe(new Readline());


parser.on('data', data => {
    const parsed = JSON.parse(data);
    console.log(parsed);
});

const json = {
    command: "start2"
};