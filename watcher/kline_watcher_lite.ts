import { Exchange } from 'ccxt';
import { Bot } from '../bot';
import { ArrayToKLine, OHLCV } from '../tc/ohlcv';

export
class KLineWatcherLite {
  public async Fetch(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit: number,
    bot?: Bot<any, any, any>,
  ) {
    const data = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit + 1);
    data.splice(data.length - 1, 1);
    const kline = ArrayToKLine(data);
    kline.forEach((ohlcv) => bot?.Update(ohlcv, false));
    return kline;
  }

  public async Start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    callback: (kline: OHLCV[]) => void,
    interval = 1000,
  ) {
    try {
      callback(await this.Fetch(exchange, symbol, timeframe, 1));
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.Start(exchange, symbol, timeframe, callback, interval);
      }, interval);
    }
  }

  public async RunBot(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    bot: Bot<any, any, any>,
    interval = 1000,
  ) {
    console.log('initialize data for the robot...');
    await this.Fetch(exchange, symbol, timeframe, bot.length(), bot);
    console.log('monitor the market...');
    this.Start(exchange, symbol, timeframe, (kline) => {
      if (kline[0]?.time > bot.SignalQueue[bot.SignalQueue.length - 1]?.time) {
        bot.Update(kline[0]);
        console.log(kline[0]);
      }
    }, interval);
  }
}
