import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
// import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
// import { signOut as supabaseSignOut } from 'src/auth/context/supabase/action';
// import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection


// ----------------------------------------------------------------------

const signOut =
  // (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
  // (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
  // (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
  jwtSignOut;

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();
  const navigate = useNavigate();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      onClose?.();
      navigate(CONFIG.auth.login); // Redirect to the login page
      
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [checkUserSession, onClose, navigate]);


  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      startIcon={<LogoutIcon />}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
