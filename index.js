const bot = require('./src/main/config/bot');

async function start() {
  const robot = await bot();
}

start();
