import { ICreateNotificationDTO } from '@modules/notifications/dtos/ICreateNotificationsDTO'
import { Notification } from '@modules/notifications/infra/typeorm/schemas/Notification'
import { INotificationsRepository } from '../interface/INotificationsRepository'
import { v4 as uuid } from 'uuid'

export class InMemoryNotificationsRepository
  implements INotificationsRepository
{
  private notifications: Notification[] = []

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification()

    Object.assign(notification, { id: uuid(), content, recipient_id })

    this.notifications.push(notification)

    return notification
  }
}
