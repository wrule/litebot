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
  target: (param: Params) => number;
  param_mapper?: (value: Value) => Params;
  param_filter?: (param: Params) => boolean;
  sample?: (param: Params, result: number) => void;
}

export
class Random<Params> {
  public Search(options: Option<Params>) {
    while (true) {
      const value = RandomSelect(options.domain);
      const params = options.param_mapper ? options.param_mapper(value) : value as Params;
      if (options.param_filter && !options.param_filter(params)) continue;
      const result = options.target(params);
      options.sample && options.sample(params, result);
    }
  }
}
