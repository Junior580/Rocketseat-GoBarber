import { DataSource } from 'typeorm'
import { Notification } from '@modules/notifications/infra/typeorm/schemas/Notification'
import 'dotenv/config'

const port = process.env.MONGODB_PORT as number | undefined

export const AppDataSourceMongo = new DataSource({
  type: 'mongodb',
  host: process.env.MONGODB_HOST,
  port: port,
  database: process.env.MONGO_DATABASE,
  useUnifiedTopology: true,
  entities: [Notification],
})
