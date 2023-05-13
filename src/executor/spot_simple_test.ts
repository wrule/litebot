// 2022年12月09日00:17:26
export
class SpotSimpleTest {
  public constructor(
    private readonly init_funds = 100,
    private readonly p_fee = 0.001,
  ) {
    this.fee = p_fee >= 0 ? p_fee : 0;
    this.ext_fee = p_fee >= 0 ? p_fee : -p_fee;
    this.Reset();
  }

  private funds = 0;
  private assets = 0;
  private fee = 0;
  private ext_fee = 0;
  private ext_fee_count = 0;
  private final_price = NaN;
  private transactions = 0;

  public get Transactions() {
    return this.transactions;
  }

  public Reset() {
    this.funds = this.init_funds;
    this.assets = 0;
    this.ext_fee_count = 0;
    this.final_price = NaN;
    this.transactions = 0;
  }

  public BuyAll(price: number) {
    this.assets += (this.funds / price) * (1 - this.fee);
    this.ext_fee_count += this.funds * this.ext_fee;
    this.funds = 0;
    this.final_price = this.final_price || price;
    this.transactions++;
  }

  public SellAll(price: number) {
    this.funds += (this.assets * price) * (1 - this.fee);
    this.ext_fee_count += (this.assets * price) * this.ext_fee;
    this.assets = 0;
    this.final_price = NaN;
    this.transactions++;
  }

  public Valuation(price: number) {
    return this.funds + this.assets * price;
  }

  public ROI(price: number) {
    return (this.Valuation(price) - this.init_funds) / this.init_funds;
  }

  public Offset(offset: number) {
    return this.final_price * (1 + offset);
  }

  public Risk(price: number) {
    return (price - this.final_price) / this.final_price;
  }

  public get ExtFeeCount() {
    return this.ext_fee_count;
  }

  public ValuationNet(price: number, return_rate = 0.35) {
    if (this.p_fee >= 0)
      return this.Valuation(price) + this.ExtFeeCount * return_rate;
    else
      return this.Valuation(price) - this.ExtFeeCount;
  }

  public ROINet(price: number, return_rate = 0.35) {
    if (this.p_fee >= 0)
      return (this.ValuationNet(price, return_rate) - this.init_funds) / this.init_funds;
    else
      return (this.ValuationNet(price) - this.init_funds) / this.init_funds;
  }
}
