import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../../config'
import jwt from 'jsonwebtoken'
import joi from 'joi'

const User = new mongoose.Schema({
  status: {
    type: Number,
    default: 0 //0未激活,1正常,2禁止使用
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    required: true,
    default: new Date()
  }
})

User.index({username:1,email:1}) //建立索引

User.pre('save', function (next) {
  const user = this

  user.joiValidate(user,err=>{ //使用joi验证所有参数是否符合要求
    if (err) {
      return next(err)
    } 
  })

  if (!user.isModified('password')) {
    return next() //如果未修改密码，则直接修改，不再重新生成密码
  }

  new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject(err)
        }
        resolve(salt)
      })
    })
    .then(salt => { //将密码加盐hash之后存储，提高安全性
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          throw new Error(err)
        }

        user.password = hash

        next(null)
      })
    })
    .catch(err => next(err))
})

User.methods.joiValidate = function joiValidate(obj,cb) { //使用joi验证
  const schema = {
    status: joi.number(),
    username: joi.string().token().lowercase().min(4).max(20).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().alphanum().min(8).max(20),
    nickname: joi.string().min(4).max(20)
  }
  return joi.validate(obj,schema,{allowUnknown:true},cb)
}

User.methods.validatePassword = function validatePassword(password) { //使用bcrypt验证密码
  const user = this

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      resolve(isMatch)
    })
  })
}

User.methods.generateToken = function generateToken() {
  const user = this

  return jwt.sign({
    id: user.id,
    username: user.username
  }, config.token, {
    expiresIn: '7 days'
  })
}

export default mongoose.model('user', User)
