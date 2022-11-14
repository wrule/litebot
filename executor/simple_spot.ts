export
class SimpleSpot {
  public constructor(
    private readonly init_funds = 100,
    private readonly fee = 0.001,
  ) { }

  private funds = 0;
  private assets = 0;

  private get fee_multiplier() {
    return 1 - this.fee;
  }

  public Reset() {
    this.funds = this.init_funds;
    this.assets = 0;
  }

  public BuyAll(price: number) {
    this.assets += (this.funds / price) * this.fee_multiplier;
    this.funds = 0;
  }

  public SellAll(price: number) {
    this.funds += (this.assets * price) * this.fee_multiplier;
    this.assets = 0;
  }

  public Valuation(price: number) {
    return this.funds + this.assets * price;
  }

  public ROI(price: number) {
    return (this.Valuation(price) - this.init_funds) / this.init_funds;
  }
}
