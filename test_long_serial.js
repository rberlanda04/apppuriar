const { SerialPort } = require('serialport');

console.log('Abrindo porta COM13 no modo diagnóstico raw...');
const port = new SerialPort({
  path: 'COM13',
  baudRate: 9600, // tenta com 9600 primeiro
});

port.on('open', () => {
  console.log('Porta aberta com sucesso! Aguardando bytes brutos...');
});

port.on('data', (buf) => {
  console.log('RAW BUFFER RECEBIDO (ASCII):', buf.toString());
  console.log('RAW BUFFER RECEBIDO (HEX):', buf.toString('hex'));
});

port.on('error', (err) => {
  console.error('Erro na serial:', err.message);
});

setTimeout(() => {
  console.log('Fim do teste diagnostico.');
  port.close();
  process.exit(0);
}, 10000);
