import { Repository } from 'typeorm'
import { IUserTokensRepository } from '../../../repositories/interfaces/IUserTokensRepository'
import { AppDataSource } from '../../../../../shared/infra/typeorm/data-source'
import { UserToken } from '../entities/UserToken'

export class UserTokenRepository implements IUserTokensRepository {
  private userTokensRepository: Repository<UserToken>

  constructor() {
    this.userTokensRepository = AppDataSource.getRepository(UserToken)
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = await this.userTokensRepository.create({ user_id })

    await this.userTokensRepository.save(userToken)

    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await this.userTokensRepository.findOneBy({ token })

    return userToken
  }
}
