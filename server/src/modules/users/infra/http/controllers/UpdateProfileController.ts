import { Request, Response } from 'express'
import { UpdateProfileService } from '../../../services/UpdateProfileService'
import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'

export class UpdateProfileController {
  public async handle(req: Request, res: Response) {
    const user_id = req.user.id

    const { name, email, old_password, password } = req.body

    const updateUser = container.resolve(UpdateProfileService)

    const user = await updateUser.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    })

    return res.status(200).json({
      msg: 'User successfully updated!',
      user: instanceToInstance(user),
    })
  }
}
