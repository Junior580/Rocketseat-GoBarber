// import AppError from '@shared/errors/AppError'
import { IAppointmentsRepository } from '../repositories/interfaces/IAppointmentsRepository'
import { getHours, isAfter } from 'date-fns'

import { inject, injectable } from 'tsyringe'
interface IListProviderDayAvailabilityRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

type IListProviderDayAvailabilityResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
export class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository
  ) {}
  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IListProviderDayAvailabilityRequest): Promise<IListProviderDayAvailabilityResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      })

    const hourStart = 8

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart
    )

    const currentDate = new Date(Date.now())

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour
      )

      const compareDate = new Date(year, month - 1, day, hour)

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      }
    })

    return availability
  }
}
