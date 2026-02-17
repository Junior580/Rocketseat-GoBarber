import 'reflect-metadata'
import 'dotenv/config'

import 'express-async-errors'
import express from 'express'

import uploadConfig from '@config/upload'
import cors from 'cors'

import { errors } from 'celebrate'
import { AppDataSource } from '../typeorm/data-source'
import { AppDataSourceMongo } from '../typeorm/mongoData-source'
import { routes } from '../http/routes/index.routes'
import { handleError } from './middlewares/handleError'
import { rateLimiter } from './middlewares/rateLimiter'

import '@shared/container'

async function bootstrap() {
  try {
    await AppDataSource.initialize()
    await AppDataSourceMongo.initialize()

    const app = express()

    app.use(
      cors({
        origin: 'http://localhost:5173',
      })
    )

    app.use(express.json())
    app.use(rateLimiter)
    app.use('/files', express.static(uploadConfig.uploadsFolder))

    app.use('/api', routes)

    app.use(errors())

    app.use(handleError)

    const port = 3333

    return app.listen(port, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 server is running on ${port}!`)
      }
    })
  } catch (err) {
    console.error('❌ Error during startup:', err)
    process.exit(1)
  }
}

bootstrap()
