import UserRelation from '../../models/userRelations'
import User from '../../models/users'

/*
 * @api {get} /user-relations/:username 获取关注和粉丝
 */

export async function getRelation(ctx, next) {
  try {
    const user = await User.findOne({
      username: ctx.params.username
    })
    if (!user) {
      ctx.throw(404)
    }

    let userRelation = await UserRelation.findOne({
      username: ctx.params.username
    })

    if (!userRelation) {
      userRelation = new UserRelation({
        username: ctx.params.username
      })
      await userRelation.save()
    }
    ctx.body = {
      userRelation
    }

  } catch (err) {
    ctx.throw(err)
  }

  if (next) {
    return next()
  }
}

/*
	@api {post} /user-relations/:username

	{
		"userRelation": {
			"following" :  {"username": "username","nickname": "nickname"}
		}
	}
*/

export async function updateRelation(ctx) {
  try {
    const userRelation = ctx.body.userRelation //需要更新的用户关系数据
    const relationData = ctx.request.body.userRelation // body数据
    const hasUser = await User.findOne({
      username: relationData.following.username,
      nickname: relationData.following.nickname
    })



    // if (ctx.status.user.username !== userRelation.username) {
    //   ctx.throw(403)
    // }

    if (relationData.following && hasUser) {
      await UserRelation.findOneAndUpdate({
        username: userRelation.username
      }, {
        '$addToSet': {
          'following': {
            username: relationData.following.username,
            nickname: relationData.following.nickname
          }
        }
      })

      await UserRelation.findOneAndUpdate({
        username: relationData.following.username
      }, {
        '$addToSet': {
          'follower': {
            username: ctx.state.user.username,
            nickname: ctx.state.user.nickname
          }
        }
      })
    }
    // if (relationData.follower && hasUser) {
    //   await UserRelation.findOneAndUpdate({username: userRelation.username},{
    //     '$addToSet': {
    //       'follower': relationData.follower
    //     }
    //   })
    // } //没有这个逻辑

    //await userRelation.save()

    ctx.body = {
      userRelation
    }
  } catch (err) {

  }
}

/*
	@api {delete} /user-relation/:username 取消对某人的关注
*/
