import { ensureUser } from '../../middleware/validators'
import * as timeline from './controller'

export const baseUrl = '/timeline'

export default [
	{
		method: 'GET',
		route: '/',
		handlers: [
			ensureUser,
			timeline.getTimeline
		]
	}
]