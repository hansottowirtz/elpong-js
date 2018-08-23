elpong = require('../src/main').default

describe 'Relations', ->
  describe 'inline', ->
    beforeEach ->
      @scheme = elpong.add(require('./fixtures/gallery/scheme.json5'))

    it 'should have the right fields', ->
      categories = @scheme.select('categories')
      photos = @scheme.select('photos')

      fotoshoot = categories.build(id: 'fotoshoot', name: 'Fotoshoot')
      newborn = categories.build(id: 'newborn', name: 'Newborn')

      photo1 = photos.build(id: 1, categories_ids: ['fotoshoot', 'newborn'])
      photo2 = photos.build(id: 2, categories_ids: ['newborn'])

      expect(photo1.relations.categories()).toEqual([fotoshoot, newborn])
      expect(photo2.relations.categories()).toEqual([newborn])
