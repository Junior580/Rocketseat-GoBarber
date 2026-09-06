import AppError from '@shared/errors/AppError'
import { User } from '@modules/users/infra/typeorm/entities/Users'
import { IUsersRepository } from '@modules/users/repositories/interfaces/IUserRepository'
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import { instanceToInstance } from 'class-transformer'

import { inject, injectable } from 'tsyringe'

interface IListProvidersRequest {
  user_id: string
}

type IListProvidersResponse = User[]

@injectable()
export class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    user_id,
  }: IListProvidersRequest): Promise<IListProvidersResponse> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list: ${user_id}`
    )

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        expect_user_id: user_id,
      })

      await this.cacheProvider.save(
        `providers-list: ${user_id}`,
        instanceToInstance(users)
      )
    }

    if (!users) {
      throw new AppError('User not found')
    }

    return users
  }
}
