import { useState, useEffect, useCallback } from 'react';
import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';
import { CONFIG } from 'src/global-config';
import { SplashScreen } from 'src/components/loading-screen';
import { useAuthContext } from '../hooks';

type AuthGuardProps = {
  children: React.ReactNode;
};

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
  auth0: paths.auth.auth0.signIn,
  amplify: paths.auth.amplify.signIn,
  firebase: paths.auth.firebase.signIn,
  supabase: paths.auth.supabase.signIn,
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const createRedirectPath = (currentPath: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  const getTokenPayload = () => {
    try {
      // Retrieve the JWT token from local storage
      const token = localStorage.getItem('jwt_access_token');
      if (!token) return null;

      // Decode the token payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const checkPermissions = useCallback(async () => {
    if (loading) return;

    if (!authenticated) {
      const signInPath = signInPaths[CONFIG.auth.method];
      router.replace(createRedirectPath(signInPath));
      return;
    }

    // Authorization check
    const payload = getTokenPayload();
    if (!payload) {
      const signInPath = signInPaths[CONFIG.auth.method];
      router.replace(createRedirectPath(signInPath));
      return;
    }

    const userType = payload.userType; // Assuming the user type is stored in the token payload
    const isMerchant = userType !== 'SuperAdmin';
    const isAdmin = userType === 'SuperAdmin';

    // router.replace(paths.dashboard.root); // Redirect merchants away from super admin routes
    // return;
    
    // // Route restrictions
    // if (isMerchant && pathname.startsWith('/superadmin')) {
    //   router.replace(paths.dashboard.root); // Redirect merchants away from super admin routes
    //   return;
    // }

    // if (isAdmin && pathname.startsWith('/dashboard')) {
    //   router.replace(paths.superadmin.root); // Redirect admins away from dashboard routes
    //   return;
    // }

    setIsChecking(false);
  }, [authenticated, loading, pathname, router]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}