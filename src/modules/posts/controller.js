import Post from '../../models/posts'
import mongoose from 'mongoose'

/*
 * @api {get} /posts/:username?start=0&limit=10
 */
export async function getPost(ctx) {
  try {
    let post = await Post.findOne({
      username: ctx.params.username
    })

    if (!post) {
      ctx.throw(404)
    }

    if (!!ctx.request.query.start) { //如果带参数则返回特定数量的post
      let start = parseInt(ctx.request.query.start)
      let stop = parseInt(ctx.request.query.limit) + start
      post = post.posts.slice(start, stop)
    }

    ctx.body = {
      post
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
}

/*
 * @api {post} /posts
 *  {
 *      "content": "this is a test post"
 *  }
 */

export async function createPost(ctx) {
  try {
    let post = await Post.findOne({
      username: ctx.state.user.username
    })

    if (!post) {
      post = new Post({
        username: ctx.state.user.username
      })
    }

    const postContent = ctx.request.body
    postContent.username = ctx.state.user.username
    postContent.nickname = ctx.state.user.nickname
    postContent.creationDate = new Date()

    post.posts.push(postContent) //将数据存入post数组

    await post.save()

    ctx.body = {
      post
    }

  } catch (err) {
    ctx.throw(err)
    ctx.throw(422, err.message)
  }
}

/*
 * @api {del} /posts/:id
 */

export async function deletePost(ctx) {
  try {
    let post = await Post.findOne({
      username: ctx.state.user.username
    })

    if (!post.posts.id(ctx.params.id)) {
      ctx.throw(404)
    }

    post.posts.id(ctx.params.id).remove()

  	await post.save()

    ctx.body = 'removed'

  } catch (err) {
		ctx.throw(404)
  }
}
