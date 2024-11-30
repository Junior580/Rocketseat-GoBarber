import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { CreateUserService } from '../services/CreateUserService'
import { DeleteUserService } from '../services/DeleteUserService'
import { InMemoryHashProvider } from '../providers/HashProvider/inMemory/InMemoryHashProvider'
import { InMemoryCacheProvider } from '@shared/container/providers/CacheProvider/inMemory/InMemoryCacheProvider'

import AppError from '../../../shared/errors/AppError'

let fakeUsersRepository: InMemoryUserRepository
let deleteUser: DeleteUserService
let createUser: CreateUserService
let inMemoryHashProvider: InMemoryHashProvider
let memoryCacheProvider: InMemoryCacheProvider

describe('delete users', () => {
  beforeEach(async () => {
    fakeUsersRepository = new InMemoryUserRepository()
    inMemoryHashProvider = new InMemoryHashProvider()
    memoryCacheProvider = new InMemoryCacheProvider()

    createUser = new CreateUserService(
      fakeUsersRepository,
      inMemoryHashProvider,
      memoryCacheProvider
    )
    deleteUser = new DeleteUserService(fakeUsersRepository)
  })

  it('should be able to delete an existing user', async () => {
    await createUser.execute({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    const userID = fakeUsersRepository.users[0].id

    const user = await deleteUser.execute(userID)

    expect(user).toBe(undefined)
  })

  it('should not able to delete if user does not exists', async () => {
    await expect(deleteUser.execute('nonExistentID')).rejects.toBeInstanceOf(
      AppError
    )
  })
})
