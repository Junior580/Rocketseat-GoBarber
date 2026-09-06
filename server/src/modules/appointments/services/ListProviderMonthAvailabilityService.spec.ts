import { InMemoryAppointmentsRepository } from '../repositories/inMemory/inMemoryAppointmentsRepository'
import { ListProviderMonthAvailabilityService } from './ListProviderMonthAvailabilityService'

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
let listProvidersMonthAvailability: ListProviderMonthAvailabilityService

let nextYear: number
let nextMonth: number

describe('List Provider Month Availability', () => {
  beforeEach(async () => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    listProvidersMonthAvailability = new ListProviderMonthAvailabilityService(
      inMemoryAppointmentsRepository
    )
  })

  beforeAll(() => {
    const currentDate = new Date()
    nextYear =
      currentDate.getFullYear() + Math.floor((currentDate.getMonth() + 1) / 12)
    nextMonth = (currentDate.getMonth() + 1) % 12
  })

  it('should be able to list the month availability from provider', async () => {
    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 8, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 9, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 10, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 11, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 12, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 13, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 14, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 15, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 16, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 20, 17, 0, 0),
    })

    await inMemoryAppointmentsRepository.create({
      provider_id: 'user',
      user_id: '12345',
      date: new Date(nextYear, nextMonth, 21, 8, 0, 0),
    })

    const availability = await listProvidersMonthAvailability.execute({
      provider_id: 'user',
      year: 2024,
      month: 11,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ])
    )
  })
})
