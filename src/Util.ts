import { FutureString, FutureArrayConstructor } from './Interfaces'

export const Util = {
  // BREAK: new Object(),
  // kebab: (string: string): string => {
  //   return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
  // },
  capitalize: (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  camelize: (string: string): string => {
    return string.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter: string, index: number) {
      if (index === 0) { return letter.toLowerCase(); } else { return letter.toUpperCase(); }
    }).replace(/\s+/g, '');
  },
  // arrayDiff: (array1: any[], array2: any[]): any[] => {
  //   return array1.filter(i => array2.indexOf(i) < 0);
  // },
  removeFromArray: (array: any[], element: any): boolean => {
    let i = array.indexOf(element);
    if (i === -1) {
      return false;
    } else {
      array.splice(i, i + 1);
      return true;
    }
  },
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
  isInteger: (value: any): value is number => {
    return value === parseInt(value, 10);
  },
  isNumber: (value: any): value is number => {
    return isFinite(value) && !isNaN(parseFloat(value));
  },
  isString: (value: any): value is string => {
    return typeof value === 'string';
  },
  isRegExp: (value: any): value is RegExp => {
    return Object.prototype.toString.call(value) == '[object RegExp]';
  },
  forEach: (o: Object, fn: (v: any, k: string) => void): void => {
    for (let k in o) {
      if (!o.hasOwnProperty(k)) { continue; }
      let v = o[k];
      fn(v, k)
      // if (f(v, k) === Util.BREAK) {
      //   break;
      // }
    }
  },
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
  endsWith: (string: string, search: string): boolean => {
    if ((string as any as FutureString).endsWith) {
      return (string as any as FutureString).endsWith(search);
    } else {
      return string.substr(-search.length) === search;
    }
  },
  startsWith: (string: string, search: string): boolean => {
    if ((string as any as FutureString).startsWith) {
      return (string as any as FutureString).startsWith(search);
    } else {
      return string.substr(0, search.length) === search;
    }
  },
  arrayFromHTML: (node_list: NodeListOf<HTMLElement>): Array<HTMLElement> => {
    if ((Array as any as FutureArrayConstructor).from) {
      return (Array as any as FutureArrayConstructor).from(node_list);
    }
    else {
      return [].slice.call(node_list);
    }
  },
  values: (obj: Object): any[] => {
    let vals: any[] = [];
		for (let key in obj) {
			if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
				vals.push(obj[key]);
			}
		}
		return vals;
  },
  includes: (a: any[], b: any): boolean => {
	  return a.indexOf(b) > -1;
  },
  equalsJSON: (a: any, b: any): boolean => {
    for (let k in a) {
      let v1 = a[k];
      let v2 = b[k];
      if (typeof v1 === 'object') {
        if (!Util.equalsJSON(v1, v2)) {
          return false;
        }
      } else {
        if (v1 !== v2) {
          return false;
        }
      }
    }
    return true;
  },
  copyJSON: (o: any): any => {
    return JSON.parse(JSON.stringify(o));
  }
}
