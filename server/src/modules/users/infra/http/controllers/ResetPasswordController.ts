import { Request, Response } from 'express'

import { ResetPasswordService } from '@modules/users/services/ResetPasswordService'

import { container } from 'tsyringe'

export class ResetPasswordController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body

    const resetPasswordService = container.resolve(ResetPasswordService)

    await resetPasswordService.execute({
      password,
      token,
    })

    return response.status(204).json()
  }
}
