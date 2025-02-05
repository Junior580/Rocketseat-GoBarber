import React, { useCallback, useState } from 'react'
import { FiLogIn, FiLock } from 'react-icons/fi'
import LogoImg from '../../../assets/logo.svg'

import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Container, Content, AnimationContainer, Background } from './styles'

import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../../../services/api'
import { useToast } from '../../../hooks/toast'

const ResetPassSchema = z
  .object({
    password: z.string().min(6),
    password_confirmation: z.string().min(6),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'],
  })

type ResetPassSchemaType = z.infer<typeof ResetPassSchema>

export const ResetPassword: React.FC = () => {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassSchemaType>({
    resolver: zodResolver(ResetPassSchema),
    defaultValues: { password: '', password_confirmation: '' },
  })

  const onSubmit: SubmitHandler<ResetPassSchemaType> = useCallback(
    async data => {
      try {
        setIsLoading(true)
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password: data.password,
          password_confirmation: data.password_confirmation,
          token,
        });
        navigate('/')
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description:
            'Ocorreu um erro ao resetar sua senha, verifique suas credenciais',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={LogoImg} alt="GoBarber" />

            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Resetar senha</h1>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    icon={FiLock}
                    type="password"
                    placeholder="Senha"
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password_confirmation"
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    icon={FiLock}
                    type="password"
                    placeholder="Confirmação da senha"
                    error={errors.password_confirmation?.message}
                  />
                )}
              />

              <Button type="submit" loading={isLoading}>Alterar senha</Button>
            </form>

            <Link to="/">
              <FiLogIn />
              Voltar ao login
            </Link>
          </AnimationContainer>
        </Content>

        <Background />
      </Container>
    </>
  )
}
