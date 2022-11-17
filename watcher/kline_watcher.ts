import { Exchange } from 'ccxt';
import { Bot } from '../bot';
import { ArrayToKLine, OHLCV } from '../tc/ohlcv';

export
class KLineWatcher {
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
}
