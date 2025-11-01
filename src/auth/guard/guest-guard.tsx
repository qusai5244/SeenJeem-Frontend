import { useState, useEffect } from 'react';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { paths } from 'src/routes/paths';
import { jwtDecode } from '../context/jwt/utils';
import { JWT_STORAGE_KEY } from '../context/jwt/constant';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

// Function to get and decode token from localStorage
export function getDecodedToken() {
  try {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      return null;
    }
    
    const decoded = jwtDecode(token);
    return {
      token,
      decoded,
      isValid: true
    };
  } catch (error) {
    console.error('Error getting/decoding token:', error);
    return {
      token: null,
      decoded: null,
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { loading, authenticated } = useAuthContext();

  const searchParams = useSearchParams();

  // get the user type from local storage
   const userType = localStorage.getItem('user_type');


  let returnTo = '';

  const token = getDecodedToken();

  console.log("token");
  console.log(token);

  if (token?.decoded.userType === 'SuperAdmin') {
    returnTo = searchParams.get('returnTo') || paths.superadmin.organization.root;
  }
  else if (token?.decoded.userType !== 'SuperAdmin') {

    if(token?.decoded.isPasswordNeedChange === 'True'){
      // returnTo = searchParams.get('returnTo') || paths.dashboard.Profile.changePassword;
    }
    else{
      returnTo = searchParams.get('returnTo') || CONFIG.auth.merchantRedirectPath;
    }
  }

   // delete user type from local storage

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (authenticated) {
      // Redirect authenticated users to the returnTo path
      // Using `window.location.href` instead of `router.replace` to avoid unnecessary re-rendering
      // that might be caused by the AuthGuard component
      localStorage.removeItem('user_type');
      window.location.href = returnTo;
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
