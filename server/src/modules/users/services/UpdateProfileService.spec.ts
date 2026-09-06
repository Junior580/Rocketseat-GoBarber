import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { UpdateProfileService } from './UpdateProfileService'
import { InMemoryHashProvider } from '../providers/HashProvider/inMemory/InMemoryHashProvider'

import AppError from '../../../shared/errors/AppError'

let ineMemoryUsersRepository: InMemoryUserRepository
let updateProfile: UpdateProfileService
let inMemoryHashProvider: InMemoryHashProvider

describe('update users', () => {
  beforeEach(async () => {
    ineMemoryUsersRepository = new InMemoryUserRepository()
    inMemoryHashProvider = new InMemoryHashProvider()

    updateProfile = new UpdateProfileService(
      ineMemoryUsersRepository,
      inMemoryHashProvider
    )
  })

  it('should be able to update the profile', async () => {
    const user = await ineMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'user111',
      email: 'user1@email11.com',
    })

    expect(updatedUser.name).toBe('user111')
    expect(updatedUser.email).toBe('user1@email11.com')
  })

  it('should not be able to change to another user email', async () => {
    await ineMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    const user = await ineMemoryUsersRepository.create({
      name: 'user2',
      email: 'user2@email.com',
      password: '123456',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'user111',
        email: 'user1@email.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await ineMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'user1',
      email: 'user1@email.com',
      old_password: '123456',
      password: '67891',
    })

    expect(updatedUser.password).toBe('67891')
  })

  it('should not be able to update the password without old password', async () => {
    const user = await ineMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '12356',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'user1',
        email: 'user1@email.com',
        password: '12356',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with wrong old password', async () => {
    const user = await ineMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '123',
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'user1',
        email: 'user1@email.com',
        old_password: 'wrongOldPassword',
        password: '456',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'c87a8d7ac65549f9bd2716163952885b',
        name: 'Test',
        email: 'test@teste.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
