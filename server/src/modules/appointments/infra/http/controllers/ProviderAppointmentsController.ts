import { Request, Response } from 'express'

import { ListProviderAppointmentsService } from '@modules/appointments/services/ListProviderAppointmentsService'
import { instanceToInstance } from 'class-transformer'
import { container } from 'tsyringe'

export class ProviderAppointmentsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id

    const { day, month, year } = request.query

    const listAppointmentService = container.resolve(
      ListProviderAppointmentsService
    )

    const appointments = await listAppointmentService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    })

    return response.json(instanceToInstance(appointments))
  }
}
