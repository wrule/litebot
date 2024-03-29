// 2022年12月08日23:27:14
import cluster from 'cluster';

export
interface Domain {
  [key: string]: [number, number];
}

export
interface Value {
  [key: string]: number;
}

export
function RandomSelect(domain: Domain) {
  const result: Value = { };
  Object.entries(domain).forEach(([key, value]) => {
    const min = Math.min(...value);
    const max = Math.max(...value);
    const diff = max - min + 1;
    result[key] = Math.floor(min + diff * Math.random());
  });
  return result;
}

export
interface Option<Params> {
  domain: Domain,
  target: (params: Params) => number;
  mapper?: (value: Value) => Params;
  filter?: (params: Params) => boolean;
}

export
function Loop(func: () => void) {
  func();
  setImmediate(() => Loop(func));
}

export
class Random<Params> {
  public Search(option: Option<Params>) {
    let max = -Infinity;

    const new_max = (value: number, params: Params) => {
      if (value > max) {
        max = value;
        if (cluster.isMaster) console.log(max, params);
        else process.send?.([max, params]);
      }
    }

    if (cluster.isMaster) {
      console.log('main process:', process.pid);
      const last_argv = process.argv[process.argv.length - 1];
      const parallel_number = /^\d+$/.test(last_argv) ? Number(last_argv) - 1 : 0;
      const workers = Array(parallel_number).fill(0).map(() => cluster.fork());
      workers.forEach(
        (worker) => worker.on('message', (data: [number, Params]) => new_max(...data))
      );
    } else console.log('sub process:', process.pid);

    const backtesting = () => {
      const value = RandomSelect(option.domain);
      const params = option.mapper ? option.mapper(value) : value as Params;
      if (option.filter && !option.filter(params)) return;
      const result = option.target(params);
      new_max(result, params);
    };

    if (cluster.isMaster) Loop(() => backtesting());
    else while (true) backtesting();
  }
}
