import tulind from 'tulind';

export
function sma(source: number[], period: number) {
  let result: number[] = [];
  tulind.indicators.sma.indicator([source], [period], (error: any, data: any) => {
    if (error) throw error;
    result = Array(tulind.indicators.sma.start([period])).fill(NaN).concat(data[0]);
  });
  result.splice(0, result.length - source.length);
  return result;
}

export
function rsi(source: number[], period: number) {
  let result: number[] = [];
  tulind.indicators.rsi.indicator([source], [period], (error: any, data: any) => {
    if (error) throw error;
    result = Array(tulind.indicators.rsi.start([period])).fill(NaN).concat(data[0]);
  });
  result.splice(0, result.length - source.length);
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
  });
  k.splice(0, k.length - high.length);
  d.splice(0, d.length - high.length);
  diff = k.map((item, index) => item - d[index]);
  return { k, d, diff };
}

export
function stoch_rsi(source: number[], options: {
  rsi_period: number,
  stoch_period: number,
  k_period: number,
  d_period: number,
}) {
  let rsi: number[] = [];
  tulind.indicators.rsi.indicator([source], [options.rsi_period], (error: any, data: any) => {
    if (error) throw error;
    rsi = data[0];
  });
  let k: number[] = [], d: number[] = [];
  tulind.indicators.stoch.indicator(
    [rsi, rsi, rsi],
    [options.stoch_period, options.k_period, options.d_period],
    (error: any, data: any) => {
      if (error) throw error;
      k = data[0];
      d = data[1];
    },
  );
  const fill_num = source.length - k.length;
  k = Array(fill_num).fill(NaN).concat(k),
  d = Array(fill_num).fill(NaN).concat(d),
  const diff = k.map((item, index) => item - d[index]);
  return { k, d, diff };
}

export
function stoch_rsi_start(options: {
  rsi_period: number,
  stoch_period: number,
  k_period: number,
  d_period: number,
}) {
  const rsi_start = tulind.indicators.rsi.start([options.rsi_period]);
  const stoch_start = tulind.indicators.stoch.start([options.stoch_period, options.k_period, options.d_period]);
  return rsi_start + stoch_start;
}
