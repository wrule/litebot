import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
import { DingTalk } from './notifier/dingtalk';

const secret = require('./.secret.json');

async function main() {
  const notifier = new DingTalk(secret.notifier);
  const exchange = new binance(secret.exchange);
  await exchange.loadMarkets();
  const spot = new RealSpot({
    exchange, notifier,
    name: '测试',
    symbol: 'BTC/USDT',
    init_funds: 15,
    init_assets: 0,
  });
  await spot.BuyAll(1);
  await spot.SellAll(1);
  await spot.BuyAll(1);
  await spot.SellAll(1);
  await spot.BuyAll(1);
  await spot.SellAll(1);
}

main();
