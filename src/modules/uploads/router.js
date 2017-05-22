import { ensureUser } from '../../middleware/validators'
import * as upload from './controller'

export const baseUrl = '/uploads'

export default [{
    method: 'POST',
    route: '/avatar/:username',
    handlers: [
      ensureUser,
      upload.uploadAvatar
    ]
  }
]
