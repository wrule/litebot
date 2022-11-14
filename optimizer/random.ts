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
  public Search(option: Option<Params>) {
    let count = 0;
    while (true) {
      if (count % 100 === 0) console.log(count);
      const value = RandomSelect(option.domain);
      const params = option.params_mapper ? option.params_mapper(value) : value as Params;
      if (option.params_filter && !option.params_filter(params)) continue;
      const result = option.target(params);
      option.sample && option.sample(params, result);
      count++;
    }
  }
}
