import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'src/components/snackbar';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from 'src/auth/components/form-head';
import { FormReturnLink } from 'src/auth/components/form-return-link';
import { CONFIG } from 'src/global-config';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function FirebaseResetPasswordView() {
  const { t } = useTranslation(); // Initialize translation hook
  const router = useRouter();

  const defaultValues: ResetPasswordSchemaType = {
    email: '',
  };

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Call the reset password API
      const response = await axios.post(
        `${CONFIG.serverUrl}${CONFIG.auth.resetPassword}`,
        {
          email: data.email
        }
      );

      // Check if the request was successful
      if (response.data.success) {
        toast.success(t('resetPassword.linkSent')); // Translated success message
        router.push(paths.auth.jwt.signIn);
      } else {
        toast.error(response.data.message || t('resetPassword.linkFailed')); // Translated failure message
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || t('resetPassword.errorOccurred')); // Translated error message
      } else {
        toast.error(t('resetPassword.unexpectedError')); // Translated unexpected error message
      }
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        autoFocus
        name="email"
        label={t('resetPassword.emailLabel')} // Translated label
        placeholder="example@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('resetPassword.sendingRequest')} // Translated loading indicator
      >
        {t('resetPassword.sendRequest')} {/* Translated button text */}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title={t('resetPassword.forgotPasswordTitle')} // Translated title
        description={t('resetPassword.description')} // Translated description
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.jwt.signIn} />
    </>
  );
}
