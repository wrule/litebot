import fs from 'fs';
import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
import { DingTalk } from './notifier/dingtalk';
import { SMACross } from './user/sma_cross';
import { SimpleSpot } from './executor/simple_spot';

const secret = require('./.secret.json');

async function main() {
  const a = new SMACross(new SimpleSpot(), { fast_period: 4, slow_period: 99 });
  return;
  const exchange = new binance(secret.exchange);
  const notifier = new DingTalk(secret.notifier);
  console.log('加载市场...');
  await exchange.loadMarkets();

  Object.entries(await exchange.fetchFreeBalance())
    .filter(([key, value]) => value > 0)
    .forEach(([key, value]) => {
      console.log(key, value);
    });

  const spot = new RealSpot({
    exchange, notifier,
    symbol: 'ETH/BUSD',
    funds: 1e6,
  });
  await spot.BuyAll(1200);
}

main();
