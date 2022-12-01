export
interface SpotFull {
  PositionPrice: number;
  BuyAll(price: number): void;
  SellAll(price: number): void;
}
