import { Not, Repository } from 'typeorm'
import { AppDataSource } from '../../../../../shared/infra/typeorm/data-source'
import { User } from '../entities/Users'
import { IUsersRepository } from '../../../repositories/interfaces/IUserRepository'
import { ICreateUserDTO } from '../../../dtos/ICreateUserDTO'
import { IFindAllProvidersDTO } from '@modules/users/dtos/IFindAllProvidersDTO'

export class UsersRepository implements IUsersRepository {
  private userRepository: Repository<User>

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email })

    return user
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.userRepository.create({ name, email, password })

    await this.userRepository.save(user)

    return user
  }

  public async findAll(): Promise<User[]> {
    const user = await this.userRepository.find()

    return user
  }

  public async findOneById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id })

    return user || null
  }

  public async save(user: User): Promise<User> {
    const userUpdated = await this.userRepository.save(user)
    return userUpdated
  }

  public async findAllProviders({
    expect_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[]

    if (expect_user_id) {
      users = await this.userRepository.find({
        where: { id: Not(expect_user_id) },
      })
    } else {
      users = await this.userRepository.find()
    }

    return users
  }

  public async delete(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }
}
