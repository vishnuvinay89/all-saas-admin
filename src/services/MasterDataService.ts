import { get, post } from "./RestClient";
export interface StateListParam {
  limit?: number;
  //  page: number;
 
  fieldName?: any;
  sort?: object;
  offset?: number;
}
export const getStateBlockDistrictList = async (  {
  
  fieldName}:StateListParam,): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read`;
  try {
    const response = await post(apiUrl,{
      fieldName});
    return response?.data;
  } catch (error) {
    console.error("error in fetching user details", error);
    return error;
  }
};

export const getDistrictList = async (
  state?: string | string[],
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read/districts`;

  if (state) {
    apiUrl += `?controllingfieldfk=${state}&context=USERS`;
  }

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error("error in fetching district list", error);
    return error;
  }
};

export const getBlockList = async (
  district?: string | string[],
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read/blocks`;

  if (district) {
    apiUrl += `?controllingfieldfk=${district}&context=USERS`;
  }

  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error("error in fetching block list", error);
    return error;
  }
};
