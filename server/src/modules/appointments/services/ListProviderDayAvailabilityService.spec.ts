// import AppError from '../../../shared/errors/AppError'

import { InMemoryAppointmentsRepository } from '../repositories/inMemory/inMemoryAppointmentsRepository'
import { ListProviderDayAvailabilityService } from './ListProviderDayAvailabilityService'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let listProviderDayAvailability: ListProviderDayAvailabilityService

describe('List Provider Day Availability', () => {
  beforeEach(async () => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      inMemoryAppointmentsRepository
    )
  })

  it('should be able to list the day availability from provider', async () => {
    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(2023, 1, 21, 14, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(2023, 1, 21, 15, 0, 0),
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 1, 21, 11).getTime()
    })

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      day: 21,
      month: 2,
      year: 2023,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    )
  })
})
