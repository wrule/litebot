import { Exchange } from 'ccxt';
import { Notifier } from '../notifier';
import fs from 'fs';

export
class RealSpot {
  public constructor(private readonly config: {
    exchange: Exchange,
    symbol: string,
    init_funds: number,
    init_assets?: number,
    notifier?: Notifier,
  }) {
    this.funds = this.config.init_funds;
    this.assets = this.config.init_assets || 0;
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
    fs.writeFileSync('output.json', JSON.stringify(order, null, 2));
    const in_amount = order.cost;
    const out_amount = order.amount - (this.config.symbol.startsWith(order.fee.currency) ? order.fee.cost : 0);
    this.funds -= in_amount;
    this.assets += out_amount;
    return [in_amount, out_amount];
  }

  public async SellAll() {
    const order = await this.config.exchange.createMarketOrder(
      this.config.symbol,
      'sell',
      this.config.exchange.amountToPrecision(this.config.symbol, this.assets),
    );
    fs.writeFileSync('output.json', JSON.stringify(order, null, 2));
  }
}
