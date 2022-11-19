import tulind from 'tulind';

export
function sma(source: number[], period: number) {
  let result: number[] = [];
  tulind.indicators.sma.indicator([source], [period], (error: any, data: any) => {
    if (error) throw error;
    result = Array(tulind.indicators.sma.start([period])).fill(NaN).concat(data[0]);
  });
  return result;
}

export
function rsi(source: number[], period: number) {
  let result: number[] = [];
  tulind.indicators.rsi.indicator([source], [period], (error: any, data: any) => {
    if (error) throw error;
    result = Array(tulind.indicators.rsi.start([period])).fill(NaN).concat(data[0]);
  });
  return result;
}

export
function stoch(high: number[], low: number[], close: number[], options: {
  stoch_period: number,
  k_period: number,
  d_period: number,
}) {
  let k: number[] = [], d: number[] = [], diff: number[] = [];
  const options_array = [options.stoch_period, options.k_period, options.d_period];
  const start = tulind.indicators.stoch.start(options_array);
  tulind.indicators.stoch.indicator([high, low, close], options_array, (error: any, data: any) => {
    if (error) throw error;
    k = Array(start).fill(NaN).concat(data[0]);
    d = Array(start).fill(NaN).concat(data[1]);
    diff = k.map((item, index) => item - d[index]);
  });
  return { k, d, diff };
}
