Element = require('../src/Element').Element
Elpong = require('../src/Elpong').Elpong
HttpBackend = require('./spec_helper').HttpBackend

describe 'Element', ->
  describe 'stupid farm', ->
    beforeEach ->
      @scheme = Elpong.add(require('./fixtures/stupid-farm/scheme.json5'))

    it 'should have the right fields', ->
      collection = @scheme.select('geese')
      bob = collection.build()
      jef = collection.build(name: 'Jef')
      expect(bob.fields.name).toBe('Bob')
      expect(jef.fields.name).toBe('Jef')

    it 'should have the right relations', ->
      dogs = @scheme.select('dogs')
      bosses = @scheme.select('bosses')

      boss = bosses.build({id: 1})
      dog = dogs.build({id: 1, boss_id: 1})

      expect(dog.relations.boss()).toBe(boss)

      bosses_dogs = boss.relations.dogs()
      first_dog = bosses_dogs[0]
      expect(first_dog).toBe(dog)

    it 'should have working embedded elements', ->
      apples = @scheme.select('apples')
      apple = new Element apples, {id: 5, kind: 'Granny Smith', stem: {id: 3, color: 'brown'}}
      expect(apple.relations.stem().fields.id).toBe(3)

  describe 'pulser', ->
    beforeEach ->
      @scheme = Elpong.add(require('./fixtures/pulser/scheme.json5'))

    it 'should have working polymorphic associations', ->
      plugs = @scheme.select('plugs')
      devices = @scheme.select('devices')
      controls = @scheme.select('controls')

      control = controls.build {id: 2}
      device = devices.build {id: 5}
      plug = plugs.build {id: 8, block_collection: 'devices', block_id: 5}

      expect(plug.relations.block()).toBe(device)
      device_plugs = device.relations.plugs()
      expect(device_plugs[0]).toBe(plug)

    it 'should have working embedded collections', ->
      plugs = @scheme.select('plugs')
      devices = @scheme.select('devices')
      controls = @scheme.select('controls')

      device = devices.build {id: 5, plugs: [{id: 14, block_collection: 'devices', block_id: 5}, {id: 15, block_collection: 'devices', block_id: 5}]}
      plug = plugs.build {id: 16, block_collection: 'devices', block_id: 5}
      plug = plugs.build {id: 17, block_collection: 'controls', block_id: 5}

      device_plugs = device.relations.plugs()
      expect(device_plugs[0].selector()).toBe(14)
      expect(device_plugs[1].selector()).toBe(15)
      expect(device_plugs[2].selector()).toBe(16)
      expect(device_plugs[3]).not.toBeDefined()

  describe 'clothes', ->
    beforeEach ->
      @scheme = Elpong.add(require('./fixtures/clothes/scheme.json5'))

    it 'should work', ->
      workers = @scheme.select('workers')
      tshirts = @scheme.select('tshirts')
      brands = @scheme.select('brands')

      worker = workers.build {id: 3, name: 'Otto'}
      brand = brands.build {id: 5, name: 'Appetite'}
      tshirt = tshirts.build {id: 8, color: 'blue', person_id: 3, brand_id: 5}

      # expect(tshirt.relations.getCreator()).toBe(worker)
      # expect(tshirt.relations.getBrand()).toBe(brand)
      shirts = worker.relations.createdTshirts()
      expect(shirts[0]).toBe(tshirt)
      # expect(brand.relations.getTshirts()[0]).toBe(tshirt)

    it 'should have working build', ->
      workers = @scheme.select('workers')
      worker = workers.build {id: 3, name: 'Otto'}
      worker.merge {name: 'Hans'}
      expect(worker.fields.name).toBe('Hans')

    it 'should throw on a changed selector value', ->
      workers = @scheme.select('workers')
      worker = workers.build {id: 3, name: 'Otto'}
      expect(-> worker.merge {id: 2, name: 'Hans'} ).toThrow()

    it 'should be finding the right elements', ->
      tshirts = @scheme.select('tshirts')

      tshirt1 = tshirts.build {id: 8, color: 'blue', person_id: 3, brand_id: 5}
      tshirt2 = tshirts.build {id: 9, color: 'red', person_id: 2, brand_id: 5}
      tshirt3 = tshirts.build {id: 10, color: 'green', person_id: 4, brand_id: 6}

      expect(tshirts.find(8)).toBe(tshirt1)
      expect(tshirts.find(9)).toBe(tshirt2)
      expect(tshirts.find(10)).toBe(tshirt3)

      expect(tshirts.findBy(id: 9)).toBe(tshirt2)

      expect(tshirts.findBy(id: 9, color: 'green')).toBe(null)
      expect(tshirts.findBy(id: 9, color: 'red')).toBe(tshirt2)
      expect(tshirts.findBy(id: 9, color: 'red', person_id: 3)).toBe(null)
      expect(tshirts.findBy(id: 9, color: 'red', person_id: 2, brand_id: 5)).toBe(tshirt2)

      expect(tshirts.findBy(id: 10, color: 'blue')).toBe(null)
      expect(tshirts.findBy(id: 10, color: 'green')).toBe(tshirt3)
      expect(tshirts.findBy(id: 10, color: 'green', person_id: 2)).toBe(null)
      expect(tshirts.findBy(id: 10, color: 'green', person_id: 4, brand_id: 6)).toBe(tshirt3)

      expect(tshirts.findBy({brand_id: 5}, {multiple: true})).toContain(tshirt1)
      expect(tshirts.findBy({brand_id: 5}, {multiple: true})).toContain(tshirt2)

    describe 'diff', ->
      beforeEach ->
        workers = @scheme.select('workers')
        @worker = workers.build {id: 3, name: 'Otto'}

      it 'should have working undo to creation', ->
        @worker.fields.name = 'Hans'
        @worker.snapshots.undo('creation')
        expect(@worker.fields.name).toBe('Otto')

      it 'should be able to undo 1 step', ->
        @worker.fields.name = 'Hans'
        @worker.snapshots.undo()
        expect(@worker.fields.name).toBe('Otto')

      it 'should be able to undo multiple steps', ->
        @worker.fields.name = 'Hans'
        @worker.snapshots.make()
        @worker.fields.name = 'Wirtz'
        @worker.snapshots.undo()
        @worker.snapshots.undo()
        @worker.snapshots.undo(0) # same as ()
        expect(@worker.fields.name).toBe('Hans')
        @worker.snapshots.undo(1)
        expect(@worker.fields.name).toBe('Otto')

      it 'should be able to undo to a tag', ->
        @worker.fields.name = 'Hans'
        @worker.snapshots.make()
        @worker.fields.name = 'Wirtz'
        @worker.snapshots.make('lol')
        @worker.fields.name = 'Ploep'
        @worker.snapshots.make('alo')
        @worker.snapshots.undo('lol')
        expect(@worker.fields.name).toBe('Wirtz')

      it 'should be persisted', ->
        expect(@worker.snapshots.isPersisted()).toBe(true)
        @worker.fields.name = 'Hans'
        expect(@worker.snapshots.isPersisted()).toBe(false)
        @worker.snapshots.make('after_put')
        expect(@worker.snapshots.isPersisted()).toBe(true)

    describe 'http', ->
      httpBackend = null

      beforeEach ->
        httpBackend = new HttpBackend()

        @scheme.setApiUrl('/api/v1')

        @workers = @scheme.select('workers')

      it 'should be able to get multiple instances', (done) ->
        httpBackend.reply 'GET', '/api/v1/workers', [{id: 8, name: 'Bob'}]

        @workers.actions.getAll().then (response) =>
          expect(response.status).toEqual(200)
          expect(response.data).toEqual([{id: 8, name: 'Bob'}])
          w = @workers.array()[0]
          expect(@workers.array()[0].fields.id).toBe(8)
          httpBackend.done(done)
        httpBackend.flush()

      it 'should be able to get and update accordingly', (done) ->
        httpBackend.reply 'GET', '/api/v1/workers', [{id: 8, name: 'Bob'}, {id: 9, name: 'Jef'}]
        httpBackend.reply 'GET', '/api/v1/workers/8', {id: 8, name: 'Bart'}

        @workers.actions.getAll().then (response) =>
          worker = @workers.find(8)
          expect(worker.fields.name).toBe('Bob')
          worker.actions.get().then (response) ->
            expect(worker.fields.name).toBe('Bart')
            httpBackend.done(done)
        httpBackend.flush()

      it 'should be correctly removed', (done) ->
        httpBackend.reply 'GET', '/api/v1/workers/8', {id: 8, name: 'Bob'}
        httpBackend.reply 'DELETE', '/api/v1/workers/8', undefined, 204

        @workers.actions.getOne(8).then (response) =>
          worker = @workers.find(8)
          worker.remove().then =>
            expect(@workers.find(8)).toBe(null)
            httpBackend.done(done)
        httpBackend.flush()

      it 'should be correctly saved', (done) ->
        httpBackend.reply 'POST', '/api/v1/workers', {id: 8, name: 'Bob'}

        worker = @workers.build({name: 'Bob'})
        expect(worker.isNew()).toBe(true)
        expect(worker.snapshots.isPersisted()).toBe(false)

        worker.actions.post().then (response) =>
          expect(worker.isNew()).toBe(false)
          expect(worker.snapshots.isPersisted()).toBe(true)
          httpBackend.done(done)

        httpBackend.flush()
