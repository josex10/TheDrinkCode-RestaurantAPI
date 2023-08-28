export interface IRestaurant {
  clm_id: number;
  clm_id_company: number;
  clm_name: string;
  clm_phone?: string;
  clm_email?: string;
  clm_address?: string;
  clm_is_active: boolean;
  clm_created_at: Date;
  clm_updated_at: Date;
}
