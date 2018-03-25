const knex = require('.././db')
const joi = require('joi')
const Model = require('./model')

const schema = joi.object().keys({
  id: joi.number().optional(),
  width: joi.number(),
  height: joi.number(),
  format: joi.string().min(1).max(255),
  bytes: joi.number(),
  cloudinary_public_id: joi.string(),
  cloudinary_version: joi.string(),
  cloudinary_url: joi.string(),
  item_id: joi.number(),
  created_at: joi.any(),
  updated_at: joi.any()
})

class Image extends Model {
  static async delete (id) {
    return knex.del().from('images').where({ id })
  }
}

Image.schema = schema
Image.table = 'images'

module.exports = Image
