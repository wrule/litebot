import ccxt, { Exchange } from 'ccxt';

export
interface ExFactoryConfig
extends Exchange {
  exchange: string;
}

export
function ExFactory(config?: ExFactoryConfig) {
  return new (ccxt as any)[config?.exchange || 'binance'](config) as Exchange;
}
