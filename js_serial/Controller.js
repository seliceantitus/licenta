const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('COM5')

const parser = port.pipe(new Readline())

parser.on('data', data => {
    port.write('ROBOT PLEASE RESPOND\n\r');
    console.log(data)
});