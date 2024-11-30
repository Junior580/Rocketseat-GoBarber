import { AppDataSourceMongo } from '@shared/infra/typeorm/mongoData-source'
import { MongoRepository } from 'typeorm'

import { INotificationsRepository } from '@modules/notifications/repositories/interface/INotificationsRepository'
import { ICreateNotificationDTO } from '@modules/notifications/dtos/ICreateNotificationsDTO'

import { Notification } from '../schemas/Notification'

export class NotificationsRepository implements INotificationsRepository {
  private notificationRepository: MongoRepository<Notification>

  constructor() {
    this.notificationRepository =
      AppDataSourceMongo.getMongoRepository(Notification)
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.notificationRepository.create({
      content,
      recipient_id,
    })

    await this.notificationRepository.save(notification)

    return notification
  }
}
