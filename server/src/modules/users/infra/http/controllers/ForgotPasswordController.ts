import { Request, Response } from 'express'
import { SendForgotPasswordEmailService } from '@modules/users/services/SendForgotPasswordEmailService'
import { container } from 'tsyringe'

export class ForgotPasswordController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService
    )

    await sendForgotPasswordEmail.execute({
      email,
    })

    return response.status(204).json()
  }
}
