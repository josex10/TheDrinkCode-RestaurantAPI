import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from 'src/modules/company/entities';
import { UserEntity } from 'src/modules/user/entities';
@Entity('tbl_tdk_restaurant')
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  clm_id: number;

  @Column()
  clm_id_company: number;

  @Column({ unique: true })
  clm_name: string;

  @Column()
  clm_phone: string;

  @Column()
  clm_email: string;

  @Column()
  clm_address?: string;

  @Column()
  clm_is_active: boolean;

  @Column()
  clm_created_at: Date;

  @Column()
  clm_updated_at: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.restaurants)
  @JoinColumn({ name: 'clm_id_company' })
  company: CompanyEntity;

  @OneToMany(() => UserEntity, (user) => user.restaurantFavorite)
  usersFavorite: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];
}
