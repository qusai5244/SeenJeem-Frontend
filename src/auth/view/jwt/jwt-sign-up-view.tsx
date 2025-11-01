import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { signUp } from '../../context/jwt';
import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';

// Import the useTranslation hook
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<typeof SignUpSchema>;

export const SignUpSchema = zod.object({
  userName: zod.string().min(1, { message: 'User Name is required!' }),
  phoneNumber: zod.number().min(1, { message: 'Phone Number is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
  teamName: zod.string().min(1, { message: 'Team Name is required!' }),
  orgizationName: zod.string().min(1, { message: 'Organization Name is required!' }),
  teamNameAr: zod.string().min(1, { message: 'Team Name is required!' }),
  orgizationNameAr: zod.string().min(1, { message: 'Organization Name is required!' })
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { t } = useTranslation(); // Initialize translation hook

  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    userName: '',
    phoneNumber: 99999999,
    email: '',
    password: '',
    teamName: '',
    orgizationName: '',
    teamNameAr: '',
    orgizationNameAr: ''
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        userName: data.userName,
        phoneNumber: data.phoneNumber.toString(),
        teamName: data.teamName,
        orgizationName: data.orgizationName,
        teamNameAr: data.teamNameAr,
        orgizationNameAr: data.orgizationNameAr
      });

      await checkUserSession?.();

      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="userName"
          label={t('userName')} // Translated text
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text
          name="phoneNumber"
          label={t('phoneNumber')} // Translated text
          slotProps={{ inputLabel: { shrink: true } }}
          type='number'
        />
      </Box>

      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="teamName"
          label={t('teamName')} // Translated text
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text
          name="teamNameAr"
          label={t('teamNameAr')} // Translated text
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >

        <Field.Text
          name="orgizationName"
          label={t('organizationName')} // Translated text
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Field.Text
          name="orgizationNameAr"
          label={t('organizationNameAr')} // Translated text
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text name="email" label={t('emailAddress')} slotProps={{ inputLabel: { shrink: true } }} />

      <Field.Text
        name="password"
        label={t('password')}
        placeholder={t('passwordPlaceholder')}
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('createAccountLoading')} 
      >
        {t('createAccount')} 
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={t('getStartedTitle')}
        description={
          <>
            {t('alreadyHaveAccount')} 
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              {t('getStarted')}
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {/* <SignUpTerms /> */}
    </>
  );
}
