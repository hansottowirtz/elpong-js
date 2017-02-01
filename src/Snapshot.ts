import { Element } from './Element';
import { ElementHelper } from './Helpers/ElementHelper';

export class Snapshot {
  public tag?: string;
  public time: number;
  public data: Object;
  public element: Element;
  public undone: boolean;
  public index: number;

  constructor(element: Element, tag?: string) {
    this.element = element;
    this.tag = tag;
    this.data = ElementHelper.toData(element, true);
    this.undone = false;
    this.time = Date.now();
    this.index = element.snapshots.list.length;
    element.snapshots.list.push(this);
    element.snapshots.current_index = this.index;
  }

  revert() {
    let list = this.element.snapshots.list;
    this.element.merge(this.data);
    this.element.snapshots.current_index = this.index;
    this.undone = false;
    for (let i = this.index + 1, l = list.length; i < l; i++) {
      list[i].undone = true;
    }
  }
}
