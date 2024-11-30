import AppError from '@shared/errors/AppError'
import { startOfHour, isBefore, getHours, format } from 'date-fns'
import { Appointment } from '../infra/typeorm/entities/Appointment'
import { INotificationsRepository } from '@modules/notifications/repositories/interface/INotificationsRepository'
import { IAppointmentsRepository } from '../repositories/interfaces/IAppointmentsRepository'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import { inject, injectable } from 'tsyringe'

interface IRequestAppointment {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestAppointment): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError(`You can't create an appointment on a past date.`)
    }

    if (user_id === provider_id) {
      throw new AppError(`You can't create an appointment with yourself.`)
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate, provider_id)

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm.'
      )
    }

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    const dateFormatted = format(appointment.date, "dd/MM/yyyy 'às' HH:mm'h'")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    })

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d'
      )}`
    )

    return appointment
  }
}
