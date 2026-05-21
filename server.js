const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3001;
const SERIAL_PORT_PATH = 'COM45'; // Configurado pelo usuário

let serialPort;
let parser;

function connectSerial() {
    try {
        serialPort = new SerialPort({
            path: SERIAL_PORT_PATH,
            baudRate: 9600,
            autoOpen: false
        });

        parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        serialPort.open((err) => {
            if (err) {
                console.error(`Erro ao abrir a porta ${SERIAL_PORT_PATH}:`, err.message);
                console.log("Iniciando modo Simulação...");
                startSimulation();
                return;
            }
            console.log(`Conectado à porta ${SERIAL_PORT_PATH}`);
        });

        parser.on('data', (data) => {
            console.log('Dados do Sensor:', data);
            const value = parseFloat(data);
            if (!isNaN(value)) {
                io.emit('air_data', {
                    value: value,
                    timestamp: new Date().toISOString()
                });
            }
        });

        serialPort.on('error', (err) => {
            console.error('Erro na porta serial:', err.message);
        });

    } catch (error) {
        console.error('Erro ao configurar serial:', error.message);
        startSimulation();
    }
}

function startSimulation() {
    setInterval(() => {
        // Simula uma variação realista de PPM (450 a 2200)
        const base = 900 + Math.sin(Date.now() / 30000) * 600;
        const noise = Math.random() * 40 - 20;
        const simulatedValue = Math.floor(base + noise);
        
        io.emit('air_data', {
            value: simulatedValue,
            timestamp: new Date().toISOString(),
            simulated: true
        });
    }, 2000);
}

connectSerial();

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
