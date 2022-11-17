import { Exchange } from 'ccxt';
import { Bot } from '../bot';
import { ArrayToKLine, OHLCV } from '../tc/ohlcv';


export
function TimeFrameToMS(timeframe: string) {
  const result = /^(\d+)(m|h)$/.exec(timeframe);
  if (result == null) throw 'unknown timeframe';
  return Number(result[1]) * (result[2] == 'm' ? 60 * 1e3 : 60 * 1e6);
}

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

  private async get_server_time(exchange: Exchange) {
    try {
      const start_time = Number(new Date());
      const server_time = await exchange.fetchTime();
      const request_time = Number(new Date()) - start_time;
      if (request_time > 5000) throw 'request time is greater than 5000 milliseconds';
      return server_time + request_time;
    } catch (e) {
      console.log(e);
    }
    return -1;
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
