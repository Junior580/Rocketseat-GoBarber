import multer, { StorageEngine } from 'multer'
import path from 'path'
import crypto from 'crypto'

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

interface IUploadConfig {
  driver: 's3' | 'disk'

  tmpFolder: string
  uploadsFolder: string

  multer: { storage: StorageEngine }

  config: {
    disk: Record<string, unknown>
    aws: {
      bucket: string
    }
  }
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(_, file, callback) {
        const filehash = crypto.randomBytes(10).toString('hex')

        const filename = `${filehash}-${file.originalname}`

        return callback(null, filename)
      },
    }),
  },

  config: {
    disk: {},
    aws: { bucket: 'app-gobarber' },
  },
} as IUploadConfig
