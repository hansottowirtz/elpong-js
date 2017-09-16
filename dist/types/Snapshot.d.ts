import { Element } from './Element';
export declare class Snapshot {
    tag?: string;
    time: number;
    data: Object;
    element: Element;
    undone: boolean;
    index: number;
    constructor(element: Element, tag?: string);
    revert(): void;
}
