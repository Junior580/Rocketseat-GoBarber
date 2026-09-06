import ISendMailDTO from '../dtos/ISendMailDTO'
import IMailProvider from '../models/IMailProvider'

export class InMemoryMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = []
  public async sendMailMessage({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    this.messages.push({
      to,
      from,
      subject,
      templateData,
    })
  }
}
