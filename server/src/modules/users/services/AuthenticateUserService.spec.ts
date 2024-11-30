import AppError from '../../../shared/errors/AppError'
import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { CreateUserService } from '../services/CreateUserService'
import { AuthenticateUserService } from './AuthenticateUserService'
import { InMemoryHashProvider } from '../providers/HashProvider/inMemory/InMemoryHashProvider'
import { InMemoryCacheProvider } from '@shared/container/providers/CacheProvider/inMemory/InMemoryCacheProvider'

let fakeUsersRepository: InMemoryUserRepository
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService
let inMemoryHashProvider: InMemoryHashProvider
let memoryCacheProvider: InMemoryCacheProvider

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new InMemoryUserRepository()
    inMemoryHashProvider = new InMemoryHashProvider()
    memoryCacheProvider = new InMemoryCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      inMemoryHashProvider,
      memoryCacheProvider
    )
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      inMemoryHashProvider
    )
  })

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    const response = await authenticateUser.execute({
      email: 'user1@email.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not authenticate with a non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'user1@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    await expect(
      authenticateUser.execute({
        email: 'user1@email.com',
        password: 'wrongPass',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
