// src/api.ts
import axios from "axios";
import { USER_API_URL, ADMIN_API_URL } from "./constants";
//console.log("userapiurl", USER_API_URL)
export interface UserData {
  name: string;
  email: string;
  contactNumber: string;
  role: string;
}

export const loginWithGoogle = async (accessToken: string) => {
  //console.log(`USER_API_URL ===> ${USER_API_URL}`); 
  return await axios.post(`${USER_API_URL}/userLogin`, {
    tokenResponse: { access_token: accessToken },
  });
};


export const registerUser = async (formData: UserData, token: string) => {
  const userData = formData;
  console.log("Token ", token)
  return await axios.post(`${ADMIN_API_URL}/registerUser`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createQuery = async (
  subject: string,
  message: string,
  token: string
) => {
  return await axios.post(
    `${USER_API_URL}/userRaiseQuery`,
    {
      subject,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    }
  );
};

export const fetchQueries = async (token: string) => {
  return await axios.get(`${USER_API_URL}/userViewMyQueries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminfetchQueries = async (token: string) => {
  return await axios.get(`${ADMIN_API_URL}/adminViewRaisedQueries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendMessageApi = async (
  queryId: string,
  message: string,
  token: string,
  role: string
) => {
  let URL = `${ADMIN_API_URL}/adminAddResponseToQuery`;
  if (role !== "SupportAdmin") {
    URL = `${USER_API_URL}/userAddCommentToQuery`;
  }
  try {
    const response = await axios.post(
      `${URL}/${queryId}`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const adminGetUserList = async (token: string) => {
  return await axios.get(`${ADMIN_API_URL}/adminViewUserList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const adminUpdateStudentStatus = async (
  email: string,
  role: string,
  newStatus: boolean,
  token: string
) => {
  return axios.post(
    `${ADMIN_API_URL}/adminManageStudentStatus`,
    {
      email,
      role,
      status: newStatus
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const manageQueryStatus = async (
  queryId: string,
  userEmail: string,
  token: string,
  role: string,
  selectedStatus: string
) => {
  console.log("queryId inside manageQueryStatus ",queryId)
  let URL = `${ADMIN_API_URL}/adminManageQueryStatus`;
  if (role !== "Admin") {
    URL = `${USER_API_URL}/userManageQueryStatus`;
  }
  try {
    const response = await axios.post(
      `${URL}/${queryId}/${selectedStatus}`,
      { userEmail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Failed to send message");
  }
};

export const fetchQueryById = async (
  queryId: string,
  token: string,
  role: string
) => {
  let URL = `${ADMIN_API_URL}/adminGetQueryData`;
  if (role !== "SupportAdmin") {
    URL = `${USER_API_URL}/userGetQueryData`;
  }
  try {
    const response = await axios.get(`${URL}/${queryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};