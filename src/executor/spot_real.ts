// 2022年12月09日12:11:20
import ccxt from 'ccxt';
import moment from 'moment';
import { Exchange, Order } from 'ccxt';
import { Notifier } from '../notifier';

export
class SpotReal {
  public constructor(private readonly config: {
    name: string,
    exchange: Exchange,
    symbol: string,
    funds: number,
    assets?: number,
    final_price?: number,
    last_action?: string,
    init_valuation?: number,
    notifier?: Notifier,
  }) {
    this.funds = this.config.funds;
    this.assets = this.config.assets || 0;
    this.funds_name = this.config.symbol.split('/')[1];
    this.assets_name = this.config.symbol.split('/')[0];
    this.final_price = this.config.final_price || NaN;
    this.last_action = this.config.last_action || '';
    if (this.config.init_valuation) this.init_valuation = this.config.init_valuation;
    else (async () => {
      const ticker = await this.config.exchange.fetchTicker(this.config.symbol);
      this.init_valuation = this.Valuation(ticker.bid);
    })();
  }

  private funds = 0;
  private assets = 0;
  private funds_name = '';
  private assets_name = '';
  private final_price = NaN;
  private last_action = '';
  private init_valuation = NaN;

  public get Funds() {
    return this.funds;
  }

  public set Funds(value: number) {
    this.funds = value;
  }

  private build_transaction_message(order: Order, price: number, in_out: [number, number], order_time: string, yield_rate = '') {
    const message = {
      name: this.config.name,
      time: moment(order.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      symbol: order.symbol, side: order.side,
      in_amount: in_out[0], out_amount: in_out[1],
      expected_price: price, final_price: order.price,
      deviation: `${(order.price - price) / price * 100 * (order.side === 'buy' ? -1 : 1)}%`,
      funds: this.funds, assets: this.assets,
      valuation: this.Valuation(order.price), roi: `${this.ROI(order.price) * 100}%`,
      yield_rate, order_time,
    };
    console.log(message);
    return JSON.stringify(message, null, 2);
  }

  private build_error_message(error: any, side?: string) {
    const message = {
      name: this.config.name,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      symbol: this.config.symbol, side,
      message: error?.toString() || 'an error occurred, please check the log',
    };
    console.log(message);
    return JSON.stringify(message, null, 2);
  }

  private send_message(message: string) {
    this.config.notifier?.SendMessage(message);
  }

  private async get_balance(currency: string) {
    return (await this.config.exchange.fetchFreeBalance())[currency];
  }

  public async BuyAll(price: number, sync = false) {
    if (this.last_action === 'buy') return;
    try {
      const request_time = Number(new Date());
      const real_funds = sync ? await this.get_balance(this.funds_name) : this.funds;
      this.funds = this.funds > real_funds ? real_funds : this.funds;
      let order = await this.config.exchange.createMarketBuyOrder(
        this.config.symbol,
        this.config.exchange.costToPrecision(this.config.symbol, this.funds),
        {
          quoteOrderQty: this.config.exchange.id === 'binance' ?
            this.config.exchange.costToPrecision(this.config.symbol, this.funds) : undefined,
          tgtCcy: this.config.exchange.id === 'okx' ?
            'quote_ccy' : undefined,
        } as any,
      );
      const order_time = `${(Number(new Date()) - request_time) / 1000}s`;
      try {
        this.config.exchange.id === 'okx' &&
          (order = await this.config.exchange.fetchOrder(order.id, order.symbol));
      } catch (e) {
        console.log(e);
      }
      const in_amount = order.cost;
      const out_amount = order.amount - (this.config.symbol.startsWith(order.fee?.currency) ? order.fee.cost : 0);
      this.funds -= in_amount;
      this.assets += out_amount;
      this.final_price = order.price;
      this.last_action = 'buy';
      this.send_message(this.build_transaction_message(order, price, [in_amount, out_amount], order_time));
    } catch (e) {
      if (!sync && e instanceof ccxt.ExchangeError) this.BuyAll(price, true);
      console.log(e);
      this.send_message(this.build_error_message(e, 'buy'));
    }
  }

  public async SellAll(price: number, sync = false) {
    if (this.last_action === 'sell') return;
    const final_price = this.final_price;
    this.final_price = NaN;
    try {
      const request_time = Number(new Date());
      const real_assets = sync ? await this.get_balance(this.assets_name) : this.assets;
      this.assets = this.assets > real_assets ? real_assets : this.assets;
      let order = await this.config.exchange.createMarketSellOrder(
        this.config.symbol,
        this.config.exchange.amountToPrecision(this.config.symbol, this.assets),
      );
      const order_time = `${(Number(new Date()) - request_time) / 1000}s`;
      try {
        this.config.exchange.id === 'okx' &&
          (order = await this.config.exchange.fetchOrder(order.id, order.symbol));
      } catch (e) {
        console.log(e);
      }
      const yield_rate = `${(order.price - final_price) / final_price * 100}%`;
      const in_amount = order.amount;
      const out_amount = order.cost - (this.config.symbol.endsWith(order.fee?.currency) ? order.fee.cost : 0);
      this.assets -= in_amount;
      this.funds += out_amount;
      this.last_action = 'sell';
      this.send_message(this.build_transaction_message(order, price, [in_amount, out_amount], order_time, yield_rate));
    } catch (e) {
      this.final_price = final_price;
      if (!sync && e instanceof ccxt.ExchangeError) this.SellAll(price, true);
      console.log(e);
      this.send_message(this.build_error_message(e, 'sell'));
    }
  }

  public Offset(offset: number) {
    return this.final_price * (1 + offset);
  }

  public Valuation(price: number) {
    return this.funds + this.assets * price;
  }

  public ROI(price: number) {
    return (this.Valuation(price) - this.init_valuation) / this.init_valuation;
  }
}
