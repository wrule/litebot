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
