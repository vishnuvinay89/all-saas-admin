import { CohortMemberList } from "@/utils/Interfaces";
import { deleteApi, get, patch, post, put } from "../RestClient";
import config  from "@/utils/urlConstants.json";
export interface cohortListFilter {
  type: string;
  status: string[];
  states: string;
  districts: string;
  blocks: string;
}

export interface cohortListData {
  limit?: string | number;
  offset?: Number;
  filter?: any;
  status?: any;
  type?:'cohort' ;
}
export interface UpdateCohortMemberStatusParams {
  memberStatus: string;
  statusReason?: string;
  membershipId: string | number;
}
export const getCohortList = async (data: cohortListData): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_SEARCH}`;
  try {
    const response = await post(apiUrl, data);
    return response?.data?.result;
  } catch (error) {
    console.error("Error in Getting cohort List Details", error);
    return error;
  }
};

export const updateCohortUpdate = async (
  userId: string,
  cohortDetails: any
): Promise<any> => {
  // const { name, status, type } = cohortDetails;
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_UPDATE}/${userId}`;

  try {
    const response = await put(apiUrl, cohortDetails);
    return response?.data;
  } catch (error) {
    console.error("Error in updating cohort details", error);
    throw error;
  }
};

export const getFormRead = async (
  context: string,
  contextType: string
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.FORM_READ}?context=${context}&contextType=${contextType}`;
  try {
    let response = await get(apiUrl);
    const sortedFields = response?.data?.result.fields?.sort(
      (a: { order: string }, b: { order: string }) =>
        parseInt(a.order) - parseInt(b.order)
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
    return response?.data?.result;
  } catch (error) {
    console.error("error in getting cohort list", error);
    // throw error;
  }
};

export const createCohort = async (userData: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_CREATE}`;
  try {
    const response = await post(apiUrl, userData);
    return response?.data;
  } catch (error) {
    console.error("error in getting cohort list", error);
    // throw error;
  }
};

export const fetchCohortMemberList = async ({
  limit,
  offset,
  filters,
}: CohortMemberList): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_MEMBER}`;
  try {
    const response = await post(apiUrl, {
      limit,
      offset,
      filters,
      // sort: ["username", "asc"],
    });
    return response?.data;
  } catch (error) {
    console.error("error in cohort member list API ", error);
    // throw error;
  }
};



export const bulkCreateCohortMembers = async (payload: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_MEMBER_BULK}`;
  try {
    const response = await post(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Error in bulk creating cohort members', error);
    throw error;
  }
};


export const updateCohortMemberStatus = async ({
  memberStatus,
  statusReason,
  membershipId,
}: UpdateCohortMemberStatusParams): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_MEMBER_UPDATE}/${membershipId}`;
  try {
    const response = await put(apiUrl, {
      status: memberStatus,
      statusReason,
    });
    console.log('data', response?.data);
    return response?.data;
  } catch (error) {
    console.error('error in attendance report api ', error);
    // throw error;
  }
};

export const cohortCreate = async (data: cohortListData): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_CREATE}`;

  try {
    const response = await post(apiUrl, data);
    return response?.data;
  } catch (error) {
    console.error("Error in Getting cohort List Details", error);
    return error;
  }
};

export const getTenantLists = async (
data:any
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.TENANT_LIST}`;
  try {
    let response = await get(apiUrl,data);    
        return response?.data?.result;
      } catch (error) {
        console.error("Error in Getting tenant List Details", error);
        return error;
      }
       
  }


  export const deleteCohort = async (
    // status:any,
    option: string
  ): Promise<any> => {
    
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_DELETE}/${option}`;
    const requestBody = {};
    const requestHeaders = {};
  
    try {
      const response = await deleteApi(apiUrl, requestBody, requestHeaders);      
      return response?.data;
    } catch (error) {
      console.error(`Error deleting`, error);
      return error;
    }
  };
  export const deleteTenant = async (
    // status:any,
    option: string
  ): Promise<any> => {
    
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.TENANT_DELETE}?id=${option}`;
    const requestBody = {};
    const requestHeaders = {};
  
    try {
      const response = await deleteApi(apiUrl, requestBody, requestHeaders);      
      return response?.data;
    } catch (error) {
      console.error(`Error deleting`, error);
      return error;
    }
  };
  export const tenantCreate = async (data: cohortListData): Promise<any> => {
    let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.TENANT_CREATE}`;
  
    try {
      const response = await post(apiUrl, data);
      console.log({response});
      
      return response?.data;
    } catch (error) {
      console.error("Error in Getting cohort List Details", error);
      return error;
    }
  };
  export const roleCreate = async (data: cohortListData): Promise<any> => {
    let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.ROLE_CREATE}`;
  
    try {
      const response = await post(apiUrl, data);
      console.log({response});
      
      return response?.data;
    } catch (error) {
      console.error("Error in Getting cohort List Details", error);
      return error;
    }
  };
  export const updateTenant = async (
    userId: string,
    cohortDetails: any
  ): Promise<any> => {
    // const { name, status, type } = cohortDetails;
    let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.TENANT_UPDATE}?id=${userId}`;
  
    try {
      const response = await patch(apiUrl, cohortDetails);
      return response?.data;
    } catch (error) {
      console.error("Error in updating cohort details", error);
      throw error;
    }
  };
  export const rolesList = async (data: cohortListData): Promise<any> => {
    let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.ROLES_LIST}`;
  
    try {
      const response = await post(apiUrl, data);
      console.log({response});
      
      return response?.data;
    } catch (error) {
      console.error("Error in Getting cohort List Details", error);
      return error;
    }
  };
  export const userCreate = async (data: cohortListData,userTenantId:string): Promise<any> => {
    let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.USER_CREATE}`;
  
    try {
      const response = await post(apiUrl, data);
      return response?.data;
    } catch (error) {
      console.error("Error in Getting cohort List Details", error);
      return error;
    }
  };

  export const deleteUser = async (
    userId: string
  ): Promise<any> => {
    
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.USER_DELETE}/${userId}`;
    const requestBody = {};
    const requestHeaders = {};
  
    try {
      const response = await deleteApi(apiUrl, requestBody, requestHeaders);      
      return response?.data;
    } catch (error) {
      console.error(`Error deleting`, error);
      return error;
    }
  };