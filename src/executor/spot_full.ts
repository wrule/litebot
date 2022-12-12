// 2022年12月09日00:21:56
export
interface SpotFull {
  BuyAll(price: number): void;
  SellAll(price: number): void;
  Offset(offset: number): number;
  Valuation(price: number): number;
  ROI(price: number): number;
}
