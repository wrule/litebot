import { Exchange } from 'ccxt';

export
class KLineWatcher {
  private timer: any = null;
  private keep = false;

  public async Start(
    exchange: Exchange,
    symbol: string,
    timeframe: string,
    limit = 2,
    interval = 1000,
  ) {
    try {
      this.keep = true;
      const kline = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
      console.log(kline);
    } catch (e) {
      console.log(e);
    } finally {
      clearTimeout(this.timer);
      if (!this.keep) return;
      this.timer = setTimeout(() => {
        this.Start(exchange, symbol, timeframe, limit, interval);
      }, interval);
    }
  }

  public Stop() {
    this.keep = false;
  }
}
