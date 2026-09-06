import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity('notifications')
export class Notification {
  @ObjectIdColumn()
  id: ObjectID

  @Column()
  content: string

  @Column()
  recipient_id: string

  @Column({ default: false })
  read: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  constructor() {
    if (!this.recipient_id) {
      this.recipient_id = uuid().toUpperCase()
    }
  }
}
