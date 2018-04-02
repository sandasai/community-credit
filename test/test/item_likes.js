const { axios, axiosB, assert, testUserA, testUserB } = require('./test')
const faker = require('faker')

describe('item_likes', function () {
  let item

  beforeEach(async function () {
    let name = faker.commerce.productName()
    let description = faker.commerce.productName()
    let response = await axios.post('/items', {
      name,
      description
    })
    item = response.data

    response = await axios.post(`/items/${item.id}/likes`)
    assert.equal(response.status, 201)

    response = await axiosB.post(`/items/${item.id}/likes`)
    assert.equal(response.status, 201)
  })

  it('should be able to like an item', () => {

  })

  it('shouldnt be able to like an item more than once', async function () {
    try {
      let response = await axios.post(`/items/${item.id}/likes`)
      assert.equal(response.status, 201)
    } catch (err) {
      assert.equal(err.response.status, 400)
    }
  })

  it('should be able to unlike an item', async function () {
    let response = await axios.delete(`/items/${item.id}/likes`)
    assert.equal(response.status, 204)

    response = await axios.post(`/items/${item.id}/likes`)
    assert.equal(response.status, 201)
  })

  it('should show up as a count when getting item', async function () {
    let response = await axios.get(`/items/${item.id}`)
    assert.equal(response.data.likes.length, 2)
  })

  it('should indicate whether the user has liked the item or not', async function () {
    let response = await axios.get(`/items/${item.id}`)
    assert.equal(response.data.liked, true)
    response = await axiosB.get(`/items/${item.id}`)
    assert.equal(response.data.liked, true)

    response = await axios.delete(`/items/${item.id}/likes`)
    assert.equal(response.status, 204)
    response = await axios.get(`/items/${item.id}`)
    assert.equal(response.data.liked, false)
  })
})