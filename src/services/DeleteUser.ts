import { patch } from "./RestClient";
import config from "@/utils/urlConstants.json";
export const deleteUser = async (
  userId: string,
  userData: object,
): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/${config.URLS.UPDATE}/${userId}`;
  try {
    const response = await patch(apiUrl, userData);
    return response?.data;
  } catch (error) {
    console.error("error in fetching user details", error);
    return error;
  }
};
