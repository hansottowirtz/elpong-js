import { Element } from '../../Element';
import { ElpongError, ElpongErrorType } from '../../Errors';
import { Snapshot } from '../../Snapshot';
import { equalsJSON, includes, isInteger, isRegExp } from '../../Util';

export function setup(element: Element) {
  const snapshots = element.snapshots;

  snapshots.list = [];

  snapshots.make = (tag?: string): Snapshot => {
    return new Snapshot(element, tag);
  };

  snapshots.lastPersisted = (): Snapshot | undefined => {
    if (element.isNew()) return;

    for (let i = snapshots.list.length - 1; i >= 0 ; i--) {
      const snapshot = snapshots.list[i];
      if (includes(['after_post', 'after_put', 'after_get', 'creation'], snapshot.tag)) {
        return snapshot;
      }
    }

    return;

    // Util.reverseForEach(element.snapshots.list, function(k: string, v: Snapshot) {
    //   if ((v.tag === 'after_post') || (v.tag === 'after_put') || (v.tag === 'after_get') || (v.tag === 'creation')) {
    //     last_persisted_snapshot = v;
    //     return Util.BREAK;
    //   }
    // });

    // return last_persisted_snapshot;
  };

  snapshots.lastWithTag = (tag: string | RegExp): Snapshot | undefined => {
    const list = element.snapshots.list;
    if (isRegExp(tag)) {
      for (let i = list.length - 1; i >= 0 ; i--) {
        const snapshot = list[i];
        if (snapshot.tag) {
          if (tag.test(snapshot.tag)) {
            return snapshot;
          }
        }
      }
    } else {
      for (let i = list.length - 1; i >= 0 ; i--) {
        const snapshot = list[i];
        if (tag === snapshot.tag) {
          return snapshot;
        }
      }
    }
    return;
  };

  snapshots.last = (): Snapshot => {
    const list = element.snapshots.list;
    return list[list.length - 1];
  };

  snapshots.undo = (id?: number | string | RegExp): Element => {
    if (id == null) { id = 0; }
    if (isInteger(id)) {
      const list = element.snapshots.list;
      if (id < 0 || id > list.length) {
        throw new ElpongError(ElpongErrorType.ELESTI, `${id}`);
      } else {
        const snapshot = list[element.snapshots.currentIndex - id];
        snapshot.revert();
      }
    } else {
      const snapshot = snapshots.lastWithTag(id);
      if (snapshot) {
        snapshot.revert();
      } else {
        throw new ElpongError(ElpongErrorType.ELESNF, `${id}`);
      }
    }
    return element;
  };

  snapshots.isPersisted = () => {
    const snapshot = snapshots.lastPersisted();
    if (!snapshot) { return false; }
    return equalsJSON(element.fields, snapshot.data);
  };
}

// import Element from '../../Element';
//
// const setupSnapshots = (element: Element) => {
//   element.snapshots = {
//     getLastPersisted() {
//       if (element.isNew()) { return null; }
//       let last_persisted_snapshot = null;
//       Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//         if ((v.tag === 'after_post') || (v.tag === 'after_put') || (v.tag === 'after_get') || (v.tag === 'creation')) {
//           last_persisted_snapshot = v;
//           return Util.BREAK;
//         }
//       });
//
//       return last_persisted_snapshot;
//     },
//
//     getLastWithTag(tag) {
//       let last_snapshot_with_tag = null;
//       if (HP.Util.isRegex(tag)) {
//         HP.Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//           if (tag.test(v.tag)) {
//             last_snapshot_with_tag = v;
//             return HP.Util.BREAK;
//           }
//         });
//       } else {
//         HP.Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//           if (v.tag === tag) {
//             last_snapshot_with_tag = v;
//             return HP.Util.BREAK;
//           }
//         });
//       }
//       return last_snapshot_with_tag;
//     },
//
//     getLast() {
//       let last_snapshot = null;
//       HP.Util.reverseForEach(hpe.snapshots.list, function(k, v) {
//         last_snapshot = v;
//         return HP.Util.BREAK;
//       });
//       return last_snapshot;
//     },
//
//     make(tag) {
//       let date = Date.now();
//       let list = hpe.snapshots.list =
//         HPP.Helpers.Snapshot.removeAfter(hpe.last_snapshot_time, hpe.snapshots.list);
//       if (list[date]) {
//         return hpe.snapshots.make(tag); // loop until 1ms has passed
//       }
//       let s = list[date] = {
//         tag,
//         time: date,
//         data: HPP.Helpers.Element.getFields(hpe),
//         revert() {
//           return hpe.undo(date);
//         }
//       };
//       hpe.last_snapshot_time = date;
//       return s;
//     },
//
//     list: {}
//   };
// }
