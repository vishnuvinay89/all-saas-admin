import { post } from "./RestClient";

export interface userListParam {
  limit: number;
  //  page: number;
  filters: {
    role: string;
    status?: string;
    state?: string;
    district?: string;
    block?: string;
  };
  fields?: any;
  sort?: object;
  offset: number;
}

export const userList = async ({
  limit,
  //  page,
  filters,
  sort,
  offset,
  fields,
}: userListParam): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/list`;
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
