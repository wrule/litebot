
export
interface Domain {
  [param_name: string]: [number, number];
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
