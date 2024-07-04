import { post } from "./RestClient";

export interface userListParam {
    limit: number;
    page: number;
    filters: {
      role: string;
    };
    sort: object
  }
  

  export const userList = async ({
    limit,
    page,
    filters,
    sort
  }: userListParam): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/list`;
    try {
      const response = await post(apiUrl, { limit, page, filters, sort });
      return response?.data?.result;
    } catch (error) {
      console.error('error in getting cohort list', error);
      throw error;
    }
  };
  