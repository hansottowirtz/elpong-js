import { Element } from './Element';
import { toData } from './Helpers/ElementHelper';

export class Snapshot {
  tag?: string;
  time: number;
  data: object;
  element: Element;
  undone: boolean;
  index: number;

  constructor(element: Element, tag?: string) {
    this.element = element;
    this.tag = tag;
    this.data = toData(element, true);
    this.undone = false;
    this.time = Date.now();
    this.index = element.snapshots.list.length;
    element.snapshots.list.push(this);
    element.snapshots.currentIndex = this.index;
  }

  revert() {
    const list = this.element.snapshots.list;
    this.element.merge(this.data);
    this.element.snapshots.currentIndex = this.index;
    this.undone = false;
    for (let i = this.index + 1, l = list.length; i < l; i++) {
      list[i].undone = true;
    }
  }
}
