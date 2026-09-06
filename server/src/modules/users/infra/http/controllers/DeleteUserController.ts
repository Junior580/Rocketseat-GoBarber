import { Request, Response } from 'express'
import { DeleteUserService } from '../../../services/DeleteUserService'
import { container } from 'tsyringe'

export class DeleteUserController {
  public async handle(req: Request, res: Response) {
    const { id } = req.params

    const user = container.resolve(DeleteUserService)

    await user.execute(id)

    return res.status(200).json('User has been deleted.')
  }
}
