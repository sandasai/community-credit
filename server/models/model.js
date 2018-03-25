const knex = require('.././db')
const joi = require('joi')

/**
 * Removes the properties from a data object that will be automatically populated on db
 * @param {object} obj
 */
function setDefaultColumns (obj) {
  const keys = ['id', 'created_at', 'updated_at']
  keys.forEach((key) => {
    delete obj[key]
  })
}

class Model {
  /**
   * Create a request object. No need to set timestamps
   * @param {Object} data An object with keys as the fields of the model
   */
  constructor (data) {
    if (data) {
      Object.keys(data).forEach((key) => {
        this[key] = data[key]
      })
    }
  }

  /**
  * Find a single object by id
  * @param {number} id id of the user
  */
  static async find (id) {
    const objects = await knex.select().from(this.table).where({ id }).limit(1)
    if (objects.length === 0) {
      return null
    } else {
      return new this(objects[0])
    }
  }

  /**
  * Validates and saves the object
  * @returns {Promise}
  */
  async save () {
    const result = joi.validate(this, this.constructor.schema)
    if (result.error) {
      throw result.error
    }
    // Create new object
    if (!this.id) {
      const data = { ...this }
      setDefaultColumns(data)
      const date = new Date()
      data.updated_at = date.toISOString()
      data.created_at = date.toISOString()
      const result = await knex(this.constructor.table).insert(data).returning('*')
      return result[0]
    }
    // Update object
    const object = await this.constructor.find(this.id)
    if (object) {
      const data = { ...this }
      setDefaultColumns(data)
      data.updated_at = new Date().toISOString()
      const result = await knex(this.constructor.table).where('id', this.id).update(data).returning('*')
      return new this.constructor(result[0])
    } else {
      return Promise.reject(new Error(`${this.constructor.table} does not exist in database`))
    }
  }
}

module.exports = Model
