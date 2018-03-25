const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const knex = require(__rootdir + '/db')

router.get('/users', async (req, res) => {
  try {
    const results = await knex.raw(
      `
      SELECT
        id,
        first_name || ' ' || last_name AS name
      FROM
        users
      `
    )
    return res.status(200).json(results.rows)
  } catch (err) {
    return res.status(500).json({
      success: false,
      errors: err
    })
  }
})

router.get('/users/autocomplete', async (req, res) => {
  const search = req.query.search
  try {
    const results = await knex.raw(`
      SELECT
        id,
        first_name || ' ' || last_name AS name
      FROM 
        users
      WHERE
        first_name || ' ' || last_name ILIKE '%${search}%'
      LIMIT 5;
    `)
    return res.status(200).json({
      success: true,
      data: results.rows
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      success: false,
      errors: err
    })
  }
})
module.exports = router
