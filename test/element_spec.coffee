describe 'Element', ->
  describe 'stupid farm', ->
    beforeEach ->
      @pre_scheme = window.__json__["test/fixtures/stupid-farm/scheme"]
      @scheme = window.HTTPong.addScheme(@pre_scheme)

    it 'should have the right fields', ->
      collection = @scheme.select('geese')
      bob = collection.makeNewElement()
      jef = collection.makeNewElement(name: 'Jef')
      expect(bob.fields.name).toBe('Bob')
      expect(jef.fields.name).toBe('Jef')

    it 'should have the right relations', ->
      dogs = @scheme.select('dogs')
      bosses = @scheme.select('bosses')

      boss = bosses.makeNewElement({id: 1})
      dog = dogs.makeNewElement({id: 1, boss_id: 1})

      expect(dog.relations.getBoss()).toBe(boss)
      bosses_dogs = boss.relations.getDogs()
      first_dog = bosses_dogs[0]
      expect(first_dog).toBe(dog)

    it 'should have working embedded elements', ->
      apples = @scheme.select('apples')
      apple = new HTTPong.Element apples, {id: 5, kind: 'Granny Smith', stem: {id: 3, color: 'brown'}}
      window.apple = apple
      expect(apple.relations.getStem().getField('id')).toBe(3)

  describe 'pulser', ->
    beforeEach ->
      @pre_scheme = window.__json__["test/fixtures/pulser/scheme"]
      @scheme = window.HTTPong.addScheme(@pre_scheme)

    it 'should have working polymorphic associations', ->
      plugs = @scheme.select('plugs')
      devices = @scheme.select('devices')
      controls = @scheme.select('controls')

      control = controls.makeNewElement {id: 2}
      device = devices.makeNewElement {id: 5}
      plug = plugs.makeNewElement {id: 8, block_collection: 'devices', block_id: 5}

      expect(plug.relations.getBlock()).toBe(device)
      device_plugs = device.relations.getPlugs()
      expect(device_plugs[0]).toBe(plug)

    it 'should have working embedded collections', ->
      plugs = @scheme.select('plugs')
      devices = @scheme.select('devices')
      controls = @scheme.select('controls')

      device = devices.makeNewElement {id: 5, plugs: [{id: 14, block_collection: 'devices', block_id: 5}, {id: 15, block_collection: 'devices', block_id: 5}]}
      plug = plugs.makeNewElement {id: 16, block_collection: 'devices', block_id: 5}
      plug = plugs.makeNewElement {id: 17, block_collection: 'controls', block_id: 5}

      device_plugs = device.relations.getPlugs()
      expect(device_plugs[0].getField('id')).toBe(14)
      expect(device_plugs[1].getField('id')).toBe(15)
      expect(device_plugs[2].getField('id')).toBe(16)
      expect(device_plugs[3]).not.toBeDefined()

  describe 'clothes', ->
    beforeEach ->
      @pre_scheme = window.__json__["test/fixtures/clothes/scheme"]
      @scheme = window.HTTPong.addScheme(@pre_scheme)

    it 'should work', ->
      workers = @scheme.select('workers')
      tshirts = @scheme.select('tshirts')
      brands = @scheme.select('brands')

      worker = workers.makeNewElement {id: 3, name: 'Otto'}
      brand = brands.makeNewElement {id: 5, name: 'Triplex'}
      tshirt = tshirts.makeNewElement {id: 8, color: 'blue', person_id: 3, brand_id: 5}

      # expect(tshirt.relations.getCreator()).toBe(worker)
      # expect(tshirt.relations.getBrand()).toBe(brand)
      shirts = worker.relations.getCreatedTshirts()
      expect(shirts[0]).toBe(tshirt)
      # expect(brand.relations.getTshirts()[0]).toBe(tshirt)

    it 'should have working mergeWith', ->
      workers = @scheme.select('workers')
      worker = workers.makeNewElement {id: 3, name: 'Otto'}
      worker.mergeWith {name: 'Hans'}
      expect(worker.getField('name')).toBe('Hans')

    it 'should throw on a changed selector value', ->
      workers = @scheme.select('workers')
      worker = workers.makeNewElement {id: 3, name: 'Otto'}
      expect(-> worker.mergeWith {id: 2, name: 'Hans'} ).toThrow()

    it 'should be finding the right elements', ->
      tshirts = @scheme.select('tshirts')

      tshirt1 = tshirts.makeNewElement {id: 8, color: 'blue', person_id: 3, brand_id: 5}
      tshirt2 = tshirts.makeNewElement {id: 9, color: 'red', person_id: 2, brand_id: 5}
      tshirt3 = tshirts.makeNewElement {id: 10, color: 'green', person_id: 4, brand_id: 6}

      expect(tshirts.find(8)).toBe(tshirt1)
      expect(tshirts.find(9)).toBe(tshirt2)
      expect(tshirts.find(10)).toBe(tshirt3)

      expect(tshirts.findBy('id', 9)).toBe(tshirt2)
      expect(tshirts.findBy(id: 9)).toBe(tshirt2)

      expect(tshirts.findBy(id: 9, color: 'green')).toBe(undefined)
      expect(tshirts.findBy(id: 9, color: 'red')).toBe(tshirt2)
      expect(tshirts.findBy(id: 9, color: 'red', person_id: 3)).toBe(undefined)
      expect(tshirts.findBy(id: 9, color: 'red', person_id: 2, brand_id: 5)).toBe(tshirt2)

      expect(tshirts.findBy(id: 10, color: 'blue')).toBe(undefined)
      expect(tshirts.findBy(id: 10, color: 'green')).toBe(tshirt3)
      expect(tshirts.findBy(id: 10, color: 'green', person_id: 2)).toBe(undefined)
      expect(tshirts.findBy(id: 10, color: 'green', person_id: 4, brand_id: 6)).toBe(tshirt3)

      expect(tshirts.findBy('brand_id', 5, {multiple: true}).includes(tshirt1)).toBe(true)
      expect(tshirts.findBy('brand_id', 5, {multiple: true}).includes(tshirt2)).toBe(true)
      expect(tshirts.findBy({brand_id: 5}, {multiple: true}).includes(tshirt1)).toBe(true)
      expect(tshirts.findBy({brand_id: 5}, {multiple: true}).includes(tshirt2)).toBe(true)

    describe 'diff', ->
      beforeEach ->
        workers = @scheme.select('workers')
        @worker = workers.makeNewElement {id: 3, name: 'Otto'}

      it 'should have working undo to creation', ->
        @worker.setField('name', 'Hans')
        @worker.undo('creation')
        expect(@worker.getField('name')).toBe('Otto')

      it 'should be able to undo 1 step', ->
        @worker.setField('name', 'Hans')
        @worker.undo()
        expect(@worker.getField('name')).toBe('Otto')

      it 'should be able to undo multiple steps', ->
        @worker.setField('name', 'Hans')
        @worker.snapshots.make()
        @worker.setField('name', 'Wirtz')
        @worker.undo(0) # to Hans
        @worker.undo(1) # to Otto
        expect(@worker.getField('name')).toBe('Otto')

      it 'should be able to undo to a tag', ->
        @worker.setField('name', 'Hans')
        @worker.snapshots.make()
        @worker.setField('name', 'Wirtz')
        @worker.snapshots.make('lol')
        @worker.setField('name', 'Ploep')
        @worker.snapshots.make('alo')
        @worker.undo('lol')
        expect(@worker.getField('name')).toBe('Wirtz')

      it 'should be persisted', ->
        expect(@worker.isPersisted()).toBe(true)
        @worker.setField('name', 'Hans')
        expect(@worker.isPersisted()).toBe(false)
        @worker.snapshots.make('after_put')
        expect(@worker.isPersisted()).toBe(true)

    describe 'http', ->
      httpBackend = null

      beforeEach ->
        httpBackend = new HttpBackend()

        @scheme.setApiUrl('/api/v1')

        @workers = @scheme.select('workers')

      it 'should be able to get multiple instances', (done) ->
        httpBackend.reply 'GET', '/api/v1/workers', [{id: 8, name: 'Bob'}]

        @workers.actions.doGetAll().then (response) =>
          expect(response.status).toEqual(200)
          expect(response.data).toEqual([{id: 8, name: 'Bob'}])
          w = @workers.getArray()[0]
          expect(@workers.getArray()[0].getField('id')).toBe(8)
          httpBackend.done(done)
        httpBackend.flush()

      it 'should be able to get and update accordingly', (done) ->
        httpBackend.reply 'GET', '/api/v1/workers', [{id: 8, name: 'Bob'}, {id: 9, name: 'Jef'}]
        httpBackend.reply 'GET', '/api/v1/workers/8', {id: 8, name: 'Bart'}

        @workers.actions.doGetAll().then (response) =>
          worker = @workers.find(8)
          expect(worker.getField('name')).toBe('Bob')
          worker.actions.doGet().then (response) ->
            expect(worker.getField('name')).toBe('Bart')
            httpBackend.done(done)
        httpBackend.flush()

      it 'should be correctly removed', (done) ->
        httpBackend.reply 'GET', '/api/v1/workers/8', {id: 8, name: 'Bob'}
        httpBackend.reply 'DELETE', '/api/v1/workers/8', undefined, 204

        @workers.actions.doGetOne(8).then (response) =>
          worker = @workers.find(8)
          worker.remove().then =>
            expect(@workers.find(8)).not.toBeDefined()
            httpBackend.done(done)
        httpBackend.flush()

      it 'should be correctly saved', (done) ->
        httpBackend.reply 'POST', '/api/v1/workers', {id: 8, name: 'Bob'}

        worker = @workers.makeNewElement({name: 'Bob'})
        expect(worker.isNew()).toBe(true)
        expect(worker.isPersisted()).toBe(false)

        worker.actions.doPost().then (response) =>
          console.log response
          expect(worker.isNew()).toBe(false)
          expect(worker.isPersisted()).toBe(true)
          httpBackend.done(done)

        httpBackend.flush()
