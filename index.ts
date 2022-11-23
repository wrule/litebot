import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
import { DingTalk } from './notifier/dingtalk';

const secret = require('./.secret.json');

async function main() {
  const exchange = new binance(secret.exchange);
  const notifier = new DingTalk(secret.notifier);
  console.log('加载市场...');
  await exchange.loadMarkets();
  const spot = new RealSpot({
    exchange, notifier,
    symbol: 'ETH/BUSD',
    funds: 1e6,
  });
  console.log('交易');
  await spot.BuyAll(1200);
}

main();
