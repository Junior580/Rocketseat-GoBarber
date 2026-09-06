import AppError from '../../../shared/errors/AppError'

import { InMemoryMailProvider } from '@shared/container/providers/MailProvider/inMemory/InMemoryMailProvider'
import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { SendForgotPasswordEmailService } from './SendForgotPasswordEmailService'
import { InMemoryUserTokensRepository } from '../repositories/inMemory/InMemoryUserTokensRepository'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryMailProvider: InMemoryMailProvider
let inMemoryUserTokensRepository: InMemoryUserTokensRepository
let sendForgotPasswordEmailService: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryMailProvider = new InMemoryMailProvider()
    inMemoryUserTokensRepository = new InMemoryUserTokensRepository()
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      inMemoryUserRepository,
      inMemoryMailProvider,
      inMemoryUserTokensRepository
    )
  })

  it('should be able recover the password using the email', async () => {
    const sendMail = jest.spyOn(inMemoryMailProvider, 'sendMailMessage')

    await inMemoryUserRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: 'teste123',
    })

    await sendForgotPasswordEmailService.execute({ email: 'user1@email.com' })
    expect(sendMail).toHaveBeenCalled()
  })

  it('should not be able to reacover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: 'user@email.com' })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(inMemoryUserTokensRepository, 'generate')

    const user = await inMemoryUserRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: 'teste123',
    })

    await sendForgotPasswordEmailService.execute({ email: 'user1@email.com' })
    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
