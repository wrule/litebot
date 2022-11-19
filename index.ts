import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
import { DingTalk } from './notifier/dingtalk';

const secret = require('./.secret.json');

async function main() {
  // const exchange = new binance(secret.exchange);
  const notifier = new DingTalk(secret.notifier);
  notifier.SendMessage('你好，世界');
  // const spot = new RealSpot({
  //   exchange, notifier,
  //   name: '测试',
  //   symbol: 'BTC/USDT',
  //   init_funds: 15,
  //   init_assets: 0,
  // });
  // spot.BuyAll(1);
}

main();
