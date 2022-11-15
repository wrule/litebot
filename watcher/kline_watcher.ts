import { Exchange } from 'ccxt';
import { ArrayToKLine, OHLCV } from '../tc/ohlcv';

export
class KLineWatcher {
  public async Fetch(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit: number,
  ) {
    const data = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit + 1);
    data.splice(data.length - 1, 1);
    return ArrayToKLine(data);
  }

  public async Start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit: number,
    callback: (kline: OHLCV[]) => void,
    interval = 1000,
  ) {
    try {
      callback(await this.Fetch(exchange, symbol, timeframe, limit));
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.Start(exchange, symbol, timeframe, limit, callback, interval);
      }, interval);
    }
  }
}
