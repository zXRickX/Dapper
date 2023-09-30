const { default: makeWASocket, DisconnectReason, BufferJSON, useMultiFileAuthState, makeInMemoryStore
} = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');

async function bot() {
  const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) });
  
  console.log('Verificando se a credenciais configuradas...');
  const { state, saveCreds } = await useMultiFileAuthState('./src/data/loggin');
  
  console.log('Conectando com Whatsapp...');
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent'}),
    printQRInTerminal: true
  });
  store.bind(sock.ev);
  
  console.log('Salvando credenciais...');
  sock.ev.on('creds.update', saveCreds);
  
  console.log('Verificando conexão...');
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if ( connection === 'close' ) {
      console.log('Conexão falhou...');
    } else if ( connection === 'open' ) {
      console.log('[Conectado]');
    };
  });
  return sock;
};

module.exports = bot;