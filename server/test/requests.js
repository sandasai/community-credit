const faker = require('faker')
const { axios, axiosB, assert, testUserA, testUserB } = require('./test')

describe('requests', function () {
  describe('GET /requests', function () {
    it('should return an array with status 200', async function () {
      const response = await axios.get('/requests')
      assert.equal(200, response.status)
      assert.isArray(response.data)
    })
  })

  describe('POST /requests', function () {
    it('should return a serialized object', async function () {
      const item = faker.commerce.productName()
      const description = faker.company.bsNoun()
      const response = await axios.post('/requests', {
        item,
        description
      })
      assert.equal(201, response.status)
      assert.equal(item, response.data.item)
      assert.equal(testUserA.id, response.data.user_id)
      assert.exists(response.data.id)
      assert.equal(description, response.data.description)
    })

    it('should include related user properties', async function () {
      const item = faker.commerce.productName()
      const description = faker.company.bsNoun()
      const response = await axios.post('/requests', {
        item,
        description
      })
      const user = response.data.user
      assert.exists(user)
      assert.equal(testUserA.id, user.id)
      assert.equal(testUserA.name, user.name)
    })

    it('should be created with a pending status', async function () {
      const item = faker.commerce.productName()
      const description = faker.company.bsNoun()
      const response = await axios.post('/requests', {
        item,
        description
      })
      assert.equal(response.data.status, 'pending')
    })
  })

  describe('PUT /requests/:id', function () {
    let item
    let description
    let id
    let requestId

    beforeEach(async function () {
      item = faker.commerce.productName()
      description = faker.company.bsNoun()
      let response = await axios.post('/requests', {
        item,
        description
      })
      assert.equal(201, response.status)
      requestId = response.data.id
    })

    it('should return 404 unknown id', async function () {
      try {
        let response = await axios.put('/requests/-123', {
          item: 'foo',
          description: 'bar'
        })
        assert.fail()
      } catch (err) {
        assert.equal(404, err.response.status)
      }
    })

    it('should edit an existing request', async function () {
      const newItem = faker.commerce.productName()
      const newDescription = faker.company.bsNoun()
      let response = await axios.put(`/requests/${requestId}`, {
        item: newItem,
        description: newDescription
      })
      assert.equal(newItem, response.data.item)
      assert.equal(newDescription, response.data.description)
      assert.notEqual(item, response.data.item)
      assert.notEqual(description, response.data.description)

      const user = response.data.user
      assert.exists(user)
      assert.equal(testUserA.id, user.id)
      assert.equal(testUserA.name, user.name)
    })

    it('should not be able to be edited by different user than creator', async function () {
      try {
        let response = await axiosB.put(`/requests/${requestId}`, {
          item: 'foobar',
          description: 'hello world!'
        })
        assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })
  })

  describe('DELETE /requests/:id', function () {
    let item
    let description
    let id
    let requestId

    beforeEach(async function () {
      item = faker.commerce.productName()
      description = faker.company.bsNoun()
      let response = await axios.post('/requests', {
        item,
        description
      })
      assert.equal(201, response.status)
      requestId = response.data.id
    })

    it('should return 404 unknown id', async function () {
      try {
        const response = await axios.put('/requests/-123', {
          item: 'foo',
          description: 'bar'
        })
        assert.fail()
      } catch (err) {
        assert.equal(404, err.response.status)
      }
    })
    it('should delete a created item', async function () {
      let response = await axios.delete(`/requests/${requestId}`)
      assert.equal(202, response.status)

      try {
        response = await axios.get(`/requests/${requestId}`)
        assert.fail()
      } catch (err) {
        assert.equal(404, err.response.status)
      }
    })

    it('should not be able to be edited by different user than creator', async function () {
      try {
        let response = await axiosB.delete(`/requests/${requestId}`)
        assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 401)
      }
    })
  })
})