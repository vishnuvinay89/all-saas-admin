import { get, post } from "./RestClient";
export interface StateListParam {
  limit?: number;
  //  page: number;

  fieldName?: any;
  sort?: object;
  offset?: number;
}
export interface CenterListParam {
  limit?: number;

  filters?: any;
  offset?: number;
}
export const getStateBlockDistrictList = async ({
  fieldName,
}: StateListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read`;
  try {
    const response = await post(apiUrl, {
      fieldName,
    });
    return response?.data;
  } catch (error) {
    console.error("error in fetching user details", error);
    return error;
  }
};
// services/MasterDataService.ts
export const getDistrictsForState = async ({
  controllingfieldfk,
  fieldName,
}: {
  controllingfieldfk: string;
  fieldName: string;
}): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read`;
  try {
    const response = await post(apiUrl, {
      controllingfieldfk,
      fieldName,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching district data", error);
    return error;
  }
};

export const getCenterList = async ({
  filters,
  limit,
  offset,
}: CenterListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/search`;
  try {
    const response = await post(apiUrl, {
      filters,
      limit,
      offset,
    });
    return response?.data;
  } catch (error) {
    console.error("error in fetching user details", error);
    return error;
  }
};

export const getDistrictList = async (
  state?: string | string[]
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
  district?: string | string[]
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
