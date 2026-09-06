import { Request, Response } from 'express'
import { ListProviderMonthAvailabilityService } from '@modules/appointments/services/ListProviderMonthAvailabilityService'

import { container } from 'tsyringe'

export class ProviderMonthAvailabilityController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params
    const { month, year } = request.query

    const listMonthProvider = container.resolve(
      ListProviderMonthAvailabilityService
    )

    const providers = await listMonthProvider.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    })

    return response.json(providers)
  }
}
