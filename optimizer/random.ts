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
    const diff = max - min;
    result[key] = Math.floor(min + diff * Math.random());
  });
  return result;
}

export
interface Option<Param> {
  domain: Domain,
  target: (param: Param) => number;
  param_mapper?: (value: Value) => Param;
  param_filter?: (param: Param) => boolean;
  sample?: (param: Param, result: number) => void;
}

export
class Random {
  public Search<Param>(options: Option<Param>) {
    while (true) {
      const value = RandomSelect(options.domain);
      const param = options.param_mapper ? options.param_mapper(value) : value as Param;
      if (options.param_filter && !options.param_filter(param)) continue;
      const result = options.target(param);
      options.sample && options.sample(param, result);
    }
  }
}
