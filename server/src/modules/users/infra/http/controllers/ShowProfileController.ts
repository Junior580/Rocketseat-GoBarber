import { Request, Response } from 'express'
import { ShowProfileService } from '../../../services/ShowProfileService'
import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'

export class ShowProfileController {
  public async handle(req: Request, res: Response) {
    const user_id = req.user.id

    const getUser = container.resolve(ShowProfileService)

    const user = await getUser.execute({ user_id })

    return res.json({ user: instanceToInstance(user) })
  }
}
