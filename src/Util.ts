import { FakeArrayConstructor, FakeString } from './FakeThings';

// BREAK: new Object(),
// kebab: (string: string): string => {
//   return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
// },

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelize(string: string): string {
  return string.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter: string, index: number) => {
    if (index === 0) { return letter.toLowerCase(); } else { return letter.toUpperCase(); }
  }).replace(/\s+/g, '');
}

// arrayDiff: (array1: any[], array2: any[]): any[] => {
//   return array1.filter(i => array2.indexOf(i) < 0);
// },

export function removeFromArray(array: any[], element: any): boolean {
  const i = array.indexOf(element);
  if (i === -1) {
    return false;
  } else {
    array.splice(i, i + 1);
    return true;
  }
}

// copy: (obj: Object) => {
//   if (typeof obj !== 'object') {
//     return obj;
//   }
//   let copy = obj.constructor();
//   for (let attr in obj) {
//     if (obj.hasOwnProperty(attr)) {
//       copy[attr] = obj[attr];
//     }
//   }
//   return copy;
// },
// merge: (obj1: Object, obj2: Object): Object => {
//   for (let attr in obj2) {
//     obj1[attr] = obj2[attr];
//   }
//   return obj1;
// },

export function isInteger(value: any): value is number {
  return value === parseInt(value, 10);
}

export function isNumber(value: any): value is number {
  return isFinite(value) && !isNaN(parseFloat(value));
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isRegExp(value: any): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}

export function forEach(o: object, fn: (v: any, k: string) => void): void {
  for (const k in o) {
    if (!o.hasOwnProperty(k)) continue;
    const v = o[k];
    fn(v, k);
    // if (f(v, k) === Util.BREAK) {
    //   break;
    // }
  }
}

// reverseForEach: (obj: Object, f: (k: string, v: any) => void): void => {
//   let arr: string[] = [];
//   let _break = false;
//   for (let key in obj) {
//     // add hasOwnPropertyCheck if needed
//     arr.push(key);
//   }
//   let i = arr.length - 1;
//   while ((i >= 0) && !_break) {
//     let v = f.call(obj, arr[i], obj[arr[i]]);
//     if (v === Util.BREAK) { _break = true; }
//     i--;
//   }
// },

export function endsWith(string: string, search: string): boolean {
  if ((string as any as FakeString).endsWith) {
    return (string as any as FakeString).endsWith(search);
  } else {
    return string.substr(-search.length) === search;
  }
}

export function startsWith(string: string, search: string): boolean {
  if ((string as any as FakeString).startsWith) {
    return (string as any as FakeString).startsWith(search);
  } else {
    return string.substr(0, search.length) === search;
  }
}

export function arrayFromHTML(nodeList: NodeListOf<HTMLElement>): HTMLElement[] {
  if ((Array as any as FakeArrayConstructor).from) {
    return (Array as any as FakeArrayConstructor).from(nodeList);
  } else {
    return [].slice.call(nodeList);
  }
}

export function values(obj: object): any[] {
  const vals: any[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
      vals.push(obj[key]);
    }
  }
  return vals;
}

export function includes(a: any[], b: any): boolean {
  return a.indexOf(b) > -1;
}

export function equalsJSON(a: any, b: any): boolean {
  for (const k in a) {
    const v1 = a[k];
    const v2 = b[k];
    if (typeof v1 === 'object') {
      if (!equalsJSON(v1, v2)) {
        return false;
      }
    } else {
      if (v1 !== v2) {
        return false;
      }
    }
  }
  return true;
}

export function copyJSON(o: any): any {
  return JSON.parse(JSON.stringify(o));
}
