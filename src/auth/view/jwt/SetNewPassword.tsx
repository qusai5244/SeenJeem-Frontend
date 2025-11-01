import { useState } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'src/components/snackbar';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useParams } from 'react-router-dom';

import { PasswordIcon } from 'src/assets/icons';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  newPassword: zod.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: zod.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ----------------------------------------------------------------------

export default function ResetPasswordFormView() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  
  // State for password visibility
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(
        `${CONFIG.serverUrl}${CONFIG.auth.setNewPassword}`,
        {
          token: token,
          Password: data.newPassword
        }
      );

      if (response.data.success) {
        toast.success('Password reset successfully!');
        router.push(paths.auth.jwt.signIn);
      } else {
        // Show response description if error code is less than 5000
        if (response.data.code && response.data.code < 5000) {
          toast.error(response.data.description || response.data.message || 'Failed to reset password');
        } else {
          toast.error(response.data.message || 'Failed to reset password');
        }
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        // Check for error code in response data
        if (error.response?.data?.code && error.response.data.code < 5000) {
          toast.error(error.response?.data?.description || error.response?.data?.message || 'An error occurred while resetting password');
        } else {
          toast.error(error.response?.data?.message || 'An error occurred while resetting password');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="newPassword"
        label="New Password"
        placeholder="8+ characters with uppercase, lowercase and number"
        type={showNewPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowNewPassword(!showNewPassword)} 
                  edge="end"
                >
                  <Iconify
                    icon={showNewPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirm New Password"
        placeholder="Confirm your new password"
        type={showConfirmPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  edge="end"
                >
                  <Iconify
                    icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Resetting password..."
      >
        Reset Password
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Reset Your Password"
        description="Please enter and confirm your new password"
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}