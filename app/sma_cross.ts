#!/usr/bin/env node
import { binance } from 'ccxt';
import { SMACross } from '../bot/sma_cross';
import { KLineWatcherLite } from '../watcher/kline_watcher_lite';
import { fill_params } from '.';
import { DingTalk } from '../notifier/dingtalk';
import { RealSpot } from '../executor/real_spot';

const secret = require('../.secret.json');

(async () => {
  const params = {
    name: 'v2-test',
    symbol: 'ETH/USDT',
    timeframe: '1m',
    fast_period: 10,
    slow_period: 40,
    interval: 0,
    funds: 15,
    assets: 0,
  };
  fill_params(params);
  const notifier = new DingTalk(secret.notifier);
  const exchange = new binance(secret.exchange);
  console.log('loading market...');
  await exchange.loadMarkets();
  const executor = new RealSpot({ exchange, notifier, ...params });
  const bot = new SMACross(executor, params);
  new KLineWatcherLite().RunBot({ exchange, bot, ...params });
})();
