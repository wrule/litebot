import { Exchange } from 'ccxt';
import { ArrayToKLine } from '../tc/ohlcv';

export
class KLineWatcher {
  public async Start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit = 2,
    interval = 1000,
  ) {
    try {
      const kline = ArrayToKLine(await exchange.fetchOHLCV(symbol, timeframe, undefined, limit));
      console.log(kline);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.Start(exchange, symbol, timeframe, limit, interval);
      }, interval);
    }
  }
}
