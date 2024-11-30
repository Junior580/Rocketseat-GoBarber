import { Request, Response } from 'express'
import { instanceToInstance } from 'class-transformer'
import { UpdateUserAvatarService } from '@modules/users/services/UpdateUserAvatarService'
import { container } from 'tsyringe'

export class UpdateUserAvatarController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService)

    const user = await updateUserAvatar.execute({
      user_id: req.user.id,
      avatarFilename: req.file?.filename,
    })

    return res.json({ user: instanceToInstance(user) })
  }
}
