import { CoursePlannerMetaData } from "@/utils/Interfaces";
import { post } from "./RestClient";


export const uploadCoursePlanner = async (file: File, metaData: CoursePlannerMetaData): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_TELEMETRY_URL}/user/v1/course-planner/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metaData', JSON.stringify(metaData));
    try {
      const response = await post(apiUrl, formData, {
      });
      return response?.data;
    } catch (error) {
      console.error('Error uploading course planner', error);
      throw error;
    }
  };


 
 