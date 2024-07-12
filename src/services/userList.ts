import { post } from "./RestClient";
import { get } from "./RestClient";

export interface userListParam {
    limit: number;
  //  page: number;
    filters: {
      role: string;
    };
    sort?: object;
    offset:number
  }
  

  export const userList = async ({
    limit,
  //  page,
    filters,
    sort,
    offset
  }: userListParam): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/list`;
    try {
      const response = await post(apiUrl, { limit, filters, sort , offset});
      return response?.data?.result;
    } catch (error) {
      console.error('error in getting cohort list', error);
      throw error;
    }
  };
  

  export const getCohortList = async (
    userId: string | string[],
   
  ): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/mycohorts/${userId}`;
    try {
      const response = await get(apiUrl);
      return response?.data;
    } catch (error) {
      console.error('error in fetching user details', error);
      return error;
    }
  };
  