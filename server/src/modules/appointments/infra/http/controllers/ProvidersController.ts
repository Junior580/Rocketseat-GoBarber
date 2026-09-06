import { Request, Response } from 'express'
import { ListProvidersService } from '../../../services/ListProvidersService'

import { container } from 'tsyringe'

export class ProvidersController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const listProviders = container.resolve(ListProvidersService)

    const providers = await listProviders.execute({ user_id })

    return response.json(providers)
  }
}
