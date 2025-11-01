import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { CONFIG } from 'src/global-config';
// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

interface ApiResponse {
  success: boolean;
  code: number;
  description: string;
  data: null;
}

export type SignUpParams = {
  email: string;
  password: string;
  userName: string;
  phoneNumber: string;
  teamName: string;
  orgizationName: string;
  teamNameAr: string;
  orgizationNameAr: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const accessToken = res.data.data.token; // Directly assign the token string

    const userType = res.data.data.userType;

    let userTypeString = '';
    if (userType === 1) {
      userTypeString = 'adminn';
    } else if (userType === 2) {
      userTypeString = 'merchant';
    } else {
      throw new Error('User Type not found in response');
    }

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken, userTypeString);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  userName,
  phoneNumber,
  teamName,
  orgizationName,
  teamNameAr,
  orgizationNameAr,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    userName,
    phoneNumber,
    teamName,
    orgizationName,
    teamNameAr,
    orgizationNameAr,
  };

  try {
    // const res = await axios.post(endpoints.auth.signUp, params);

    const res = await fetch(`${CONFIG.serverUrl}${endpoints.auth.signUp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data: ApiResponse = await res.json();

    console.log('dada', data);

    if (!data.success) {
      // Create a new Error with the description
      const error = new Error(data.description || 'Sign up failed');
      // Attach the response data to the error
      (error as any).response = { data: data };
      throw error;
    }
    console.log('Sign up success');
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};
/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null, null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
