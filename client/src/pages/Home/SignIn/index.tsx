import React, { useCallback, useState } from 'react'

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import LogoImg from '../../../assets/logo.svg'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '../../../components/Input'
import { Button } from '../../../components/Button'

import { Container, Content, AnimationContainer, Background } from './styles'

import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../../hooks/toast'
import { useAuth } from '../../../hooks/auth'

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type SignInSchemaType = z.infer<typeof SignInSchema>

export const SignIn: React.FC = () => {
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit: SubmitHandler<SignInSchemaType> = useCallback(
    async data => {
      setIsLoading(true);
      try {
        await signIn({
          email: data.email,
          password: data.password,
        });
        navigate('/dashboard')
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu erro ao fazer login, cheque credenciais',
        });
      } finally {
        setIsLoading(false);
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
              <h1>Faça seu logon</h1>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    icon={FiMail}
                    placeholder="Email"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    icon={FiLock}
                    onChange={onChange}
                    value={value}
                    type="password"
                    placeholder="Senha"
                    error={errors.password?.message}
                  />
                )}
              />

              <Button type="submit" loading={isLoading}>
                Entrar
              </Button>

              <Link to="/forgot-password">Esqueci minha senha</Link>
            </form>

            <Link to="/signup">
              <FiLogIn />
              Criar conta
            </Link>
          </AnimationContainer>
        </Content>

        <Background />
      </Container>
    </>
  )
}
