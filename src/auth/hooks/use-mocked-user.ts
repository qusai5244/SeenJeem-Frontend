import { _mock } from 'src/_mock';

// To get the user from the <AuthContext/>, you can use

// Change:
// import { useMockedUser } from 'src/auth/hooks';
// const { user } = useMockedUser();

// To:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

import {apiFetcher, endpoints, ApiRequestType} from 'src/lib/axios'

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Jaydon Frankie',
    email: 'demo@minimals.cc',
    photoURL: _mock.image.avatar(24),
    phoneNumber: _mock.phoneNumber(1),
    country: _mock.countryNames(1),
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}

export type UserInfo = {
  email: string;
  name: string;
  mobileNumber: string;
};

export async function getUser(): Promise<UserInfo | null> {
  try {
    const response = await apiFetcher<UserInfo>(
      endpoints.auth.me,
      ApiRequestType.Get
    );

    //console.log(response.data);

    if (!response || !response.success || !response.data) {
      throw new Error("Failed to fetch user data");
    }

    // ✅ Return UserInfo object correctly
    return {
      email: response.data.email,
      name: response.data.name, // Ensure the API response has this field
      mobileNumber: response.data.mobileNumber,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Return null if fetching user fails
  }
}
