import { binance } from 'ccxt';
import { RealSpot } from '../executor/real_spot';
import { DingTalk } from '../notifier/dingtalk';

const secret = require('./.secret.json');
const config = require('./.dingtalk.json');

async function main() {
  const notifier = new DingTalk(config);
  const exchange = new binance({ ...secret, enableRateLimit: true });
  console.log('加载市场...');
  await exchange.loadMarkets();
  const spot = new RealSpot({ exchange, symbol: 'UNI/USDT', funds: 15, assets: 0, notifier });
  console.log('发起买交易...');
  await spot.BuyAll(5);
  console.log('发起卖交易...');
  await spot.SellAll(5);
  console.log('结束');
}

main();
