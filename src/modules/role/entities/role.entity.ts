import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities';

@Entity('tbl_tdk_role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  clm_id: number;

  @Column({ unique: true })
  clm_name: string;

  @Column({ unique: true })
  clm_key: string;

  @Column()
  clm_description: string;

  @Column({ unique: true })
  clm_hierarchy: number;

  @Column()
  clm_is_active: boolean;

  @Column()
  clm_created_at: Date;

  @Column()
  clm_updated_at: Date;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
