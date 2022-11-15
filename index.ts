import { binance } from 'ccxt';
import { RealSpot } from './executor/real_spot';
import { DingTalk } from './notifier/dingtalk';
const secret = require('./.secret.json');
const dingtalk = require('./.dingtalk.json');

async function main() {
  const notifier = new DingTalk(dingtalk);
  notifier.SendMessage('你好，世界');
  // const exchange = new binance({ ...secret, enableRateLimit: true });
  // console.log('加载市场...');
  // await exchange.loadMarkets();
  // const spot = new RealSpot({ exchange, symbol: 'UNI/USDT', init_funds: 15, init_assets: 0 });
  // console.log('发起交易...');
  // for(let i = 0; i < 100; ++i) {
  //   console.log(await spot.BuyAll());
  //   console.log(await spot.SellAll());
  // }
  // console.log('结束交易');
}

main();
