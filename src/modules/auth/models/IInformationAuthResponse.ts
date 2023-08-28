import { IRestaurantAuthResponse } from './';

export interface IInformationAuthResponse {
  user_id: number;
  user_name: string;
  selected_restaurant: number;
  company_id: number;
  company_name: string;
  restaurants: IRestaurantAuthResponse[];
  role_id: number;
  role_name: string;
  role_key: string;
}
