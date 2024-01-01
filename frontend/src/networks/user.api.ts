import axios from "axios";
import { User } from "../models/user.model";
const url = "https://poterest-api.onrender.com";

export const GetAuthenticatedUser = async (): Promise<User> => {
  const response = await axios.get(`${url}/api/user`, {
    withCredentials: true,
  });
  return response.data;
};

export const GetTargetUser = async (id: string): Promise<User> => {
  const response = await axios.get(`${url}/api/user/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

interface LogInInfo {
  email: string;
  password: string;
}
export const LogInUser = async (info: LogInInfo): Promise<User> => {
  const response = await axios.post(`${url}/api/user/signin`, info, {
    withCredentials: true,
  });
  return response.data;
};

interface SignUpInfo {
  email: string;
  username: string;
  password: string;
}
export const SignUpUser = async (info: SignUpInfo): Promise<User> => {
  const response = await axios.post(`${url}/api/user/signup`, info, {
    withCredentials: true,
  });
  return response.data;
};

export const LogOutUser = async () => {
  const response = await axios.post(`${url}/api/user/logout`);
  return response.data;
};

interface UpdateProps {
  id: string | undefined;
  formData: {
    avatar?: string;
    username?: string;
    email?: string;
  };
}

export const UpdateUser = async ({
  id,
  formData,
}: UpdateProps): Promise<User> => {
  const response = await axios.post(`${url}/api/user/update/${id}`, formData);
  return response.data;
};

export const DeleteUser = async ({
  password,
}: {
  password: string | undefined;
}) => {
  const response = await axios.post(`${url}/api/user/delete/`, {
    password: password,
  });
  return response.data;
};

interface PasswordProps {
  currentPassword: string;
  newPassword: string;
}
export const ChangeNewPassword = async (formData: PasswordProps) => {
  const response = await axios.post(
    `${url}/api/user/change-password`,
    formData
  );
  return response.data;
};
