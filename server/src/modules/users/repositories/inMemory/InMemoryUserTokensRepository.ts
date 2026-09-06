import { v4 as uuid } from 'uuid'
import { IUserTokensRepository } from '../interfaces/IUserTokensRepository'
import { UserToken } from '@modules/users/infra/typeorm/entities/UserToken'

export class InMemoryUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = []

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    })

    this.userTokens.push(userToken)

    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token
    )

    return userToken || null
  }
}
