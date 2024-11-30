// import AppError from '../../../shared/errors/AppError'

import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { InMemoryUserTokensRepository } from '../repositories/inMemory/InMemoryUserTokensRepository'
import { ResetPasswordService } from './ResetPasswordService'
import { InMemoryHashProvider } from '../providers/HashProvider/inMemory/InMemoryHashProvider'
import AppError from '@shared/errors/AppError'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryUserTokensRepository: InMemoryUserTokensRepository
let resetPasswordService: ResetPasswordService
let inMemoryhashProvider: InMemoryHashProvider

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryUserTokensRepository = new InMemoryUserTokensRepository()
    inMemoryhashProvider = new InMemoryHashProvider()
    resetPasswordService = new ResetPasswordService(
      inMemoryUserRepository,
      inMemoryUserTokensRepository,
      inMemoryhashProvider
    )
  })

  it('should be able recover the password using the email', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: 'teste123',
    })

    const updatedUser = await inMemoryUserRepository.findOneById(user.id)

    const { token } = await inMemoryUserTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(inMemoryhashProvider, 'generateHash')

    await resetPasswordService.execute({ password: '123teste123', token })

    expect(generateHash).toHaveBeenCalledWith('123teste123')
    expect(updatedUser?.password).toBe('123teste123')
  })

  it('should no be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'nonExistingToken',
        password: 'teste',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should no be able to reset the password with non-existing user', async () => {
    const { token } = await inMemoryUserTokensRepository.generate(
      'nonExistingUser'
    )
    await expect(
      resetPasswordService.execute({
        token,
        password: 'teste',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should no be able to reset the password f passed more than 2 hours', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: 'teste123',
    })

    const { token } = await inMemoryUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()

      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPasswordService.execute({ token, password: '123' })
    ).rejects.toBeInstanceOf(AppError)
  })
})
