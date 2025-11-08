// DRIVER LIST PAGE WITH PAGINATION AND SEARCH

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Divider,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  Pagination,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input
} from '@mui/material';
import { AppIcon } from 'src/components/icons';
import { useNavigate } from 'react-router-dom';
import { apiFetcher, ApiRequestType, baseURL } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { hasPermission, PermissionsCodes } from 'src/auth/guard/permission-guard';
import axios from 'axios';

// FileType enum matching backend
enum FileType {
  Passport = 1,
  License = 2,
  IdCard = 3,
  Prove = 4,
  Other = 5
}

interface DriverSearchInput {
  Search: string;
  Page: number;
  PageSize: number;
}

interface DriverItem {
  id: number;
  name: string;
  residentId: string;
  talabatid: string;
  personalNumber: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface DriverSearchResponse {
  items: DriverItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function DriverListPage() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchData, setSearchData] = useState<DriverSearchInput>({
    Search: '',
    Page: 1,
    PageSize: 10
  });

  const [searchResults, setSearchResults] = useState<DriverSearchResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverItem | null>(null);
  
  // Add Driver Dialog State
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    residentId: '',
    talabatid: '',
    personalNumber: ''
  });
  const [driverFiles, setDriverFiles] = useState({
    idCard: null as File | null,
    license: null as File | null,
    profileImage: null as File | null,
    approval: null as File | null
  });

  // Edit Driver Dialog State
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverItem | null>(null);
  const [editDriver, setEditDriver] = useState({
    name: '',
    residentId: '',
    talabatid: '',
    personalNumber: ''
  });

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData.Page, searchData.PageSize]);

  const handleInputChange = (field: keyof DriverSearchInput, value: string | number) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchData.Search) queryParams.append('Search', searchData.Search);
      queryParams.append('Page', searchData.Page.toString());
      queryParams.append('PageSize', searchData.PageSize.toString());

      const response = await apiFetcher(
        `${CONFIG.admin.driver.list}?${queryParams.toString()}`,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        setSearchResults(response.data as DriverSearchResponse);
      } else {
        toast.error(response.description || t('Failed to load drivers'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to load drivers'));
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setSearchData(prev => ({ ...prev, Page: value }));
  };

  const handlePageSizeChange = (event: any) => {
    const newPageSize = event.target.value as number;
    setSearchData(prev => ({ ...prev, PageSize: newPageSize, Page: 1 }));
  };

  const clearSearch = () => {
    setSearchData(prev => ({
      ...prev,
      Search: '',
      Page: 1
    }));
  };

//   const handleAddDriver = () => navigate(paths.dashboard.drivers.new);
//   const handleEditDriver = (id: number) => navigate(paths.dashboard.drivers.edit(id));
//   const handleViewDriver = (id: number) => navigate(paths.dashboard.drivers.details(id));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, driver: DriverItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDriver(null);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewDriver({
      name: '',
      residentId: '',
      talabatid: '',
      personalNumber: ''
    });
    setDriverFiles({
      idCard: null,
      license: null,
      profileImage: null,
      approval: null
    });
  };

  const handleFileChange = (field: keyof typeof driverFiles, file: File | null) => {
    setDriverFiles(prev => ({ ...prev, [field]: file }));
  };

  const uploadMediaFile = async (file: File, fileType: FileType): Promise<number> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType.toString());

      const token = localStorage.getItem('jwt_access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary for FormData
      };

      const response = await axios.post(
        `${baseURL}${CONFIG.admin.media.add}`,
        formData,
        { headers }
      );

      if (response.data.success && response.data.data) {
        return response.data.data; // Return the mediaId
      } else {
        throw new Error(response.data.description || 'File upload failed');
      }
    } catch (error: any) {
      console.error('Media upload error:', error);
      throw new Error(error.response?.data?.description || error.message || 'File upload failed');
    }
  };

  const handleNewDriverChange = (field: string, value: string) => {
    setNewDriver(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDriver = async () => {
    // Validate inputs
    if (!newDriver.name.trim() || !newDriver.residentId.trim() || !newDriver.talabatid.trim() || !newDriver.personalNumber.trim()) {
      toast.error(t('Please fill all fields'));
      return;
    }

    // Validate files
    if (!driverFiles.idCard || !driverFiles.license || !driverFiles.profileImage || !driverFiles.approval) {
      toast.error(t('Please upload all required files'));
      return;
    }

    setAddLoading(true);
    try {
      // Upload all files first and collect mediaIds
      const mediaIds: number[] = [];

      // Upload Id Card (FileType.IdCard = 3)
      const idCardMediaId = await uploadMediaFile(driverFiles.idCard, FileType.IdCard);
      mediaIds.push(idCardMediaId);

      // Upload License (FileType.License = 2)
      const licenseMediaId = await uploadMediaFile(driverFiles.license, FileType.License);
      mediaIds.push(licenseMediaId);

      // Upload Profile Image (FileType.Other = 5)
      const profileImageMediaId = await uploadMediaFile(driverFiles.profileImage, FileType.Other);
      mediaIds.push(profileImageMediaId);

      // Upload Approval (FileType.Prove = 4)
      const approvalMediaId = await uploadMediaFile(driverFiles.approval, FileType.Prove);
      mediaIds.push(approvalMediaId);

      // Create driver with mediaIds
      const driverPayload = {
        name: newDriver.name,
        residentId: newDriver.residentId,
        talabatid: newDriver.talabatid,
        personalNumber: newDriver.personalNumber,
        mediaIds: mediaIds
      };

      const response = await apiFetcher(
        CONFIG.admin.driver.add,
        ApiRequestType.Post,
        undefined,
        driverPayload
      );

      if (response.success) {
        toast.success(t('Driver added successfully'));
        handleCloseAddDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to add driver'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to add driver'));
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenEditDialog = (driver: DriverItem) => {
    setEditingDriver(driver);
    setEditDriver({
      name: driver.name,
      residentId: driver.residentId,
      talabatid: driver.talabatid,
      personalNumber: driver.personalNumber
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingDriver(null);
    setEditDriver({
      name: '',
      residentId: '',
      talabatid: '',
      personalNumber: ''
    });
  };

  const handleEditDriverChange = (field: string, value: string) => {
    setEditDriver(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateDriver = async () => {
    if (!editingDriver) return;

    // Validate inputs
    if (!editDriver.name.trim() || !editDriver.residentId.trim() || !editDriver.talabatid.trim() || !editDriver.personalNumber.trim()) {
      toast.error(t('Please fill all fields'));
      return;
    }

    setEditLoading(true);
    try {
      const response = await apiFetcher(
        CONFIG.admin.driver.update(editingDriver.id.toString()),
        ApiRequestType.Put,
        undefined,
        editDriver
      );

      if (response.success) {
        toast.success(t('Driver updated successfully'));
        handleCloseEditDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to update driver'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to update driver'));
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return { 
          bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
          color: 'white', 
          label: t('Active') 
        };
      case 0:
        return { 
          bg: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)', 
          color: 'white', 
          label: t('Inactive') 
        };
      default:
        return { 
          bg: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)', 
          color: 'white', 
          label: t('Unknown') 
        };
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      mx: 'auto', 
      p: { xs: 2, sm: 3, md: 4 }, 
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            {t('Drivers List')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Manage and view all registered drivers')}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleOpenAddDialog} 
          startIcon={<AppIcon name="add" />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {t('Add Driver')}
        </Button>
      </Box>

      {/* Search Section */}
      <Card 
        sx={{ 
          mb: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
          borderRadius: 3,
          overflow: 'hidden',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                label={t('Search')}
                placeholder={t('Search by name, ID, or phone...')}
                value={searchData.Search}
                onChange={(e) => handleInputChange('Search', e.target.value)}
                fullWidth
                disabled={searchLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={searchLoading}
                startIcon={searchLoading ? <CircularProgress size={20} color="inherit" /> : <AppIcon name="search" />}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {searchLoading ? t('Searching...') : t('Search')}
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={clearSearch} 
                disabled={searchLoading}
                sx={{
                  py: 1.5,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  }
                }}
              >
                {t('Clear')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {searchLoading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          py: 8 
        }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {t('Loading drivers...')}
          </Typography>
        </Box>
      ) : searchResults ? (
        <>
          <Card 
            sx={{ 
              boxShadow: '0 6px 30px rgba(0, 0, 0, 0.15)',
              borderRadius: 3,
              overflow: 'hidden',
              background: '#ffffff',
              border: '2px solid rgba(0, 0, 0, 0.06)',
              mb: 4
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {searchResults.items.length === 0 ? (
                <Alert 
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#667eea'
                    }
                  }}
                >
                  {t('No drivers found')}
                </Alert>
              ) : (
                <>
                  {!isMobile ? (
                    <TableContainer 
                      sx={{ 
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow 
                            sx={{ 
                              backgroundColor: '#f8f9fa',
                              borderBottom: '2px solid #dee2e6'
                            }}
                          >
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Name')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Resident ID')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Talabat ID')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Personal Number')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Status')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Created At')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Actions')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {searchResults.items.map((driver, index) => {
                            const status = getStatusColor(driver.status);
                            return (
                              <TableRow 
                                key={driver.id}
                                sx={{
                                  backgroundColor: index % 2 === 0 ? 'rgba(102, 126, 234, 0.04)' : 'white',
                                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.12)',
                                    transform: 'scale(1.001)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <TableCell sx={{ fontWeight: 600, color: '#333', py: 2.5 }}>
                                  {driver.name}
                                </TableCell>
                                <TableCell sx={{ color: '#666', py: 2.5 }}>
                                  {driver.residentId}
                                </TableCell>
                                <TableCell sx={{ color: '#666', py: 2.5 }}>
                                  {driver.talabatid}
                                </TableCell>
                                <TableCell sx={{ color: '#666', py: 2.5 }}>
                                  {driver.personalNumber}
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <Chip
                                    label={status.label}
                                    size="small"
                                    sx={{
                                      background: status.bg,
                                      color: status.color,
                                      fontWeight: 700,
                                      borderRadius: 2,
                                      px: 1,
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                      border: 'none'
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: '#666', fontSize: '0.875rem', py: 2.5 }}>
                                  {new Date(driver.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <IconButton 
                                    onClick={(e) => handleMenuOpen(e, driver)}
                                    sx={{
                                      color: '#667eea',
                                      '&:hover': {
                                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                        transform: 'rotate(90deg)'
                                      },
                                      transition: 'all 0.3s ease'
                                    }}
                                  >
                                    <AppIcon name="menu" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Stack spacing={2}>
                      {searchResults.items.map((driver) => {
                        const status = getStatusColor(driver.status);
                        return (
                          <Card 
                            key={driver.id}
                            sx={{
                              background: '#ffffff',
                              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
                              borderRadius: 2,
                              border: '1px solid rgba(0, 0, 0, 0.08)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 6px 24px rgba(102, 126, 234, 0.25)',
                                transform: 'translateY(-2px)',
                                borderColor: 'rgba(102, 126, 234, 0.3)'
                              }
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                                  {driver.name}
                                </Typography>
                                <Chip
                                  label={status.label}
                                  size="small"
                                  sx={{
                                    background: status.bg,
                                    color: status.color,
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    border: 'none'
                                  }}
                                />
                              </Box>
                              <Divider sx={{ my: 1.5, borderColor: 'rgba(102, 126, 234, 0.2)' }} />
                              <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Resident ID')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666' }}>
                                    {driver.residentId}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Talabat ID')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666' }}>
                                    {driver.talabatid}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Personal Number')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666' }}>
                                    {driver.personalNumber}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Created At')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                                    {new Date(driver.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <IconButton 
                                  onClick={(e) => handleMenuOpen(e, driver)}
                                  sx={{
                                    color: '#667eea',
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    '&:hover': {
                                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                                      transform: 'rotate(90deg)'
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <AppIcon name="menu" />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Stack>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Box
            sx={{
              mt: 0,
              p: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              background: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              border: '2px solid rgba(0, 0, 0, 0.06)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
              >
                {searchResults.totalCount}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                  {t('Showing')} {(searchData.Page - 1) * searchData.PageSize + 1} -{' '}
                  {Math.min(searchData.Page * searchData.PageSize, searchResults.totalCount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('of')} {searchResults.totalCount} {t('total drivers')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <FormControl size="small">
                <Select 
                  value={searchData.PageSize} 
                  onChange={handlePageSizeChange}
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                    }
                  }}
                >
                  {[5, 10, 20, 50].map(size => (
                    <MenuItem key={size} value={size}>
                      {size} {t('per page')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Pagination
                count={Math.ceil(searchResults.totalCount / searchData.PageSize)}
                page={searchData.Page}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    }
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </>
      ) : null}

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        {selectedDriver && (
          <MenuItem onClick={() => handleOpenEditDialog(selectedDriver)}>
            <ListItemIcon><AppIcon name="edit" size="small" /></ListItemIcon>
            <ListItemText>{t('Edit')}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Add Driver Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('Add New Driver')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label={t('Name')}
              value={newDriver.name}
              onChange={(e) => handleNewDriverChange('name', e.target.value)}
              fullWidth
              required
              disabled={addLoading}
            />
            <TextField
              label={t('Resident ID')}
              value={newDriver.residentId}
              onChange={(e) => handleNewDriverChange('residentId', e.target.value)}
              fullWidth
              required
              disabled={addLoading}
            />
            <TextField
              label={t('Talabat ID')}
              value={newDriver.talabatid}
              onChange={(e) => handleNewDriverChange('talabatid', e.target.value)}
              fullWidth
              required
              disabled={addLoading}
            />
            <TextField
              label={t('Personal Number')}
              value={newDriver.personalNumber}
              onChange={(e) => handleNewDriverChange('personalNumber', e.target.value)}
              fullWidth
              required
              disabled={addLoading}
            />
            
            {/* File Upload Fields */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                {t('Required Documents')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      {t('Id Card')} *
                    </Typography>
                    <Input
                      type="file"
                      inputProps={{ accept: 'image/*,.pdf' }}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                        handleFileChange('idCard', file);
                      }}
                      disabled={addLoading}
                      sx={{ width: '100%' }}
                    />
                    {driverFiles.idCard && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {driverFiles.idCard.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      {t('License')} *
                    </Typography>
                    <Input
                      type="file"
                      inputProps={{ accept: 'image/*,.pdf' }}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                        handleFileChange('license', file);
                      }}
                      disabled={addLoading}
                      sx={{ width: '100%' }}
                    />
                    {driverFiles.license && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {driverFiles.license.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      {t('Profile Image')} *
                    </Typography>
                    <Input
                      type="file"
                      inputProps={{ accept: 'image/*' }}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                        handleFileChange('profileImage', file);
                      }}
                      disabled={addLoading}
                      sx={{ width: '100%' }}
                    />
                    {driverFiles.profileImage && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {driverFiles.profileImage.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      {t('Approval')} *
                    </Typography>
                    <Input
                      type="file"
                      inputProps={{ accept: 'image/*,.pdf' }}
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                        handleFileChange('approval', file);
                      }}
                      disabled={addLoading}
                      sx={{ width: '100%' }}
                    />
                    {driverFiles.approval && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {driverFiles.approval.name}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={handleCloseAddDialog} 
            disabled={addLoading}
          >
            {t('Cancel')}
          </Button>
          <Button 
            onClick={handleAddDriver} 
            variant="contained"
            disabled={addLoading}
            startIcon={addLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {addLoading ? t('Adding...') : t('Add Driver')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Driver Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('Edit Driver')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label={t('Name')}
              value={editDriver.name}
              onChange={(e) => handleEditDriverChange('name', e.target.value)}
              fullWidth
              required
              disabled={editLoading}
            />
            <TextField
              label={t('Resident ID')}
              value={editDriver.residentId}
              onChange={(e) => handleEditDriverChange('residentId', e.target.value)}
              fullWidth
              required
              disabled={editLoading}
            />
            <TextField
              label={t('Talabat ID')}
              value={editDriver.talabatid}
              onChange={(e) => handleEditDriverChange('talabatid', e.target.value)}
              fullWidth
              required
              disabled={editLoading}
            />
            <TextField
              label={t('Personal Number')}
              value={editDriver.personalNumber}
              onChange={(e) => handleEditDriverChange('personalNumber', e.target.value)}
              fullWidth
              required
              disabled={editLoading}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={handleCloseEditDialog} 
            disabled={editLoading}
          >
            {t('Cancel')}
          </Button>
          <Button 
            onClick={handleUpdateDriver} 
            variant="contained"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {editLoading ? t('Updating...') : t('Update Driver')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
