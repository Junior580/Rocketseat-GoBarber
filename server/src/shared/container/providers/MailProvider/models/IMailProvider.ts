import ISendMailDTO from '../dtos/ISendMailDTO'

export default interface IMailProvider {
  sendMailMessage(data: ISendMailDTO): Promise<void>
}
