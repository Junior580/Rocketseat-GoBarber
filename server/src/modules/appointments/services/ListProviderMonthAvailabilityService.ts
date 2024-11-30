// import AppError from '@shared/errors/AppError'
import { IAppointmentsRepository } from '../repositories/interfaces/IAppointmentsRepository'
import { getDate, getDaysInMonth, isAfter } from 'date-fns'

import { inject, injectable } from 'tsyringe'
interface IListProviderMonthAvailabilityRequest {
  provider_id: string
  month: number
  year: number
}

type IListProviderMonthAvailabilityResponse = Array<{
  day: number
  available: boolean
}>

@injectable()
export class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository
  ) {}
  public async execute({
    provider_id,
    month,
    year,
  }: IListProviderMonthAvailabilityRequest): Promise<IListProviderMonthAvailabilityResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInMonthFromProvider({
        provider_id,
        month,
        year,
      })

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1
    )

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59)

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day
      })

      return {
        day,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      }
    })

    return availability
  }
}
