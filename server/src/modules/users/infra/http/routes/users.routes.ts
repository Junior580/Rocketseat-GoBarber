import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import { CreateUserController } from '../controllers/CreateUserController'
import { DeleteUserController } from '../controllers/DeleteUserController'
import { UpdateUserAvatarController } from '../controllers/UserAvatarController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import multer from 'multer'
import uploadConfig from '@config/upload'

const upload = multer(uploadConfig.multer)

export const usersRoutes = Router()

const createUserController = new CreateUserController()
const deleteUserController = new DeleteUserController()
const userAvatarController = new UpdateUserAvatarController()

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  createUserController.handle
)

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.handle
)

usersRoutes.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  deleteUserController.handle
)
