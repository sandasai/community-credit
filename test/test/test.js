//During the test the env variable is set to test
process.env.NODE_ENV = 'test'
process.env.PORT = '8889'

let server = require('../server')

// Require the dev-dependencies
let chai = require('chai')
let assert = chai.assert
const faker = require('faker')

// Test users defined in config files. Tokens must be setup manually
const config = require('../../config.json')
const testUserA = config.test[0]
const testUserB = config.test[1]

const axios = require('axios').create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${testUserA.token}`
  }
});

const axiosB = require('axios').create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${testUserB.token}`
  }
});

module.exports = {
  axios, axiosB, assert, testUserA, testUserB
}


describe('test', (done) => {
  it('should be successful', function () {
    assert.equal(0, 0)
  })
})
