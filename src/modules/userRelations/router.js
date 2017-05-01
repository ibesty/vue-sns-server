import { ensureUser } from '../../middleware/validators'
import * as userRelation from './controller'

export const baseUrl = '/user-relations'

export default [
	{
		method: 'GET',
		route: '/:username',
		handlers: [
			userRelation.getRelation
		]
	},
	{
		method: 'PUT',
		route: '/:username',
		handlers: [
			ensureUser,
			userRelation.getRelation,
			userRelation.updateRelation
		]
	}
]

