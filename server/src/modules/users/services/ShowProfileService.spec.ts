import { InMemoryUserRepository } from '../repositories/inMemory/InMemoryUserRepository'
import { ShowProfileService } from './ShowProfileService'

import AppError from '../../../shared/errors/AppError'

let inMemoryUsersRepository: InMemoryUserRepository
let showUser: ShowProfileService

describe('Get users', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUserRepository()
    showUser = new ShowProfileService(inMemoryUsersRepository)
  })
  it('should be able to show the profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: '123456',
    })

    const profile = await showUser.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('user1')
    expect(profile.email).toBe('user1@email.com')
  })

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showUser.execute({
        user_id: 'c87a8d7ac65549f9bd2716163952885b',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
