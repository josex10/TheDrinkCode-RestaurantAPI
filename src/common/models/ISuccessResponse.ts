export interface IResponseSuccess {
  successResponse: IResponseSuccessBody;
}
interface IResponseSuccessBody {
  timestamp: Date;
  path: string;
  data: any;
  code: number;
  messageCode: string;
}
