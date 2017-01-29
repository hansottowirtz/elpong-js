module Elpong {
  export interface ApproximatedFutureString {
    startsWith(searchString: string, position?: number): boolean;
    endsWith(searchString: string, endPosition?: number): boolean;
  }

  export interface ApproximatedFutureArrayConstructor {
    from<T>(arrayLike: ArrayLike<T>): Array<T>;
  }

  export const Util = {
    BREAK: new Object(),
    kebab: (string: string) => {
      return string.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/(é|ë)/g, 'e').split(' ').join('-');
    },
    unkebab: (string: string) => {
      return string.split('-').join(' ');
    },
    unsnake: (string: string) => {
      return string.split('_').join(' ');
    },
    capitalize: (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    camelize: (string: string) => {
      return string.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter: string, index: number) {
        if (index === 0) { return letter.toLowerCase(); } else { return letter.toUpperCase(); }
      }).replace(/\s+/g, '');
    },
    upperCamelize: (string: string) => {
      return string.replace(/_/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter: string, index: number) => letter.toUpperCase()).replace(/\s+/g, '');
    },
    arrayDiff: (array1: any[], array2: any[]) => {
      return array1.filter(i => array2.indexOf(i) < 0);
    },
    removeFromArray: (array: any[], element: any) => {
      let i = array.indexOf(element);
      if (i === -1) {
        return false;
      } else {
        array.splice(i, i + 1);
        return true;
      }
    },

    copy: (obj: Object) => {
      if (typeof obj !== 'object') {
        return obj;
      }
      let copy = obj.constructor();
      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }
      return copy;
    },

    merge: (obj1: Object, obj2: Object) => {
      for (let attr in obj2) {
        obj1[attr] = obj2[attr];
      }
      return obj1;
    },

    isInteger: (value: any) => {
      return value === parseInt(value, 10);
    },

    isNumber: (value: any) => {
      return isFinite(value) && !isNaN(parseFloat(value));
    },

    isString: (value: any) => {
      return typeof value === 'string';
    },

    isRegex: (value: any) => {
      return value instanceof RegExp;
    },

    forEach: (o: Object, f: Function) => {
      for (let k in o) {
        let v = o[k];
        if (!o.hasOwnProperty(k)) { continue; }
        if (f(v, k) === Util.BREAK) {
          break;
        }
      }
    },

    reverseForIn: (obj: Object, f: Function) => {
      let arr = [];
      let _break = false;
      for (let key in obj) {
        // add hasOwnPropertyCheck if needed
        arr.push(key);
      }
      let i = arr.length - 1;
      while ((i >= 0) && !_break) {
        let v = f.call(obj, arr[i], obj[arr[i]]);
        if (v === Util.BREAK) { _break = true; }
        i--;
      }
    },

    endsWith: (string: string, search: string) => {
      if ((string as any as ApproximatedFutureString).endsWith) {
        return (string as any as ApproximatedFutureString).endsWith(search);
      } else {
        return string.substr(-search.length) === search;
      }
    },

    startsWith: (string: string, search: string) => {
      if ((string as any as ApproximatedFutureString).startsWith) {
        return (string as any as ApproximatedFutureString).startsWith(search);
      } else {
        return string.substr(0, search.length) === search;
      }
    },

    arrayFromHTML: (node_list: NodeListOf<HTMLElement>): Array<HTMLElement> => {
      if ((Array as any as ApproximatedFutureArrayConstructor).from) {
        return (Array as any as ApproximatedFutureArrayConstructor).from(node_list);
      }
      else {
        return [].slice.call(node_list);
      }
    },

    values: (obj: Object): any[] => {
      let vals = [];
  		for (let key in obj) {
  			if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
  				vals.push(obj[key]);
  			}
  		}
  		return vals;
    },

    includes: (a: any[], b: any): boolean => {
  	  return a.indexOf(b) > -1;
    }
  }
}
