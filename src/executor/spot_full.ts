export
interface SpotFull {
  Risk(price: number): number;
  FinalPrice: number;
  BuyAll(price: number): void;
  SellAll(price: number): void;
}
