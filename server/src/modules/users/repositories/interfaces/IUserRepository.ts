import { User } from '../../infra/typeorm/entities/Users'
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO'
import { IFindAllProvidersDTO } from '@modules/users/dtos/IFindAllProvidersDTO'

export interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>
  findOneByEmail(email: string): Promise<User | null>
  create({ name, email, password }: ICreateUserDTO): Promise<User>
  findAll(): Promise<User[]>
  findOneById(id: string): Promise<User | null>
  save(user: User): Promise<User>
  delete(id: string): void
}
