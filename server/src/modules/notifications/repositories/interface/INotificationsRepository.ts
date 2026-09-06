import { ICreateNotificationDTO } from '../../dtos/ICreateNotificationsDTO'
import { Notification } from '../../infra/typeorm/schemas/Notification'

export interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>
}
