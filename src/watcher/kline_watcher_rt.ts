import { Exchange } from 'ccxt';
import { Bot } from '../bot';
import { ArrayToKLine, OHLCV } from '../tc/ohlcv';

export
class KLineWatcherRT {
  public async Fetch(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit: number,
    bot?: Bot<any, any>,
  ) {
    const kline = await this.FetchRT(exchange, symbol, timeframe, limit + 1);
    kline.splice(kline.length - 1, 1);
    kline.forEach((ohlcv) => bot?.Update(ohlcv, false, false));
    return kline;
  }

  public async FetchRT(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit: number,
  ) {
    return ArrayToKLine(await exchange.fetchOHLCV(symbol, timeframe, undefined, limit));
  }

  private interval!: number;

  private async start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    callback: (data: [OHLCV, OHLCV]) => void,
  ) {
    try {
      callback((await this.FetchRT(exchange, symbol, timeframe, 2)) as [OHLCV, OHLCV]);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.start(exchange, symbol, timeframe, callback);
      }, this.interval);
    }
  }

  public async RunBot(config: {
    exchange: Exchange,
    bot: Bot<any, any>,
    symbol: string,
    timeframe: string,
    interval: number,
  }) {
    this.interval = config.interval;
    console.log('initialize data for the robot...');
    await this.Fetch(config.exchange, config.symbol, config.timeframe, config.bot.length, config.bot);
    console.log('monitor the market...');
    this.start(config.exchange, config.symbol, config.timeframe, (kline) => {
      const [historical, active] = kline;
      if (historical?.time > config.bot.last?.time) config.bot.Update(historical);
      config.bot.Update(active);
    });
  }
}
