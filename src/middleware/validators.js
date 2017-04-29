import User from '../models/users'
import config from '../../config'
import { getToken } from '../utils/auth'
import { verify } from 'jsonwebtoken'

export async function ensureUser (ctx, next) {
  const token = getToken(ctx)

  if (!token) {
    ctx.throw(401)
  }

  let decoded = null
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    ctx.throw(err.message,401)
  }

  ctx.state.user = await User.findOne({username:decoded.username}, '-password') //-password意为不包括password字段
  if (!ctx.state.user) {
    ctx.throw(401)
  }

  return next()
}

export async function ensureAdmin (ctx, next) {
  const token = getToken(ctx)

  if (!token) {
    ctx.throw(401)
  }

  let decoded = null
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    ctx.throw(err.message,401)
  }

  ctx.state.admin = await Admin.findById(decoded.id, '-password') //-password意为不包括password字段
  if (!ctx.state.admin) {
    ctx.throw(401)
  }

  return next()
}
