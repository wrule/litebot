#!/usr/bin/env node
import { binance } from 'ccxt';
import { SMACross } from './bot/sma_cross';
import { SimpleSpot } from './executor/simple_spot';
import { KLineWatcherLite } from './watcher/kline_watcher_lite';
import yargs from 'yargs/yargs';
import { hideBin }  from 'yargs/helpers';

function params_command_line_view(params: any) {
  const cp = { ...params };
  delete cp['_'];
  const script_name = cp['$0'];
  delete cp['$0'];
  return `./${script_name} ${Object.entries(cp).map(([key, value]) => `--${key} ${value}`).join(' ')}`;
}

function params_view(params: any) {
  const cp = { ...params };
  delete cp['_'];
  delete cp['$0'];
  return cp;
}

function fill_params(params: any) {
  Object.entries(yargs(hideBin(process.argv)).argv).forEach(([key, value]) => {
    if (params[key] == null) throw `unknown parameter ${key}`;
    params[key] = value;
  });
  console.log(params_command_line_view(params));
  console.log(params_view(params));
}

async function main() {
  let params = {
    symbol: 'ETH/USDT',
    timeframe: '1m',
    fast_period: 10,
    slow_period: 40,
    interval: 0,
  };
  fill_params(params);
  const exchange = new binance({ });
  console.log('loading market...');
  await exchange.loadMarkets();
  const executor = new SimpleSpot(100, 0.001);
  const bot = new SMACross(executor, params);
  new KLineWatcherLite().RunBot(exchange, params.symbol, params.timeframe, bot, params.interval);
}

main();
