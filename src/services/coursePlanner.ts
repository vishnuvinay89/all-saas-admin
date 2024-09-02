import { CoursePlannerMetaData, GetSolutionDetailsParams, GetTargetedSolutionsParams, GetUserProjectTemplateParams } from "@/utils/Interfaces";
import { post } from "./RestClient";
import axios from 'axios';



export const getChannelDetails = async (): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_SUNBIRDSAAS_API_URL}/api/channel/v1/read/01369885294383923244`;

  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('Error in getting Channel Details', error);
    return error;
  }
};

export const getFrameworkDetails = async (frameworkId: string): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_SUNBIRDSAAS_API_URL}/api/framework/v1/read/${frameworkId}?categories=gradeLevel,medium,class,subject`;

  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('Error in getting Framework Details', error);
    return error;
  }
};

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



  export const getTargetedSolutions = async ({
    subject,
    state,

    medium,
    class: className,
    board,
    type,
  }: GetTargetedSolutionsParams): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/solutions/targetedSolutions?type=improvementProject&currentScopeOnly=true`;
  
    const headers = {
      'X-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
      'Content-Type': 'application/json',
    };
  
    const data = {
      subject,
      state,
     
      medium,
      class: className,
      board,
      type,
    };
  
    try {
      const response = await axios.post(apiUrl, data, { headers });
      return response?.data;
    } catch (error) {
      console.error('Error in getting Targeted Solutions', error);
      return error;
    }
  };
  interface GetUserProjectDetailsParams {
    id: string;
  }
  
  export const getUserProjectDetails = async ({ id }: GetUserProjectDetailsParams): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/userProjects/details/${id}`;
  
    const headers = {
      'Authorization': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
      'Content-Type': 'application/json',
      'x-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
      
    };
  
    try {
      const response = await axios.post(apiUrl, {}, { headers });
      return response?.data;
    } catch (error) {
      console.error('Error in getting User Project Details', error);
      return error;
    }
  };
  
  
  export const getSolutionDetails = async ({ id, role }: GetSolutionDetailsParams): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/solutions/details/${id}`;
  
    const headers = {
      'X-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
      'Content-Type': 'application/json',
    };
  
    const data = {
      role,
    };
  
    try {
      const response = await axios.post(apiUrl, data, { headers });
      return response?.data;
    } catch (error) {
      console.error('Error in getting Solution Details', error);
      return error;
    }
  };
  
  export const getUserProjectTemplate = async ({
    templateId,
    solutionId,
    role,
  }: GetUserProjectTemplateParams): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_SHIKSHALOKAM_API_URL}/userProjects/details?templateId=${templateId}&solutionId=${solutionId}`;
  
    const headers = {
      'X-auth-token': process.env.NEXT_PUBLIC_SHIKSHALOKAM_TOKEN,
      'Content-Type': 'application/json',
    };
  
    const data = {
      role,
    };
  
    try {
      const response = await axios.post(apiUrl, data, { headers });
      return response?.data;
    } catch (error) {
      console.error('Error in getting User Project Details', error);
      throw error;
    }
  };
  


 
 