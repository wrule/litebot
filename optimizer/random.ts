
export
interface Domain {
  [param_name: string]: [number, number];
}

export
interface Param {
  [param_name: string]: number;
}

export
function RandomSelect(domain: Domain) {
  const result: Param = { };
  Object.entries(domain).forEach(([key, value]) => {
    const min = Math.min(...value);
    const max = Math.max(...value);
    const diff = max - min;
    result[key] = Math.floor(min + diff * Math.random());
  });
  return result;
}

export
interface A {
  domain: Domain,
  domain_filter: number;
  domain_mapper: number;
  target: () => number;
  loss: () => number;
}

export
class Random {
  public Search() {

  }
}
