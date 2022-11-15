import { Exchange } from 'ccxt';
import moment from 'moment';
import { Notifier } from '../notifier';

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

  public async BuyAll(price: number) {
    const request_time = Number(new Date());
    const order = await this.config.exchange.createMarketOrder(
      this.config.symbol,
      'buy',
      0,
      undefined,
      {
        quoteOrderQty: this.config.exchange.costToPrecision(this.config.symbol, this.funds),
      },
    );
    const response_time = Number(new Date());
    const in_amount = order.cost;
    const out_amount = order.amount - (this.config.symbol.startsWith(order.fee.currency) ? order.fee.cost : 0);
    this.funds -= in_amount;
    this.assets += out_amount;
    this.config.notifier?.SendMessage(JSON.stringify({
      time: moment(new Date(order.timestamp)).format('YYYY-MM-DD HH:mm:ss'),
      symbol: this.config.symbol, side: order.side,
      in_amount, out_amount,
      expected_price: price, final_price: order.price, deviation: `${(order.price - price) / price * 100}%`,
      order_time: `${(response_time - request_time) / 1000}s`,
      funds: this.funds, assets: this.assets,
    }, null ,2));
  }

  public async SellAll(price: number) {
    const order = await this.config.exchange.createMarketOrder(
      this.config.symbol,
      'sell',
      this.config.exchange.amountToPrecision(this.config.symbol, this.assets),
    );
    const in_amount = order.amount;
    const out_amount = order.cost - (this.config.symbol.endsWith(order.fee.currency) ? order.fee.cost : 0);
    this.assets -= in_amount;
    this.funds += out_amount;
  }
}
