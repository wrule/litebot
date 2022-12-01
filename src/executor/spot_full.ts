export
interface SpotFull {
  Risk(price: number): number;
  BuyAll(price: number): void;
  SellAll(price: number): void;
}
