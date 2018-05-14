const faker = require('faker')
const { axios, axiosB, assert, testUserA, testUserB } = require('./test')

describe('items', function () {
  describe('GET /items', async function () {
    it('should get all items', async function () {
      try {
        const response = await axios.get('/items')
        assert.equal(response.status, 200)
        assert.isArray(response.data)
      } catch (err) {
        console.log(err)
      }
    })
  })

  describe('GET /items/:id', function () {
    it('should be able to get a new item', async function () {
      const name = faker.commerce.productName()
      const description = faker.commerce.productName()
      let response = await axios.post('/items', {
        name,
        description
      })
      const id = response.data.id
      assert.exists(id)
      response = await axios.get(`/items/${id}`)
      assert.equal(response.data.name, name)
      assert.equal(response.data.description, description)
    })
  })

  describe('POST /items', function () {
    let name
    let description
    let response

    beforeEach(async function () {
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      response = await axios.post('/items', {
        name,
        description
      })
    })

    it('should be able to post a new item', async function () {
      assert.equal(response.status, 201)
      assert.equal(response.data.name, name)
      assert.equal(response.data.description, description)
      assert.exists(response.data.id)
      assert.exists(response.data.status)
    })

    it('should be able to post a new item with status "Available"', async function () {
      assert.equal(response.data.status, 'Available')
    })

    it('should have a owner and holder', function () {
      assert.exists(response.data.owner)
      assert.exists(response.data.holder)
      assert.equal(response.data.owner.id, testUserA.id)
      assert.equal(response.data.holder.id, testUserA.id)
    })

    it('should be able to post an item on behalf of a user request', async function () {
      // generate request
      item = faker.commerce.productName()
      description = faker.company.bsNoun()
      response = await axios.post('/requests', {
        item,
        description
      })
      const userId = response.data.user.id
      const requestId = response.data.id
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      response = await axiosB.post('/items', {
        name,
        description,
        request_id: response.data.id,
        user_id: response.data.user.id
      })
      assert.equal(response.data.associated_user_id, testUserA.id)
      assert.equal(response.data.associated_request_id, requestId)
      assert.equal(response.data.status, 'Unavailable')
    })

    it('should also set the status of the assocaited request', async function () {
      // generate request
      item = faker.commerce.productName()
      description = faker.company.bsNoun()
      response = await axios.post('/requests', {
        item,
        description
      })
      const userId = response.data.user.id
      const requestId = response.data.id
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      response = await axiosB.post('/items', {
        name,
        description,
        request_id: response.data.id,
        user_id: response.data.user.id
      })

      response = await axios.get(`/requests/${requestId}`)
      assert.equal(response.data.status, 'fulfilled')
    })

    it('should be able to post an item on behalf of a user', async function () {
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      response = await axiosB.post('/items', {
        name,
        description,
        user_id: testUserA.id
      })
      assert.equal(response.data.associated_user_id, testUserA.id)
      assert.equal(response.data.status, 'Unavailable')
    })
  })

  describe('PUT /items/:id', function () {
    let name
    let description
    let response
    let itemId

    beforeEach(async function () {
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      response = await axios.post('/items', {
        name,
        description
      })
      itemId = response.data.id
    })

    it('should be able to update an item', async function () {
      const newName = faker.commerce.productName()
      const newDescription = faker.commerce.productName()
      response = await axios.put(`/items/${itemId}`, {
        name: newName,
        description: newDescription
      })
      assert.equal(response.data.name, newName)
      assert.equal(response.data.description, newDescription)
      assert.notEqual(name, response.data.name)
      assert.notEqual(description, response.data.description)

      const owner = response.data.owner
      assert.exists(owner)
      assert.equal(testUserA.id, owner.id)
      assert.equal(testUserA.name, owner.name)
    })

    it('should not allow other users to update your item', async function () {
      try {
        response = await axiosB.put(`/items/${itemId}`, {
          name: 'fubar',
          description: 'hello werld'
        })
        assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })

    it('should allow the owner to update the status', async function () {
      response = await axios.put(`/items/${itemId}`, {
        status: 'Unavailable'
      })
      assert.equal(response.data.status, 'Unavailable')
    })
  })

  describe('DELETE /items/:id', function () {
    let name
    let description
    let response
    let itemId

    beforeEach(async function () {
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      response = await axios.post('/items', {
        name,
        description
      })
      itemId = response.data.id
    })

    it('should be able to update an item', async function () {
      response = await axios.delete(`/items/${itemId}`)
      assert.equal(response.status, 202)
      try {
        response = await axiosB.get(`/items/${itemId}`)
        assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 404)
      }
    })

    it('should not allow other users to delete your item', async function () {
      try {
        response = await axiosB.delete(`/items/${itemId}`)
        assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })
  })

  describe('item logs', function () {
    let item

    beforeEach(async function () {
      name = faker.commerce.productName()
      description = faker.commerce.productName()
      const response = await axios.post('/items', {
        name,
        description
      })
      item = response
    })
  })
})