import { WithIdAndTimestampEntity } from 'src/common/entities/with-id-and-timestamp.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends WithIdAndTimestampEntity {
  @Column({ name: 'email', type: 'varchar', length: 50 })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;
}
