export
interface SpotFull {
  BuyAll(price: number): void;
  SellAll(price: number): void;
  Offset(offset: number): number;
}
