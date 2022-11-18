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

  private interval!: number;
  private kline_interval!: number;
  private active_mode!: boolean;

  private get smart_interval() {
    if (this.active_mode) return this.interval;
    const current_time = Number(new Date());
    const next_time = current_time - current_time % this.kline_interval + this.kline_interval;
    return next_time - current_time - 15 * 1e3;
  }

  private async start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    callback: (kline: OHLCV[]) => void,
  ) {
    try {
      this.active_mode = true;
      callback(await this.Fetch(exchange, symbol, timeframe, 1));
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.start(exchange, symbol, timeframe, callback);
      }, this.smart_interval);
    }
  }

  public async RunBot(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    bot: Bot<any, any, any>,
    interval = 1000,
  ) {
    this.active_mode = true;
    this.interval = interval;
    this.kline_interval = TimeFrameToMS(timeframe);
    console.log('initialize data for the robot...');
    await this.Fetch(exchange, symbol, timeframe, bot.length(), bot);
    console.log('monitor the market...');
    this.start(exchange, symbol, timeframe, (kline) => {
      console.log(kline[0].time, kline[0].close);
      if (kline[0]?.time > bot.SignalQueue[bot.SignalQueue.length - 1]?.time) {
        this.active_mode = false;
        bot.Update(kline[0]);
        console.log(kline[0]);
      }
    });
  }
}
