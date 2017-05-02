import User from '../../models/users'
import UserRelation from '../../models/userRelations'
import Post from '../../models/posts'

/**
 * @api {post} /users 注册
 * @apiPermission 所有人
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiExample 用法示例:
 * curl -H "Content-Type: application/json" -X POST -d '{ "user": { "username": "johndoe","email": "abc@abc.com", "password": "secretpasas","nickname": "nickname" } }' localhost:5000/users
 *
 * @apiParam {Object} user          User 对象 (必须)
 * @apiParam {String} user.username 用户名,同时是个性链接地址 (必须)
 * @apiParam {String} user.email 电子邮箱地址
 * @apiParam {String} user.password 密码
 *
 * @apiSuccess {Object}   user           User 对象
 * @apiSuccess {ObjectId} user._id       User Objectid
 * @apiSuccess {String}   user.username  用户名,同时是个性链接地址
 * @apiSuccess {String}   user.email     电子邮箱地址
 * @apiSuccess {String}   user.nickname  用户昵称
 * @apiSuccess {String}   user.status 用户状态
 *
 * @apiSuccessExample {json} 成功响应
 *     HTTP/1.1 200 OK
 *     {
 *      "user": {
 *        "__v": 0,
 *        "username": "bestie",
 *        "email": "abc@abc.com",
 *        "nickname": "BESTIE",
 *        "_id": "58f09885514d793bb04b0685",
 *        "status": 0
 *      },
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZjA5ODg1NTE0ZDc5M2JiMDRiMDY4NSIsImlhdCI6MTQ5MjE2MjY5MywiZXhwIjoxNDkyNzY3NDkzfQ.MDesD1lTHuLYvwOmjgNDpUHr7VqBl6RAWTG-HRRJnXE"
 *     }
 *
 * @apiError UnprocessableEntity 缺少必要的参数或者参数不符合要求
 *
 * @apiErrorExample {json} 错误响应
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 */
export async function createUser(ctx) {
  const user = new User(ctx.request.body.user) // 初始化user
  const userRelation = new UserRelation({
    username: ctx.request.body.user.username
  }) // 初始化user relation
  const post = new Post({
    username: ctx.request.body.user.username
  }) // 初始化post

  user.creationDate = new Date()
  try {
    await user.save()
    await userRelation.save()
    await post.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }

  const token = user.generateToken()
  const response = user.toJSON()

  delete response.password

  ctx.body = {
    user: response,
    token
  }
}

/**
 * @api {get} /users 获取所有用户信息
 * @apiPermission admin
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiExample 用法示例
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users
 *
 * @apiSuccess {Object[]} users           用户数组
 * @apiSuccess {ObjectId} users._id       User Objectid
 * @apiSuccess {String}   users.username  用户名,同时是个性链接地址
 * @apiSuccess {String}   users.email  电子邮箱地址
 * @apiSuccess {String}   users.nickname 用户昵称
 * @apiSuccess {String}   user.status 用户状态
 *
 * @apiSuccessExample {json} 成功响应
 *    HTTP/1.1 200 OK
 *    {
 *    "users": [
 *        {
 *          "_id": "58f0d22101d56b43587322ce",
 *          "username": "bestie1",
 *          "email": "bestie1@bestie.com",
 *          "nickname": "BESTIE",
 *          "__v": 0,
 *          "status": 0
 *        }
 *      ]
 *    }
 *
 * @apiUse TokenError
 */
export async function getUsers(ctx) {
  const users = await User.find({}, '-password')
  ctx.body = {
    users
  }
}

/**
 * @api {get} /users/:id 通过id获取单个用户信息
 * @apiPermission user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X GET localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      User name
 * @apiSuccess {String}   users.username  User username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "John Doe"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiUse TokenError
 */
export async function getUser(ctx, next) {
  try {
    const user = await User.findById(ctx.params.id, '-password -email -status')
    if (!user) {
      ctx.throw(404)
    }

    ctx.body = {
      user
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) {
    return next()
  }
}

/**
 * @api {put} /users/:id Update a user
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X PUT -d '{ "user": { "name": "Cool new Name" } }' localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiParam {Object} user          User object (required)
 * @apiParam {String} user.name     Name.
 * @apiParam {String} user.username Username.
 *
 * @apiSuccess {Object}   users           User object
 * @apiSuccess {ObjectId} users._id       User id
 * @apiSuccess {String}   users.name      Updated name
 * @apiSuccess {String}   users.username  Updated username
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *          "_id": "56bd1da600a526986cf65c80"
 *          "name": "Cool new name"
 *          "username": "johndoe"
 *       }
 *     }
 *
 * @apiError UnprocessableEntity Missing required parameters
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "status": 422,
 *       "error": "Unprocessable Entity"
 *     }
 *
 * @apiUse TokenError
 */
export async function updateUser(ctx) {
  const user = ctx.body.user

  Object.assign(user, ctx.request.body.user)

  await user.save()

  ctx.body = {
    user
  }
}

/**
 * @api {delete} /users/:id Delete a user
 * @apiPermission
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiExample Example usage:
 * curl -H "Content-Type: application/json" -X DELETE localhost:5000/users/56bd1da600a526986cf65c80
 *
 * @apiSuccess {StatusCode} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 *
 * @apiUse TokenError
 */

export async function deleteUser(ctx) {
  const user = ctx.body.user

  await user.remove()

  ctx.status = 200
  ctx.body = {
    success: true
  }
}
