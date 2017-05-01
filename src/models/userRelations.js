import mongoose from 'mongoose'
import joi from 'joi'

const UserRelation = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  following: [{
    username: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    _id: false
  }],
  followingCount: Number,
  follower: [{
    username: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    _id: false
  }],
  followerCount: Number
})

UserRelation.pre('save', function (next) {
  const userRelation = this

  // userRelation.joiValidate(userRelation, err => {
  //   if (err) {
  //     return next(err)
  //   }
  // })
  userRelation.followingCount = userRelation.following.length
  userRelation.followerCount = userRelation.follower.length
  next(null)
})

UserRelation.methods.joiValidate = function joiValidate(obj, cb) {
  const schema = {
    username: joi.string().token().lowercase().min(4).max(20).required()
  }
  return joi.validate(obj, schema, {
    allowUnknown: true
  }, cb)
}

export default mongoose.model('user_relation', UserRelation)
