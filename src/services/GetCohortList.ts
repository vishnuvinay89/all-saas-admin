import { get } from "./RestClient";
import config from "@/utils/urlConstants.json";
export const getCohortList = async (
  userId: string | string[],
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.MY_COHORTS}/${userId}`;
  try {
    const response = await get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error("error in fetching user details", error);
    return error;
  }
};
