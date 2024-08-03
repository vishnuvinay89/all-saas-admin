import { deleteApi, patch, post } from "./RestClient";
export interface StateListParam {
  limit?: number;
  //  page: number;
  controllingfieldfk?: any;
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
  controllingfieldfk,
  fieldName,
  limit,
  optionName,
  sortBy,
}: {
  controllingfieldfk?: string;
  fieldName: string;
  limit?: number;
  optionName?: string;
  sortBy?: any;
}): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read`;
  try {
    const requestBody: {
      fieldName: string;
      controllingfieldfk?: string;
      optionName?: string;
      sort?: any;
    } = {
      fieldName,
    };

    if (controllingfieldfk) {
      requestBody.controllingfieldfk = controllingfieldfk;
    }

    if (optionName) {
      requestBody.optionName = optionName; // Use optionName for search
    }
    if (sortBy) {
      requestBody.sort = sortBy; // Use optionName for search
    }

    console.log("requestBody", requestBody);
    const response = await post(apiUrl, requestBody);
    return response?.data;
  } catch (error) {
    console.error("error in fetching user details", error);
    return error;
  }
};

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

export const getBlocksForDistricts = async ({
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

export const deleteOption = async (
  type: "states" | "districts" | "blocks",
  option: string,
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/delete/${type}?option=${option}`;
  const requestBody = {};
  const requestHeaders = {};

  try {
    const response = await deleteApi(apiUrl, requestBody, requestHeaders);
    return response?.data;
  } catch (error) {
    console.error(`Error deleting ${type}`, error);
    return error;
  }
};

export const createOrUpdateOption = async (
  fieldId: string,
  fieldParams: { options: { name: string; value: string }[] },
  stateId?: string,
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/update/${fieldId}`;

  if (stateId) {
    try {
      const response = await patch(apiUrl, { fieldParams, stateId });
      return response?.data;
    } catch (error) {
      console.error("Error updating state", error);
      return error;
    }
  } else {
    try {
      const response = await patch(apiUrl, { fieldParams });
      return response?.data;
    } catch (error) {
      console.error("Error creating state", error);
      return error;
    }
  }
};
