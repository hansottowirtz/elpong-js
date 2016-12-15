HPP.Helpers.Snapshot = {
  getSortedArray: (snapshots_list) ->
    arr = Object.values(snapshots_list)
    arr.sort (a, b) -> a.time - b.time
    arr

  removeAfter: (time, snapshots_list) ->
    arr = HPP.Helpers.Snapshot.getSortedArray(snapshots_list)
    snapshots_list_2 = {}
    for v in arr
      snapshots_list_2[v.time] = v if v.time <= time
    snapshots_list_2
}
