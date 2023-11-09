export class UrlStringFilter {
  stringFilter: string;
  arrayFilter: string[];
  index: number;
  valueAlreadyExist: boolean;
  value: string;

  constructor(stringFilter: string, value: string) {
    this.stringFilter = stringFilter;
    this.arrayFilter = this.stringFilter.split(",");
    this.index = this.arrayFilter.indexOf(value);
    this.valueAlreadyExist = this.index !== -1;
    this.value = value;
  }

  removeFromFilter() {
    this.arrayFilter.splice(this.index, 1);
    return this.asJoinToString();
  }

  addToFilter() {
    this.arrayFilter.push(this.value);
    return this.asJoinToString();
  }

  asJoinToString() {
    return this.arrayFilter.join(",").replace(/^,/, "");
  }
}

export function toggleValueFromFilter(stringFilters: string, value: string) {
  const filter = new UrlStringFilter(stringFilters, value);

  return filter.valueAlreadyExist
    ? filter.removeFromFilter()
    : filter.addToFilter();
}
