require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Servir os arquivos estáticos compilados do React (Vite)
app.use(express.static(path.join(__dirname, 'client/dist')));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.SERVER_PORT || 3001;
const SERIAL_PORT_PATH = process.env.SERIAL_PORT || 'COM45';
const USE_MOCK = process.env.USE_MOCK === 'true';

let serialPort;
let parser;

function connectSerial() {
    if (USE_MOCK) {
        console.log("⚠️ MODO MOCK ATIVADO: Simulando dados do sensor.");
        setInterval(() => {
            const simulatedValue = Math.floor(Math.random() * (500 - 300 + 1) + 300);
            io.emit('air_data', {
                value: simulatedValue,
                timestamp: new Date().toISOString(),
                simulated: true
            });
        }, 2000);
        return;
    }

    try {
        serialPort = new SerialPort({
            path: SERIAL_PORT_PATH,
            baudRate: 115200,
            autoOpen: false
        });

        parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        serialPort.open((err) => {
            if (err) {
                console.error(`Erro ao abrir a porta ${SERIAL_PORT_PATH}:`, err.message);
                console.log("Falha ao conectar no sensor físico.");
                return;
            }
            console.log(`Conectado com sucesso à porta ${SERIAL_PORT_PATH} - Lendo dados reais!`);
            
            serialPort.set({ dtr: false, rts: true }, (err) => {
                if (err) console.error('⚠️ Erro ao definir DTR/RTS (passo 1):', err.message);
                setTimeout(() => {
                    serialPort.set({ dtr: false, rts: false }, (err) => {
                        if (err) console.error('⚠️ Erro ao definir DTR/RTS (passo 2):', err.message);
                        else console.log('🟢 Reset serial concluído. Aguardando dados do sensor...');
                    });
                }, 200);
            });
        });

        serialPort.on('data', (rawBuf) => {
            const dataStr = rawBuf.toString().trim();
            if (dataStr) {
                const cleaned = dataStr.replace(/[^\d]/g, '');
                if (cleaned) {
                    const value = parseInt(cleaned, 10);
                    io.emit('air_data', {
                        value: value,
                        timestamp: new Date().toISOString(),
                        simulated: false
                    });
                }
            }
        });

        parser.on('data', (data) => {
            const dataStr = data.trim();
            const cleaned = dataStr.replace(/[^\d]/g, '');
            if (cleaned) {
                const value = parseInt(cleaned, 10);
                io.emit('air_data', {
                    value: value,
                    timestamp: new Date().toISOString(),
                    simulated: false
                });
            }
        });

        serialPort.on('error', (err) => {
            console.error('Erro na porta serial:', err.message);
        });

    } catch (error) {
        console.error('Erro ao configurar serial:', error.message);
    }
}

connectSerial();

// Redireciona qualquer outra rota para o frontend (SPA)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

server.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🌬️ BREEZY - MONITORAMENTO DO AR (PPM)`);
    console.log(`==========================================`);
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Aguardando dados reais na porta: ${SERIAL_PORT_PATH}`);
});
