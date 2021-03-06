'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SLACK_CLIENT_ID: `"${process.env.SLACK_CLIENT_ID}"`,
  SLACK_SCOPES: `"${process.env.SLACK_SCOPES}"`,
  BASE_URL: `"http://127.0.0.1:8080/#/"` // local development
})
