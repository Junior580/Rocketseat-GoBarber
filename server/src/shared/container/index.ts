import { container } from 'tsyringe'

import '@modules/users/providers'
import './providers'

import { IAppointmentsRepository } from '@modules/appointments/repositories/interfaces/IAppointmentsRepository'
import { AppointmentsRepository } from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'

import { IUsersRepository } from '@modules/users/repositories/interfaces/IUserRepository'
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository'

import { IUserTokensRepository } from '@modules/users/repositories/interfaces/IUserTokensRepository'
import { UserTokenRepository } from '@modules/users/infra/typeorm/repositories/UserTokensRepository'

import { INotificationsRepository } from '@modules/notifications/repositories/interface/INotificationsRepository'
import { NotificationsRepository } from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository'

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository
)

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokenRepository
)

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository
)
