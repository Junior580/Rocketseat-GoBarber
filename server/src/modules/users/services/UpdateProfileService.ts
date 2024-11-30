import { User } from '../infra/typeorm/entities/Users'
import { IUsersRepository } from '../repositories/interfaces/IUserRepository'
import AppError from '@shared/errors/AppError'
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider'
import { inject, injectable } from 'tsyringe'

interface IUpdateProfileRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}

type IUpdateProfileResponse = User

@injectable()
export class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IUpdateProfileRequest): Promise<IUpdateProfileResponse> {
    const user = await this.usersRepository.findOneById(user_id)

    if (!user) {
      throw new AppError('User not found.', 401)
    }

    const userWithUpdatedEmail = await this.usersRepository.findOneByEmail(
      email
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.')
    }

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.'
      )
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      )

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.')
      }
      user.password = await this.hashProvider.generateHash(password)
    }

    await this.usersRepository.save(user)

    return user
  }
}
