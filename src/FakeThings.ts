import { Util } from './Util';

declare const Map: any;

export type FakeMapKey = string|number;

const supportsMap = typeof Map !== 'undefined' && (new Map()).values;

export class FakeMap {
  readonly hasRealMap: boolean;
  readonly map: any;

  constructor() {
    // in IE 11, Map#values doesn't exist. Don't bother about that.
    this.hasRealMap = supportsMap;
    this.map = supportsMap ? new Map() : {};
  }

  get(k: FakeMapKey): any {
    return supportsMap ? this.map.get(k) : this.map[k];
  }

  set(k: FakeMapKey, v: any): this {
    if (supportsMap) { this.map.set(k, v) } else { this.map[k] = v };
    return this;
  }

  has(k: FakeMapKey): boolean {
    return supportsMap ? this.map.has(k) : !!this.map[k];
  }

  values(): any[] {
    // if Map is there, Array.from should also be there
    return supportsMap ? (Array as any as FakeArrayConstructor).from(this.map.values()) : Util.values(this.map);
  }

  delete(k: FakeMapKey): void {
    if (supportsMap) { this.map.delete(k) } else { delete this.map[k]; }
  }
}

export interface FakeString {
  startsWith(searchString: string, position?: number): boolean;
  endsWith(searchString: string, endPosition?: number): boolean;
}

export interface FakeArrayConstructor {
  from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
