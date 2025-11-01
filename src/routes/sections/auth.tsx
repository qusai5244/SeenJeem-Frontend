import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';
import { useTranslation } from 'react-i18next'; // Importing translation hook

// ----------------------------------------------------------------------

// Lazy loading JWT-related components
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/jwt/reset-password')),
  SetPasswordPage: lazy(() => import('src/auth/view/jwt/SetNewPassword')),
};

// Create a Component for the SignInPage route to handle the translation hook
const SignInPageRoute = () => {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <GuestGuard>
      <AuthSplitLayout
        slotProps={{
          section: { title: t('signIn.hiWelcomeback') }, // Translate the title here
        }}
      >
        <Jwt.SignInPage />
      </AuthSplitLayout>
    </GuestGuard>
  );
};

// Define the route configuration for JWT-related routes
const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: <SignInPageRoute />, // Use the component that includes translation
    },
    // {
    //   path: 'sign-up',
    //   element: (
    //     <GuestGuard>
    //       <AuthSplitLayout>
    //         <Jwt.SignUpPage />
    //       </AuthSplitLayout>
    //     </GuestGuard>
    //   ),
    // },

    {
      path: 'reset-password',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.ResetPasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },

    {
      path: 'reset-password/:token',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SetPasswordPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    }
  ],
};

// Define the main routes for authentication
export const authRoutes: RouteObject[] = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
    // children: [authJwt, authAmplify, authFirebase, authAuth0, authSupabase],
  },
];
