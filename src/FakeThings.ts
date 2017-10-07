import { Util } from './Util';

declare const Map: any;

export type FakeMapKey = string|number;

export class FakeMap {
  hasRealMap: boolean;
  map: any;

  constructor() {
    this.hasRealMap = typeof Map !== 'undefined';
    this.map = this.hasRealMap ? new Map() : {};
  }

  get(k: FakeMapKey): any {
    return this.hasRealMap ? this.map.get(k) : this.map[k];
  }

  set(k: FakeMapKey, v: any): this {
    if (this.hasRealMap) { this.map.set(k, v) } else { this.map[k] = v };
    return this;
  }

  has(k: FakeMapKey): boolean {
    return this.hasRealMap ? this.map.has(k) : !!this.map[k];
  }

  values(): any[] {
    // if Map is there, Array.from should also be there
    return this.hasRealMap ? (Array as any as FakeArrayConstructor).from(this.map.values()) : Util.values(this.map);
  }

  delete(k: FakeMapKey): void {
    if (this.hasRealMap) { this.map.delete(k) } else { delete this.map[k]; }
  }
}

export interface FakeString {
  startsWith(searchString: string, position?: number): boolean;
  endsWith(searchString: string, endPosition?: number): boolean;
}

export interface FakeArrayConstructor {
  from<T>(arrayLike: ArrayLike<T>): Array<T>;
}
