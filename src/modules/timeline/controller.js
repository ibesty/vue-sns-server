import UserRelation from '../../models/userRelations'
import Post from '../../models/posts'
import User from '../../models/users'

/*
	@api {get} /timeline 获取timeline
*/
function sortByCreationDate (a,b){
	return b.creationDate - a.creationDate
}

export async function getTimeline(ctx) {
	const username = ctx.state.user.username
	const userRelation = await UserRelation.findOne({username: username}) //查找following user
	const userPost = await Post.findOne({username: username})
	let timeline
	for (let user of userRelation.following) { //查找post
		let post = await Post.findOne({username: user.username})
		timeline = userPost.posts.concat(post.posts)
		timeline.sort(sortByCreationDate)
	}

	ctx.body = {
		timeline
	}
}