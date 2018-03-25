const __rootdir = global.__rootdir
const express = require('express')
const router = express.Router()
const Models = require(__rootdir + '/models')
const knex = require(__rootdir + '/db')

router.get('/likes', async (req, res) => {
  const likes = await Models.Like.get(req.item)
  return res.status(200).json(likes)
})

router.post('/like', async (req, res) => {
  try {
    const liked = await Models.Like.alreadyLiked(req.item.id, req.user.id)
    if (liked) {
      const result = await knex.del().from('likes').where({
        user_id: req.user.id,
        item_id: req.item.id
      })
      return res.status(200).json(result)
    } else {
      let like = new Models.Like({
        user_id: req.user.id,
        item_id: req.item.id
      })
      like = await like.save()
      await Models.Notification.createLike(like)
      return res.status(200).json(like)
    }
  } catch (err) {
    return res.status(400).json(err)
  }
})

module.exports = router
