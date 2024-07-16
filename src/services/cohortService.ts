import { get, post } from "./RestClient";

export const getCohortList = async (
  userId: string,
  filters: { [key: string]: string } = {}
): Promise<any> => {
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/mycohorts/${userId}?children=false`;
  const filterParams = new URLSearchParams(filters).toString();
  if (filterParams) {
    apiUrl += `&${filterParams}`;
  }
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error("Error in getting cohort details", error);
    throw error;
  }
};
