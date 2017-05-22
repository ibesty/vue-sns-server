import mongoose from 'mongoose'
import joi from 'joi'

const PostContent = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reposts: {
    type: Array,
    required: true,
    default: [{}]
  },
  repostsCount: {
    type: Number,
    required: true,
    default: 0
  },
  comments: {
    type: Array,
    required: true,
    default: [{}]
  },
  commentsCount: {
    type: Number,
    required: true,
    default: 0
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date()
  }
})

const Post = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  posts: [PostContent],
  postCount: {
    type: Number,
    default: 0
  }
})

Post.pre('save', function (next) {
  const post = this

  post.joiValidate(post, err => { //使用joi验证所有参数是否符合要求
    if (err) {
      return next(err)
    }
  })

  post.postCount = post.posts.length //更新长度
  next(null)
})

PostContent.pre('save', function (next) {
  const postContent = this

  postContent.creationDate = new Date()
  console.log(postContent.creationDate)
  postContent.joiValidate(postContent, err => { //使用joi验证所有参数是否符合要求
    if (err) {
      return next(err)
    }
  })
  next(null)
})

Post.methods.joiValidate = function (obj, cb) {
  const schema = {
    username: joi.string().token().lowercase().min(4).max(20).required()
  }
  return joi.validate(obj, schema, {
    allowUnknown: true
  }, cb)
}

PostContent.methods.joiValidate = function (obj, cb) {
  const schema = {
    username: joi.string().token().lowercase().min(4).max(20).required(),
    nickname: joi.string().min(4).max(20).required(),
    content: joi.string().min(1).max(140).required(),
    reposts: joi.array().required(),
    repostsCount: joi.number().required(),
    comments: joi.array().required(),
    commentsCount: joi.number().required(),
    creationDate: joi.date().required()
  }
  return joi.validate(obj, schema, {
    allowUnknown: true
  }, cb)
}


export default mongoose.model('post', Post)
