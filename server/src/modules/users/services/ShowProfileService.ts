import { IUsersRepository } from '../repositories/interfaces/IUserRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

interface IShowProfileRequest {
  user_id: string
}

@injectable()
export class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IShowProfileRequest) {
    const user = await this.usersRepository.findOneById(user_id)

    if (!user) {
      throw new AppError('User not found.', 401)
    }

    return user
  }
}
