import { Repository, Raw } from 'typeorm'
import { AppDataSource } from '@shared/infra/typeorm/data-source'

import { IAppointmentsRepository } from '@modules/appointments/repositories/interfaces/IAppointmentsRepository'
import { ICreateAppointmentDTO } from '@modules/appointments/dtos/ICreateAppointmentDTO'

import { IFindAllInMonthFromProviderDTO } from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import { IFindAllInDayFromProviderDTO } from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

import { Appointment } from '../entities/Appointment'

export class AppointmentsRepository implements IAppointmentsRepository {
  private appointmentRepository: Repository<Appointment>

  constructor() {
    this.appointmentRepository = AppDataSource.getRepository(Appointment)
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.appointmentRepository.findOne({
      where: { date, provider_id },
    })
    return findAppointment || undefined
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.appointmentRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY')= '${parsedMonth}-${year}'`
        ),
      },
    })

    return appointments
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0')
    const parsedMonth = String(month).padStart(2, '0')

    const appointments = await this.appointmentRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ['user'],
    })

    return appointments
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.appointmentRepository.create({
      provider_id,
      user_id,
      date,
    })
    await this.appointmentRepository.save(appointment)
    return appointment
  }
}
