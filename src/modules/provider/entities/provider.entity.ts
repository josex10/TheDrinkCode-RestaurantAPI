import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompanyEntity } from 'src/modules/company/entities';

@Entity('tbl_tdk_provider')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  clm_id: number;

  @Column()
  clm_id_company: number;

  @Column({ nullable: true })
  clm_tax_number?: string;

  @Column()
  clm_name: string;

  @Column({ nullable: true })
  clm_phone?: string;

  @Column({ nullable: true })
  clm_email?: string;

  @Column({ nullable: true })
  clm_address?: string;

  @Column()
  clm_is_active: boolean;

  @Column()
  clm_created_at: Date;

  @Column()
  clm_updated_at: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.providers)
  @JoinColumn({ name: 'clm_id_company' })
  company: CompanyEntity;
}
