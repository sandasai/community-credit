/* eslint-disable camelcase */
const pool = require('../db')

function insertUser (first_name, last_name, email, phone, hash, salt) {
  const text =
    `
      INSERT INTO users (first_name, last_name, email, phone, hash, salt) 
      VALUES ($1, $2, $3, $4, $5, $6); 
    `
  const values = [ first_name, last_name, email, phone, hash, salt ]

  return pool.query(text, values).then(res => {
    console.log(res.rows[0])
    return res
  }).catch(err => {
    console.log(err)
  })
}

function getUserHash (email) {
  const text = `SELECT hash FROM users WHERE email=$1`
  const values = [ email ]
  return pool.query(text, values).then(res => res.rows[0].hash)
}

function insertItem (title, description, store_expiration, sharing_length, owner) {
  return pool.query(
    `
      INSERT INTO items (title, description, store_expiration, sharing_length, owner) 
      VALUES (${title}, ${description}, ${store_expiration}, ${sharing_length}, ${owner});
    `
  ).then(result => {
    console.log(result.rows[0])
    return result
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  insertUser,
  getUserHash,
  insertItem
}
