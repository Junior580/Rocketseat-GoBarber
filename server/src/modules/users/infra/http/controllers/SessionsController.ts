import { Request, Response } from 'express'

import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService'
import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'

export default class SessionsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body
    const authenticateUser = container.resolve(AuthenticateUserService)

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    })

    return response.json({ user: instanceToInstance(user), token })
  }
}
