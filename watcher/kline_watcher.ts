import { Exchange } from 'ccxt';

export
class KLineWatcher {
  private timer: any = null;

  public async Start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    interval: number,
  ) {
    try {
      const kline = await exchange.fetchOHLCV(symbol, timeframe, undefined, 2);
      console.log(kline);
    } catch (e) {
      console.log(e);
    } finally {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer && this.Start(exchange, symbol, timeframe, interval);
      }, interval);
    }
  }

  public Stop() {
    this.timer = null;
  }
}
