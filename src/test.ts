import HttpsProxyAgent from 'https-proxy-agent';
import { ExFactory } from './utils/ex_factory';

const secret = require('../.secret.json');

async function main() {
  const exchange = ExFactory({
    ...secret.exchange,
    agent: secret.exchange.https_proxy_agent ?
      HttpsProxyAgent(secret.exchange.https_proxy_agent) : undefined,
  });
  await exchange.loadMarkets();
  console.log('你好，世界');
}

main();
