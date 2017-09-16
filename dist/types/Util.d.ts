export declare const Util: {
    capitalize: (string: string) => string;
    camelize: (string: string) => string;
    removeFromArray: (array: any[], element: any) => boolean;
    isInteger: (value: any) => value is number;
    isNumber: (value: any) => value is number;
    isString: (value: any) => value is string;
    isRegExp: (value: any) => value is RegExp;
    forEach: (o: Object, fn: (v: any, k: string) => void) => void;
    endsWith: (string: string, search: string) => boolean;
    startsWith: (string: string, search: string) => boolean;
    arrayFromHTML: (node_list: NodeListOf<HTMLElement>) => HTMLElement[];
    values: (obj: Object) => any[];
    includes: (a: any[], b: any) => boolean;
    equalsJSON: (a: any, b: any) => boolean;
    copyJSON: (o: any) => any;
};
