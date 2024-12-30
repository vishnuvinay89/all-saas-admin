import axios from "axios";
import { post, get } from "./RestClient";
import config from "@/utils/urlConstants.json";
export interface userListParam {
  limit?: number;
  //  page: number;
  filters: {
    role?: string;
    status?: string;
    // states?: string;
    // districts?: string;
    // blocks?: string;
  };
  fields?: any;
  sort?: object;
  offset?: number;
}
export interface learnerListParam {
  payload: any;
  tenantId:string
}

export const userList = async ({
  payload,
  tenantId,
}: learnerListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.LIST}`;
    
  try {
    const token=localStorage.getItem('token')

    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'tenantid': tenantId, 
      },
    });

    return response?.data?.result;
  } catch (error) {
    console.error('Error in getting user list', error);
    throw error;
  }
};

export const cohortMemberList = async ({
  limit,
  //  page,
  filters,
  sort,
  offset,
  fields,
}: userListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_MEMBER}`;
  try {
    const response = await post(apiUrl, {
      limit,
      filters,
      sort,
      offset,
      fields,
    });
    return response?.data?.result;
  } catch (error) {
    console.error("error in getting user list", error);
    throw error;
  }
};

export const getUserDetailsInfo = async (
  userId?: string | string[],
  fieldValue: boolean = true
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.READ}/${userId}?fieldvalue=${fieldValue}`;
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    return error;
  }
};
