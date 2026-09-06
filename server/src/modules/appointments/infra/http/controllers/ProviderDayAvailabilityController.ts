import { Request, Response } from 'express'
import { ListProviderDayAvailabilityService } from '@modules/appointments/services/ListProviderDayAvailabilityService'

import { container } from 'tsyringe'

export class ProviderDayAvailabilityController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params
    const { month, year, day } = request.query

    const listDayProvider = container.resolve(
      ListProviderDayAvailabilityService
    )

    const providers = await listDayProvider.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    })

    return response.json(providers)
  }
}
