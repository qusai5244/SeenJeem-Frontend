import type { IconButtonProps } from '@mui/material/IconButton';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { useState, useEffect } from "react";

import { paths } from 'src/routes/paths';
import { usePathname, useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';


import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { getUser, UserInfo } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
import { useTranslation } from 'react-i18next';
import { CONFIG } from 'src/global-config';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';

// Import Material-UI icons for better visual hierarchy
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LanguageIcon from '@mui/icons-material/Language';
import RefreshIcon from '@mui/icons-material/Refresh';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

interface ProfileData {
  userName: string;
  email: string;
  mobileNumber: string;
}

interface ProfileApiResponse {
  success: boolean;
  code: number;
  description: string;
  data: ProfileData | null;
}
export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUserInfo] = useState<UserInfo | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshingToken, setRefreshingToken] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      const userData = await getUser();
      setUserInfo(userData);
    }
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   async function fetchProfileData() {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await apiFetcher(
  //         CONFIG.user.profile.getProfile,
  //         ApiRequestType.Get
  //       ) as ProfileApiResponse;
        
  //       if (response.success && response.data) {
  //         setProfileData({
  //           userName: response.data.userName || '',
  //           email: response.data.email || '',
  //           mobileNumber: response.data.mobileNumber || ''
  //         });
  //       }
  //     } catch (error: any) {
  //       console.error('Failed to fetch profile data:', error);
  //       setError(error.message || 'Failed to load profile data');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
    
  //   fetchProfileData();
  // }, []);

  // const handleRefreshPermissions = async () => {
  //   setRefreshingToken(true);
  //   try {
  //     const response = await apiFetcher(
  //       CONFIG.user.profile.GetNewToken,
  //       ApiRequestType.Get
  //     ) as { success: boolean; code: number; description: string; data: string };
      
  //     if (response.success && response.data) {
  //       // Update localStorage with new JWT token
  //       localStorage.setItem('jwt_access_token', response.data);
        
  //       console.log('Token refreshed successfully');
        
  //       // Close the drawer and navigate to dashboard root
  //       onClose();
  //       router.push(paths.dashboard.root);
        
  //       // Refresh the page to ensure all components pick up new permissions
  //       window.location.reload();
  //     }
  //   } catch (error: any) {
  //     console.error('Failed to refresh token:', error);
  //     setRefreshingToken(false);
  //   }
  //   // Note: setRefreshingToken(false) is not needed in finally block since page will reload
  // };

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderAvatar = () => (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <AnimateBorder
        sx={{ 
          p: '6px', 
          width: 120, 
          height: 120, 
          borderRadius: '50%',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        }}
        slotProps={{
          primaryBorder: { 
            size: 140, 
            sx: { 
              color: 'primary.main',
              background: (theme) => `conic-gradient(${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
            } 
          },
        }}
      >
        <Avatar 
          src="" 
          alt={profileData?.userName || user?.name} 
          sx={{ 
            width: 1, 
            height: 1,
            fontSize: '2rem',
            fontWeight: 600,
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'common.white',
            boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          {(profileData?.userName || user?.name)?.charAt(0)?.toUpperCase()}
        </Avatar>
      </AnimateBorder>
      
      {/* Status indicator */}
      <Box 
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: 'success.main',
          border: (theme) => `3px solid ${theme.palette.background.paper}`,
          boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
        }}
      />
    </Box>
  );

  const {t} = useTranslation();

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      {data.map((option) => {
        const rootLabel = pathname.includes('/dashboard') ? 'Home' : 'Dashboard';
        const rootHref = pathname.includes('/dashboard') ? '/' : paths.dashboard.root;

        return (
          <MenuItem key={option.label}>
            <Link
              component={RouterLink}
              href={option.label === 'Home' ? rootHref : option.href}
              color="inherit"
              underline="none"
              onClick={onClose}
              sx={{
                p: 1,
                width: 1,
                display: 'flex',
                typography: 'body2',
                alignItems: 'center',
                color: 'text.secondary',
                '& svg': { width: 24, height: 24 },
                '&:hover': { color: 'text.primary' },
              }}
            >
              {option.icon}

              <Box component="span" sx={{ ml: 2 }}>
                {option.label === 'Home' ? rootLabel : option.label}
              </Box>

              {option.info && (
                <Label color="error" sx={{ ml: 1 }}>
                  {option.info}
                </Label>
              )}
            </Link>
          </MenuItem>
        );
      })}
    </MenuList>
  );

  return (
    <>
    <AccountButton
      onClick={onOpen}
      photoURL=""
      displayName={((profileData?.userName || user?.name || '')?.charAt(0)?.toUpperCase()) || ''}
      sx={sx}
      {...other}
    />
        <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ 
          sx: { 
            width: 380,
            background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            backdropFilter: 'blur(20px)',
            borderLeft: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          } 
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 16,
            left: 16,
            zIndex: 9,
            position: 'absolute',
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(8px)',
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 10,
              pb: 3,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mt: 3,
                gap: 2 
              }}>
                <CircularProgress size={32} thickness={4} />
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500 
                }}>
                  {t("Loading profile...")}
                </Typography>
              </Box>
            ) : error ? (
              <Card sx={{ 
                mt: 3, 
                width: '100%',
                backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" sx={{ 
                    color: 'error.main',
                    fontWeight: 500 
                  }}>
                    {t("Failed to load profile")}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Card sx={{ 
                mt: 3, 
                width: '100%',
                backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    
                    {/* User Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PersonIcon sx={{ 
                          fontSize: 18, 
                          color: 'primary.main' 
                        }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}>
                          {t("User Name")}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 600,
                          color: 'text.primary',
                          wordBreak: 'break-word'
                        }}>
                          {profileData?.userName || user?.name || '-'}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ opacity: 0.5 }} />

                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <EmailIcon sx={{ 
                          fontSize: 18, 
                          color: 'info.main' 
                        }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}>
                          {t("Email")}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          color: 'text.primary',
                          wordBreak: 'break-word'
                        }}>
                          {profileData?.email || user?.email || '-'}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ opacity: 0.5 }} />

                    {/* Mobile Number */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: (theme) => alpha(theme.palette.success.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PhoneIcon sx={{ 
                          fontSize: 18, 
                          color: 'success.main' 
                        }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}>
                          {t("Mobile Number")}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500,
                          color: 'text.primary',
                          wordBreak: 'break-word'
                        }}>
                          {profileData?.mobileNumber || user?.mobileNumber || '-'}
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </CardContent>
              </Card>
            )}

          </Box>

          {/* <Box
            sx={{
              p: 3,
              gap: 1,
              flexWrap: 'wrap',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: 3 }, (_, index) => (
              <Tooltip
                key={_mock.fullName(index + 1)}
                title={`Switch to: ${_mock.fullName(index + 1)}`}
              >
                <Avatar
                  alt={_mock.fullName(index + 1)}
                  src={_mock.image.avatar(index + 1)}
                  onClick={() => {}}
                />
              </Tooltip>
            ))}

            <Tooltip title="Add account">
              <IconButton
                sx={[
                  (theme) => ({
                    bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                    border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                  }),
                ]}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Tooltip>
          </Box> */}

          {data.length > 0 && renderList()}
{/* 
          <Box sx={{ px: 2.5, py: 3 }}>
            <UpgradeBlock />
          </Box> */}
        </Scrollbar>

        <Box sx={{ 
          p: 3, 
          borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: (theme) => alpha(theme.palette.background.paper, 0.4),
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {/* <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleRefreshPermissions}
            disabled={refreshingToken}
            startIcon={refreshingToken ? <CircularProgress size={16} /> : <RefreshIcon />}
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              background: (theme) => alpha(theme.palette.primary.main, 0.08),
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              '&:hover': {
                background: (theme) => alpha(theme.palette.primary.main, 0.12),
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            {refreshingToken ? t("Refreshing...") : t("Refresh Permission")}
          </Button> */}
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
