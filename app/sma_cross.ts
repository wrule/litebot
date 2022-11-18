#!/usr/bin/env node
import { binance } from 'ccxt';
import { SMACross } from '../bot/sma_cross';
import { SimpleSpot } from '../executor/simple_spot';
import { KLineWatcherLite } from '../watcher/kline_watcher_lite';
import { App } from '.';

class SmaCross
extends App {
  public async Run() {
    const params = {
      symbol: 'ETH/USDT',
      timeframe: '1m',
      fast_period: 10,
      slow_period: 40,
      interval: 0,
    };
    this.fill_params(params);
    const exchange = new binance({ });
    console.log('loading market...');
    await exchange.loadMarkets();
    const executor = new SimpleSpot(100, 0.001);
    const bot = new SMACross(executor, params);
    new KLineWatcherLite().RunBot(exchange, params.symbol, params.timeframe, bot, params.interval);
  }
}

new SmaCross().Run();
