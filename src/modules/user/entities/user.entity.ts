import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from 'src/modules/role/entities';
import { CompanyEntity } from 'src/modules/company/entities';
import { Exclude } from 'class-transformer';
import { RestaurantEntity } from 'src/modules/restaurant/entities';

@Entity('tbl_tdk_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  clm_id: number;

  @Column()
  clm_id_company: number;

  @Column()
  clm_id_role: number;

  @Column()
  clm_favolite_restaurant: number;

  @Column()
  clm_name: string;

  @Column({ unique: true })
  clm_username: string;

  @Column()
  clm_email: string;

  @Column()
  @Exclude()
  clm_password: string;

  @Column()
  clm_is_active: boolean;

  @Column()
  clm_created_at: Date;

  @Column()
  clm_updated_at: Date;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'clm_id_role' })
  role: RoleEntity;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.usersFavorite)
  @JoinColumn({ name: 'clm_favolite_restaurant' })
  restaurantFavorite: RestaurantEntity;

  @ManyToOne(() => CompanyEntity, (company) => company.users)
  @JoinColumn({ name: 'clm_id_company' })
  company: CompanyEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
