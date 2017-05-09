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
  },
  {
    method: 'POST',
    route: '/cover/:username',
    handlers: [
      ensureUser,
      upload.uploadCover
    ]
  },
  {
    method: 'POST',
    route: '/postimg/:username',
    handlers: [
      ensureUser,
      upload.uploadPostImage
    ]
  },
  {
    method: 'POST',
    route: '/postvideo/:username',
    handlers: [
      ensureUser,
      upload.uploadPostVideo
    ]
  }
]
