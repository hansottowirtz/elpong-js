import { Util } from '../../Util';

export namespace Snapshots {
  export function getSortedArray(snapshots_list) {
    let arr = Util.values(snapshots_list);
    arr.sort((a, b) => a.time - b.time);
    return arr;
  }

  export function removeAfter(time, snapshots_list) {
    let arr = getSortedArray(snapshots_list);
    let snapshots_list_2 = {};
    for (let v of arr) {
      if (v.time <= time) { snapshots_list_2[v.time] = v; }
    }
    return snapshots_list_2;
  }
}

// import Element from '../../Element';
//
// const setupSnapshots = (element: Element) => {
//   element.snapshots = {
//     getLastPersisted() {
//       if (element.isNew()) { return null; }
//       let last_persisted_snapshot = null;
//       Util.reverseForIn(hpe.snapshots.list, function(k, v) {
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
//         HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
//           if (tag.test(v.tag)) {
//             last_snapshot_with_tag = v;
//             return HP.Util.BREAK;
//           }
//         });
//       } else {
//         HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
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
//       HP.Util.reverseForIn(hpe.snapshots.list, function(k, v) {
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
