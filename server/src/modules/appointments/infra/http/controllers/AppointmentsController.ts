import { Request, Response } from 'express'

import { CreateAppointmentService } from '@modules/appointments/services/CreateAppointmentService'
import { container } from 'tsyringe'

export class AppointmentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id

    const { provider_id, date } = request.body
    //exemplo de formato recebido pelo insomina: "date": "2023-03-21 13:00:00"

    const createAppointment = container.resolve(CreateAppointmentService)

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    })

    return response.json(appointment)
  }
}
