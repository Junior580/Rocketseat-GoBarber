import { InMemoryUserRepository } from '@modules/users/repositories/inMemory/InMemoryUserRepository'
import { ListProvidersService } from './ListProvidersService'
import { InMemoryCacheProvider } from '@shared/container/providers/CacheProvider/inMemory/InMemoryCacheProvider'

let inMemoryUsersRepository: InMemoryUserRepository
let listProviders: ListProvidersService
let memoryCacheProvider: InMemoryCacheProvider

describe('List Providers', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUserRepository()
    memoryCacheProvider = new InMemoryCacheProvider()
    listProviders = new ListProvidersService(
      inMemoryUsersRepository,
      memoryCacheProvider
    )
  })

  it('should be able to list the providers', async () => {
    const user1 = await inMemoryUsersRepository.create({
      name: 'user1',
      email: 'user1@email.com',
      password: 'teste123',
    })

    const user2 = await inMemoryUsersRepository.create({
      name: 'user2',
      email: 'user2@email.com',
      password: 'teste123',
    })

    const loggedUser = await inMemoryUsersRepository.create({
      name: 'user3',
      email: 'user3@email.com',
      password: 'teste123',
    })

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([user1, user2])
  })
})
