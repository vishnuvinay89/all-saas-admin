import { post } from "./RestClient";

interface LoginParams {
  username: string;
  password: string;
}

interface RefreshParams {
  refresh_token: string;
}

export const login = async ({
  username,
  password,
}: LoginParams): Promise<any> => {
  const apiUrl: string = `https://qa.prathamteacherapp.tekdinext.com/user/v1/auth/login`;

  try {
    const response = await post(apiUrl, { username, password });
    return response?.data;
  } catch (error) {
    console.error("error in login", error);
    throw error;
  }
};

export const refresh = async ({
  refresh_token,
}: RefreshParams): Promise<any> => {
  const apiUrl: string = `https://qa.prathamteacherapp.tekdinext.com/user/v1/auth/refresh`;
  try {
    const response = await post(apiUrl, { refresh_token });
    return response?.data;
  } catch (error) {
    console.error("error in login", error);
    throw error;
  }
};

export const logout = async (refreshToken: string): Promise<any> => {
  const apiUrl: string = `https://qa.prathamteacherapp.tekdinext.com/user/v1/auth/logout`;
  try {
    const response = await post(apiUrl, { refresh_token: refreshToken });
    return response;
  } catch (error) {
    console.error("error in logout", error);
    throw error;
  }
};
