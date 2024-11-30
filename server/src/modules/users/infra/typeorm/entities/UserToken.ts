import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'
import { User } from './Users'

@Entity('user_token', { database: 'postgres' })
export class UserToken {
  @PrimaryColumn({ primary: true })
  id: string

  @Column()
  token: string

  @Column()
  user_id: string

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  tokenUser: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  constructor() {
    if (!this.id) {
      this.id = uuid().toUpperCase()
    }

    if (!this.token) {
      this.token = uuid().toUpperCase()
    }
  }
}
