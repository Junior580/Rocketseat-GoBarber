import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import { ShowProfileController } from '../controllers/ShowProfileController'
import { UpdateProfileController } from '../controllers/UpdateProfileController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

export const profileRouter = Router()
const showUserController = new ShowProfileController()
const updateProfileController = new UpdateProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', showUserController.handle)
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  updateProfileController.handle
)
