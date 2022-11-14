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
  params_mapper?: (value: Value) => Params;
  params_filter?: (params: Params) => boolean;
  sample?: (params: Params, result: number) => void;
}

export
class Random<Params> {
  public Search(options: Option<Params>) {
    while (true) {
      const value = RandomSelect(options.domain);
      const params = options.params_mapper ? options.params_mapper(value) : value as Params;
      if (options.params_filter && !options.params_filter(params)) continue;
      const result = options.target(params);
      options.sample && options.sample(params, result);
    }
  }
}
