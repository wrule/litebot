// 2022年12月09日00:17:26
export
class SpotSimpleTest {
  public constructor(
    private readonly init_funds = 100,
    private readonly fee = 0.001,
  ) {
    this.Reset();
  }

  private funds = 0;
  private assets = 0;

  public Reset() {
    this.funds = this.init_funds;
    this.assets = 0;
    this.final_price = NaN;
  }

  public BuyAll(price: number) {
    this.assets += (this.funds / price) * (1 - this.fee);
    this.funds = 0;
    this.final_price = this.final_price || price;
  }

  public SellAll(price: number) {
    this.funds += (this.assets * price) * (1 - this.fee);
    this.assets = 0;
    this.final_price = NaN;
  }

  public Valuation(price: number) {
    return this.funds + this.assets * price;
  }

  public ROI(price: number) {
    return (this.Valuation(price) - this.init_funds) / this.init_funds;
  }

  private final_price = NaN;

  public Offset(offset: number) {
    return this.final_price * (1 + offset);
  }
}
