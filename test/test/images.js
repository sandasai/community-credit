const faker = require('faker')
const { assert, testUserA, testUserB } = require('./test')
const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
const validator = require('validator')

const axios = require('axios').create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
  timeout: 50000,
  headers: {
    'Authorization': `Bearer ${testUserA.token}`
  }
});

const axiosB = require('axios').create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
  timeout: 50000,
  headers: {
    'Authorization': `Bearer ${testUserB.token}`
  }
});

const test = process.env.TEST_UPLOADS ? 'only' : 'skip'

describe[test]('images', function () {
  let name
  let description
  let item

  function getRandomFileName() {
    let files = fs.readdirSync(path.resolve(__dirname, './images'))
    let fileName = files[Math.floor(Math.random() * files.length)]
    return path.resolve(path.resolve(__dirname, './images'), fileName)
  }

  beforeEach(async function () {
    name = faker.commerce.productName()
    description = faker.commerce.productName()
    response = await axios.post('/items', {
      name,
      description
    })
    item = response.data
  })

  it('should not be able to upload image without associated item', async function () {
    const imageUrl = getRandomFileName()
    const formData = new FormData()
    formData.append(`files`, fs.createReadStream(imageUrl))
    try {
      const response = await axios.post(`/items/-1234/images`, formData, {
        headers: formData.getHeaders()
      })
      assert.fail()
    } catch (err) {
      assert.equal(err.response.status, 404)
    }
  })

  function assertImageUpload(data, file, itemId) {
    const { id, width, height, format, bytes, url, item_id, remote_id } = data
    assert.isAtLeast(id, 0)
    assert.isAtLeast(width, 1)
    assert.isAtLeast(height, 1)
    assert.exists(format)
    assert.exists(remote_id)
    assert.equal(bytes, fs.statSync(file).size)
    assert.isTrue(validator.isURL(url))
    assert.equal(item_id, itemId)
  }

  it('should be able to upload image after item upload', async function () {
    const imageUrl = getRandomFileName()
    const formData = new FormData()
    formData.append(`files[0]`, fs.createReadStream(imageUrl))
    const response = await axios.post(`/items/${item.id}/images`, formData, {
      headers: formData.getHeaders()
    })
    assert.equal(response.status, 200)
    assert.isArray(response.data)
    assertImageUpload(response.data[0], imageUrl, item.id)
  })

  it('should be able to upload multiple images', async function () {
    const imageUrls = []
    const noFiles = 4
    for (var i = 0; i < noFiles; i++) {
      imageUrls.push(getRandomFileName())
    }
    const formData = new FormData()

    imageUrls.forEach((url, index) => {
      formData.append(`files[${index}]`, fs.createReadStream(url))
    })

    const response = await axios.post(`/items/${item.id}/images`, formData, {
      headers: formData.getHeaders()
    })
    assert.equal(response.status, 200)
    assert.isArray(response.data)
    assert.equal(response.data.length, noFiles)
  })

  it('should be able to remove an image', async function () {
    const imageUrl = getRandomFileName()
    const formData = new FormData()
    formData.append(`files[0]`, fs.createReadStream(imageUrl))
    let response = await axios.post(`/items/${item.id}/images`, formData, {
      headers: formData.getHeaders()
    })
    assert.equal(response.status, 200)
    assert.isArray(response.data)

    response = await axios.delete(`/items/${item.id}/images/${response.data[0].id}`)
    assert.equal(response.status, 202)
  })

  const junkFileName = path.resolve(__dirname, 'junkfile.txt')

  it('should not accept nonstandard formats', async function () {
    const formData = new FormData()
    fs.appendFileSync(junkFileName, 'Hello world!', function (err) {
      if (err) throw err;
    });
    formData.append(`files[0]`, fs.createReadStream(junkFileName))
    try {
      let response = await axios.post(`/items/${item.id}/images`, formData, {
        headers: formData.getHeaders()
      })
      await fs.unlinkSync(junkFileName)
      assert.fail()
    } catch (err) {
      await fs.unlinkSync(junkFileName)
      assert.equal(err.response.status, 400)
    }
  })
})