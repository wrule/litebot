#!/usr/bin/env node
import { binance } from 'ccxt';
import { KLineWatcher } from '../watcher/kline_watcher';
import { fill_params } from '.';
import { DingTalk } from '../notifier/dingtalk';
import { RealSpot } from '../executor/real_spot';
import { StochRSICross } from '../bot/stoch_rsi_cross';
import { SimpleSpot } from '../executor/simple_spot';

const secret = require('../.secret.json');

(async () => {
  const params = {
    name: '红眼',
    symbol: 'ETH/USDT',
    timeframe: '1m',
    rsi_period: 2,
    stoch_period: 3,
    k_period: 4,
    d_period: 5,
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
  // const executor = new SimpleSpot();
  const bot = new StochRSICross(executor, params);
  new KLineWatcher().RunBot({ exchange, bot, ...params });
})();
