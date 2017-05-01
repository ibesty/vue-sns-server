import { ensureUser } from '../../middleware/validators'
import * as post from './controller'

export const baseUrl = '/posts'

export default [
	{
		method: 'POST',
		route: '/',
		handlers: [
			ensureUser,
			post.createPost
		]
	},
	{
		method: 'GET',
		route: '/:username',
		handlers: [
			post.getPost
		]
	},
	{
		method: 'DELETE',
		route: '/:id',
		handlers: [
			ensureUser,
			post.deletePost
		]
	}
	]