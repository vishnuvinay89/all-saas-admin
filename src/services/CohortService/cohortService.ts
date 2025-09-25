import { CohortMemberList } from "@/utils/Interfaces";
import { deleteApi, get, patch, post, put } from "../RestClient";
import config from "@/utils/urlConstants.json";
import axios from "axios";

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
  type?: "cohort";
  expiryDate?: string; // Add expiryDate to the interface
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
  cohortDetails: any,
  tenantId: string
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_UPDATE}/${userId}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(apiUrl, cohortDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        tenantId: tenantId,
      },
    });

    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.errmsg || "Error from API.";
    }

    console.error("Error in updating cohort:", error);
    throw new Error(errorMessage);
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
    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.err || "Error from API.";
    }

    console.error("Error in creating user:", error);
    throw new Error(errorMessage);
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
    console.error("Error in bulk creating cohort members", error);
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
    return response?.data;
  } catch (error) {
    console.error("error in attendance report api ", error);
    // throw error;
  }
};

export const cohortCreate = async (
  data: cohortListData,
  tenantId: string
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_CREATE}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        tenantId: tenantId,
      },
    });
    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.errmsg || "Error from API.";
    }

    console.error("Error in creating cohort:", error);
    throw new Error(errorMessage);
  }
};

export const getTenantLists = async (data: any): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.TENANT_LIST}`;
  try {
    let response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error("Error in Getting tenant List Details", error);
    return error;
  }
};

export const deleteCohort = async (
  option: string,
  tenantId: string
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.COHORT_DELETE}/${option}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        tenantId: tenantId,
      },
      data: {},
    });

    return response?.data;
  } catch (error: any) {
    console.error("Error deleting cohort", error);
    
    if (error.response?.status === 409) {
      const errorMessage = error.response?.data?.params?.err || "Cannot delete cohort due to conflicts";
      throw new Error(errorMessage);
    }
    
    throw error;
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
    const token = localStorage.getItem("token");
    // const response = await deleteApi(apiUrl, requestBody, requestHeaders);
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        tenantId: option,
      },
    });
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
    return response?.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // Return the full error response for proper handling in the UI
      const errorData = error.response.data;
      
      // For 403 errors, we want to pass the full response to handle approval flow
      if (error.response.status === 403) {
        return errorData;
      }
      
      const errorMessage = errorData?.params?.err || errorData?.params?.errmsg || "Error from API.";
      throw new Error(errorMessage);
    }

    console.error("Error in creating tenant:", error);
    throw new Error("An unexpected error occurred.");
  }
};
export const roleCreate = async (data: cohortListData): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.ROLE_CREATE}`;

  try {
    const response = await post(apiUrl, data);

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
    const token = localStorage.getItem("token");
    const response = await axios.patch(apiUrl, cohortDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        tenantId: userId,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error in updating cohort details", error);
    throw error;
  }
};
export const rolesList = async (
  data: cohortListData,
  tenantId: string
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.ROLES_LIST}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        tenantId: tenantId,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error in Getting Roles List", error);
    return error;
  }
};

export const userCreate = async (
  data: cohortListData,
  userTenantId: string
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.USER_CREATE}`;

  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      tenantid: userTenantId,
    };

    const response = await axios.post(apiUrl, data, { headers });
    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.err || "Error from API.";
    }

    console.error("Error in creating user:", error);
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (userId: string,tenantId: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.USER_DELETE}/${userId}`;
  const requestBody = {};
  const requestHeaders = {};

  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        tenantId: tenantId,
      },
      data: {},
    });

    return response?.data;
    // const response = await deleteApi(apiUrl, requestBody, requestHeaders);
    // return response?.data;
  } catch (error) {
    console.error(`Error deleting`, error);
    return error;
  }
};

// New approval request service
export const createApprovalRequest = async (): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.APPROVAL_CREATE}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(apiUrl, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      // For 400 errors (like existing request), return the response data instead of throwing
      if (error.response.status === 400) {
        return error.response.data;
      }
      
      const errorMessage = error.response.data?.params?.errmsg || "Error from API.";
      throw new Error(errorMessage);
    }

    console.error("Error in creating approval request:", error);
    throw new Error("An unexpected error occurred while creating approval request.");
  }
};

// Get user approval requests
export const getUserApprovalRequests = async (): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.APPROVAL_READ}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred while fetching approval requests.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.errmsg || "Error from API.";
    }

    console.error("Error in fetching approval requests:", error);
    throw new Error(errorMessage);
  }
};

// Super admin functions for managing approval requests
export const getAllApprovalRequests = async (page: number = 1, limit: number = 10): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.APPROVAL_READ}?page=${page}&limit=${limit}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred while fetching approval requests.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.errmsg || "Error from API.";
    }

    console.error("Error in fetching approval requests:", error);
    throw new Error(errorMessage);
  }
};

export const updateApprovalRequest = async (approvalId: string, status: 'approved' | 'rejected'): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.APPROVAL_UPDATE}/${approvalId}`;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(apiUrl, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response?.data;
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred while updating approval request.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.params?.errmsg || "Error from API.";
    }

    console.error("Error in updating approval request:", error);
    throw new Error(errorMessage);
  }
};
