const faker = require('faker')
const { axios, axiosB, assert, testUserA, testUserB } = require('./test')

describe('item logs', async function () {
  let item

  beforeEach(async function () {
    name = faker.commerce.productName()
    description = faker.commerce.productName()
    const response = await axios.post('/items', {
      name,
      description
    })
    item = response.data
  })

  describe('POST /items/:id/requests', async function () {
    it('should create item log', async function () {
      let response = await axiosB.post(`/items/${item.id}/requests`)
      assert.equal(response.status, 201)
      assert.equal(response.data.id, item.id)
      assert.isArray(response.data.requests)
      assert.equal(response.data.requests[0].user_id, testUserB.id)
    })

    it('should not allow same user to request more than once', async function () {
      let response = await axiosB.post(`/items/${item.id}/requests`)
      try {
        response = await axiosB.post(`/items/${item.id}/requests`)
        assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 400)
      }
    })

    it('should not allow owner to request their own item', async function () {
      try {
        let response = await axios.post(`/items/${item.id}/requests`)
        await assert.fail()
      } catch (err) {
        assert.equal(err.response.status, 400)
      }
    })

    // it('should reset request status if request user recieves item', function () {
    //   let response = await axiosB.post(`/items/${item.id}/requests`)
    // })
  })

  describe.only('POST /items/:id/transfer', async function () {
    it('should change the status and holder of the item when user makes transer', async function () {
      let response = await axios.post(`/items/${item.id}/transfer`, {
        user_id: testUserB.id
      })
      assert.equal(response.status, 200)
      response = await axios.get(`/items/${item.id}`)
      assert.equal(response.status, 200)
      assert.equal(response.data.status, 'Unavailable')
      assert.equal(response.data.holder.id, testUserB.id)
    })

    it('should change the status and holder of the item when requester makes transfer', async function () {
      let response = await axiosB.post(`/items/${item.id}/transfer`, {
        user_id: testUserB.id
      })
      assert.equal(response.status, 200)
      response = await axios.get(`/items/${item.id}`)
      assert.equal(response.status, 200)
      assert.equal(response.data.status, 'Unavailable')
      assert.equal(response.data.holder.id, testUserB.id)
    })

    it('should create a log of the transfer when owner makes transfer', async function () {
      let message = 'Dropping off at user testUserB'
      let response = await axios.post(`/items/${item.id}/transfer`, {
        user_id: testUserB.id,
        message
      })
      assert.equal(response.status, 200)
      response = await axios.get(`/items/${item.id}`)
      const logs = response.data.logs
      assert.isArray(logs)
      assert.equal(logs[0].user_message, message)
      assert.equal(logs[0].user_id, testUserA.id)
      assert.equal(logs[0].message, `${testUserB.name} recieved ${item.name} from ${testUserA.name}`)
      assert.exists(logs[0].updated_at)
    })

    it('should create a log of the transfer when requester makes transfer', async function () {
      let message = 'Dropping off at user testUserB'
      let response = await axiosB.post(`/items/${item.id}/transfer`, {
        user_id: testUserB.id,
        message
      })
      assert.equal(response.status, 200)
      response = await axios.get(`/items/${item.id}`)
      const logs = response.data.logs
      assert.isArray(logs)
      console.log(logs)
      assert.equal(logs[0].user_message, message)
      assert.equal(logs[0].user_id, testUserB.id)
      assert.equal(logs[0].message, `${testUserB.name} recieved ${item.name} from ${testUserA.name}`)
      assert.exists(logs[0].updated_at)
    })
  })
})
