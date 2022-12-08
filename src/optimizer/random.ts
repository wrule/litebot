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
class Random<Params> {
  public Search(option: Option<Params>) {
    let max = -Infinity;
    while (true) {
      const value = RandomSelect(option.domain);
      const params = option.mapper ? option.mapper(value) : value as Params;
      if (option.filter && !option.filter(params)) continue;
      const result = option.target(params);
      if (result > max) {
        max = result;
        console.log(max, params);
      }
    }
  }
}
