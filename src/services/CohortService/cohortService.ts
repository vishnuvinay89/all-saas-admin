import { get, post, put } from "../RestClient";

export const getCohortList = async (userId: string): Promise<any> => {
  console.log("SS", userId);
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/mycohorts/${userId}?children=true&customField`;
  try {
    const response = await get(apiUrl);
    return response?.data?.result;
  } catch (error) {
    console.error("Error in getting cohort details", error);
    throw error;
  }
};

export const updateCohortUpdate = async (
  userId: string,
  cohortDetails: {
    name?: string;
    status?: string;
  }
): Promise<any> => {
  const { name, status } = cohortDetails;
  let apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/cohort/update/${userId}`;

  try {
    const response = await put(apiUrl, { name, status });
    return response?.data?.result;
  } catch (error) {
    console.error("Error in updating cohort details", error);
    throw error;
  }
};
