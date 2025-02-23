import { addHours, isAfter } from 'date-fns'

import { IUsersRepository } from '../repositories/interfaces/IUserRepository'
import { IUserTokensRepository } from '../repositories/interfaces/IUserTokensRepository'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import AppError from '@shared/errors/AppError'

import { inject, injectable } from 'tsyringe'

interface IRequest {
  password: string
  token: string
}

@injectable()
export class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User token does not exists')
    }

    const user = await this.usersRepository.findOneById(userToken.user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    const tokenCreatedAt = userToken.created_at

    const compareDate = addHours(tokenCreatedAt, 2)

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired')
    }

    user.password = await this.hashProvider.generateHash(password)

    await this.usersRepository.save(user)
  }
}
