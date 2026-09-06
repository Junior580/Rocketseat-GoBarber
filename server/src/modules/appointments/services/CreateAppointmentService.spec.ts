import AppError from '@shared/errors/AppError'
import { InMemoryAppointmentsRepository } from '../repositories/inMemory/inMemoryAppointmentsRepository'
import { CreateAppointmentService } from './CreateAppointmentService'
import { InMemoryNotificationsRepository } from '@modules/notifications/repositories/inMemory/InMemoryNotificationsRepository'
import { InMemoryCacheProvider } from '@shared/container/providers/CacheProvider/inMemory/InMemoryCacheProvider'

let createAppointment: CreateAppointmentService
let inMemoryAppointmentRepository: InMemoryAppointmentsRepository
let notificationsRepository: InMemoryNotificationsRepository
let memoryCacheProvider: InMemoryCacheProvider
let nextYear: number
let nextMonth: number

describe('CreateAppointment', () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentsRepository()
    notificationsRepository = new InMemoryNotificationsRepository()
    memoryCacheProvider = new InMemoryCacheProvider()
    createAppointment = new CreateAppointmentService(
      inMemoryAppointmentRepository,
      notificationsRepository,
      memoryCacheProvider
    )
  })

  beforeAll(() => {
    const currentDate = new Date()
    nextYear =
      currentDate.getFullYear() + Math.floor((currentDate.getMonth() + 1) / 12)
    nextMonth = (currentDate.getMonth() + 1) % 12
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 4, 10, 12).getTime()
    })
    const appointment = await createAppointment.execute({
      date: new Date(2023, 4, 10, 13),
      user_id: 'user1',
      provider_id: 'user2',
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('user2')
  })

  it('should be not able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(nextYear, nextMonth, 10, 11)

    await createAppointment.execute({
      // Cria um novo agendamento com uma data setada acima
      date: appointmentDate,
      user_id: 'user1',
      provider_id: 'user2',
    })

    await expect(
      createAppointment.execute({
        date: appointmentDate, // Cria um segundo agendamento na mesma data
        user_id: 'user1',
        provider_id: 'user2',
      })
    ).rejects.toBeInstanceOf(AppError) // deve retornar um erro (rejects) do tipo do AppError
  })

  it('should not be able to create an appointment on a past date', async () => {
    const appointmentDate = new Date() // Data atual
    appointmentDate.setHours(11) // Hora do agendamento
    appointmentDate.setDate(appointmentDate.getDate() + 2) // Adiciona 2 dias

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(appointmentDate).getTime()
    })

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user1',
        provider_id: 'user2',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2023, 6, 20, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2023, 6, 20, 13),
        provider_id: 'user1id',
        user_id: 'user1id',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // mocka a data/hora para este periodo abaixo,assim os testes ocorrem apos isso
      return new Date(2023, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2023, 4, 11, 7),
        provider_id: 'user2',
        user_id: 'user1',
      })
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        date: new Date(2023, 4, 11, 18),
        provider_id: 'user2',
        user_id: 'user1',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
