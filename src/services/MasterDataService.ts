import { get } from "./RestClient";
export const getStateList = async (
   
  ): Promise<any> => {
    const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read/states?context=USERS`;
    try {
      const response = await get(apiUrl);
      return response?.data;
    } catch (error) {
      console.error('error in fetching user details', error);
      return error;
    }
  };
  

  export const getDistrictList = async ( state: string | string[]): Promise<any> => {
      const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read/districts?controllingfieldfk=${state}&context=USERS`;
      try {
        const response = await get(apiUrl);
        return response?.data;
      } catch (error) {
        console.error('error in fetching user details', error);
        return error;
      }
    };
    

    export const getBlockList = async (district: string | string[]): Promise<any> => {
        const apiUrl: string = `${process.env.NEXT_PUBLIC_BASE_URL}/fields/options/read/blocks?controllingfieldfk=${district}&context=USERS`;
        try {
          const response = await get(apiUrl);
          return response?.data;
        } catch (error) {
          console.error('error in fetching user details', error);
          return error;
        }
      };