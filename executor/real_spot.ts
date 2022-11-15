import { Exchange } from 'ccxt';
import { Notifier } from '../notifier';

export
class RealSpot {
  public constructor(private readonly config: {
    exchange: Exchange,
    symbol: string,
    init_funds: number,
    init_assets: number,
    notifier?: Notifier,
  }) {
    this.funds = this.config.init_funds;
    this.assets = this.config.init_assets;
  }

  private funds = 0;
  private assets = 0;

  public async BuyAll() {
    const order = await this.config.exchange.createMarketOrder(
      this.config.symbol,
      'buy',
      0,
      undefined,
      {
        quoteOrderQty: this.config.exchange.costToPrecision(this.config.symbol, this.funds),
      },
    );
  }

  public async SellAll() {
    const order = await this.config.exchange.createMarketOrder(
      this.config.symbol,
      'sell',
      this.config.exchange.amountToPrecision(this.config.symbol, this.assets),
    );
  }
}
