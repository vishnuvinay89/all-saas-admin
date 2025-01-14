import { get, post, patch } from "./RestClient";
import { createUserParam } from "../utils/Interfaces";
import axios from "axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import config from "@/utils/urlConstants.json"
export interface UserDetailParam {
  userData?: {
    name: any;
    role: any;
    userId: any;
    username: any;
    mobileNo: any;
    email: any;
    status: string;
  };
  customFields?: any;
}

export const getFormRead = async (
  context: string,
  contextType: string,
): Promise<any> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.FORM_READ}`,
      {
        params: {
          context,
          contextType,
        },
        paramsSerializer: (params) => {
          return Object.entries(params)
            ?.map(([key, value]) => `${key}=${value}`)
            .join("&");
        },
        headers: { tenantId: "ef99949b-7f3a-4a5f-806a-e67e683e38f3" },
      },
    );

    const sortedFields = response?.data?.result.fields?.sort(
      (a: { order: string }, b: { order: string }) =>
        parseInt(a.order) - parseInt(b.order),
    );
    const formData = {
      formid: response?.data?.result?.formid,
      title: response?.data?.result?.title,
      fields: sortedFields,
    };
    return formData;
  } catch (error) {
    console.error("error in getting cohort details", error);
    // throw error;
  }
};


export const createUser = async (userData: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.CREATE}`;
  try {
    const response = await post(apiUrl, userData);
    return response?.data;
  } catch (error) {
    console.error('error in getting cohort list', error);
    // throw error;
  }
};

export const updateUser = async (
  userId: string,
  userData: any,
  tenantId: string
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.UPDATE}/${userId}`;

  try {
    const token = localStorage.getItem('token');

    const response = await axios.patch(apiUrl, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'tenantId': tenantId,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error updating user details", error);
    throw error;
  }
};

