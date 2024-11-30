import { Request, Response } from 'express'
import { CreateUserService } from '../../../services/CreateUserService'
import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'

export class CreateUserController {
  public async handle(req: Request, res: Response) {
    const { name, email, password } = req.body

    const createUser = container.resolve(CreateUserService)

    const user = await createUser.execute({ name, email, password })

    return res.json({ user: instanceToInstance(user) })
  }
}
