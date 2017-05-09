import multer from 'koa-multer'
import webp from 'webp-converter'


export async function uploadAvatar(ctx) {
  const avatarStorage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '../../../public/avatar')
    },
    filename(req, file, cb) {
      let fileFormat = (file.originalname).split(".")
      cb(null, ctx.state.user.username + "." + fileFormat[fileFormat.length - 1])
    }
  })
  const upload = multer({
    storage: avatarStorage,
	limits: {
		fileSize: 2048000,
		files: 1
	}
  })
  export default upload.any()
}

export async function uploadCover(ctx) {
  const coverStorage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
}

export async function uploadPostImage(ctx) {
  const postImgStorage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
}

export async function uploadPostVideo(ctx) {
  const postViderStorage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
}
