HP.Helpers.Snapshot = {
  getSortedArray: (snapshots) ->
    arr = Object.values(snapshots)
    arr.sort (a, b) -> a.time - b.time
    arr

  removeAfter: (time, snapshots) ->
    arr = HP.Helpers.Snapshot.getSortedArray(snapshots)
    snapshots_2 = {}
    for v in arr
      snapshots_2[v.time] = v if v.time <= time
    snapshots_2
}
