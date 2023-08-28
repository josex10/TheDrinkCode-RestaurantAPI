import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantEntity } from 'src/modules/restaurant/entities';
import { UserEntity } from 'src/modules/user/entities';

@Entity('tbl_tdk_company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  clm_id: number;

  @Column()
  clm_country: string;

  @Column({ unique: true })
  clm_company_name: string;

  @Column()
  clm_phone: string;

  @Column({ unique: true })
  clm_email: string;

  @Column()
  clm_address: string;

  @Column()
  clm_is_active: boolean;

  @Column()
  clm_created_at: Date;

  @Column()
  clm_updated_at: Date;

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.company)
  restaurants: RestaurantEntity[];

  @OneToMany(() => UserEntity, (user) => user.company)
  users: UserEntity[];
}
