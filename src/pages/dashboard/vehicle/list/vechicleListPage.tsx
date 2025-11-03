// VEHICLE LIST PAGE WITH PAGINATION AND SEARCH

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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  InputLabel,
  Pagination,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AppIcon } from 'src/components/icons';
import { useNavigate } from 'react-router-dom';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { hasPermission, PermissionsCodes } from 'src/auth/guard/permission-guard';

interface VehicleSearchInput {
  Type?: number; // 1 = car, 2 = bike
  Search: string;
  Page: number;
  PageSize: number;
}

interface DriverOption {
  id: number;
  name: string;
  mobileNumber: string;
}

interface Driver {
  id: number;
  name: string;
  personalNumber: string;
}

interface VehicleItem {
  id: number;
  type: number; // 1 = car, 2 = bike
  plateNumber: string;
  createdAt: string;
  updatedAt: string;
  driverId: number | null;
  driver: Driver | null;
}

interface VehicleSearchResponse {
  items: VehicleItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function VehicleListPage() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchData, setSearchData] = useState<VehicleSearchInput>({
    Type: undefined,
    Search: '',
    Page: 1,
    PageSize: 10
  });

  const [searchResults, setSearchResults] = useState<VehicleSearchResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
  const [driversList, setDriversList] = useState<DriverOption[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  
  // Add Vehicle Dialog State
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: 1 as number, // Default to car
    plateNumber: '',
    driverId: 0
  });

  // Edit Vehicle Dialog State
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [editVehicle, setEditVehicle] = useState({
    type: 1 as number,
    plateNumber: '',
    driverId: 0
  });

  // Load drivers list on mount
  useEffect(() => {
    loadDriversList();
  }, []);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData.Page, searchData.PageSize]);

  const loadDriversList = async () => {
    setDriversLoading(true);
    try {
      const response = await apiFetcher(
        CONFIG.admin.driver.all,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        setDriversList(response.data as DriverOption[]);
      }
    } catch (error: any) {
      console.error('Failed to load drivers:', error);
    } finally {
      setDriversLoading(false);
    }
  };

  const handleInputChange = (field: keyof VehicleSearchInput, value: string | number | undefined) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchData.Type !== undefined && searchData.Type !== null) {
        queryParams.append('Type', searchData.Type.toString());
      }
      if (searchData.Search) queryParams.append('Search', searchData.Search);
      queryParams.append('Page', searchData.Page.toString());
      queryParams.append('PageSize', searchData.PageSize.toString());

      const response = await apiFetcher(
        `${CONFIG.admin.vehicle.list}?${queryParams.toString()}`,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        setSearchResults(response.data as VehicleSearchResponse);
      } else {
        toast.error(response.description || t('Failed to load vehicles'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to load vehicles'));
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
      Type: undefined,
      Search: '',
      Page: 1
    }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vehicle: VehicleItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewVehicle({
      type: 1,
      plateNumber: '',
      driverId: 0
    });
  };

  const handleNewVehicleChange = (field: string, value: string | number) => {
    setNewVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleAddVehicle = async () => {
    // Validate inputs
    if (!newVehicle.plateNumber.trim()) {
      toast.error(t('Please fill all required fields'));
      return;
    }

    setAddLoading(true);
    try {
      const vehicleData = {
        type: newVehicle.type,
        plateNumber: newVehicle.plateNumber,
        driverId: newVehicle.driverId || 0
      };

      const response = await apiFetcher(
        CONFIG.admin.vehicle.add,
        ApiRequestType.Post,
        undefined,
        vehicleData
      );

      if (response.success) {
        toast.success(t('Vehicle added successfully'));
        handleCloseAddDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to add vehicle'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to add vehicle'));
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenEditDialog = (vehicle: VehicleItem) => {
    setEditingVehicle(vehicle);
    setEditVehicle({
      type: vehicle.type,
      plateNumber: vehicle.plateNumber,
      driverId: vehicle.driverId || 0
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingVehicle(null);
    setEditVehicle({
      type: 1,
      plateNumber: '',
      driverId: 0
    });
  };

  const handleEditVehicleChange = (field: string, value: string | number) => {
    setEditVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;

    // Validate inputs
    if (!editVehicle.plateNumber.trim()) {
      toast.error(t('Please fill all required fields'));
      return;
    }

    setEditLoading(true);
    try {
      const vehicleData = {
        type: editVehicle.type,
        plateNumber: editVehicle.plateNumber,
        driverId: editVehicle.driverId || 0
      };

      const response = await apiFetcher(
        CONFIG.admin.vehicle.update(editingVehicle.id.toString()),
        ApiRequestType.Put,
        undefined,
        vehicleData
      );

      if (response.success) {
        toast.success(t('Vehicle updated successfully'));
        handleCloseEditDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to update vehicle'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to update vehicle'));
    } finally {
      setEditLoading(false);
    }
  };

  const getTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return t('Car');
      case 2:
        return t('Bike');
      default:
        return t('Unknown');
    }
  };

  const getTypeColor = (type: number) => {
    switch (type) {
      case 1:
        return { 
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white'
        };
      case 2:
        return { 
          bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white'
        };
      default:
        return { 
          bg: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)', 
          color: 'white'
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
            {t('Vehicles List')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Manage and view all registered vehicles')}
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
          {t('Add Vehicle')}
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>{t('Type')}</InputLabel>
                <Select
                  value={searchData.Type ?? ''}
                  label={t('Type')}
                  onChange={(e) => handleInputChange('Type', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={searchLoading}
                  sx={{
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
                  <MenuItem value="">{t('All Types')}</MenuItem>
                  <MenuItem value={1}>{t('Car')}</MenuItem>
                  <MenuItem value={2}>{t('Bike')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label={t('Search')}
                placeholder={t('Search by plate number...')}
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
            <Grid item xs={6} md={2.5}>
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
            <Grid item xs={6} md={2.5}>
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
            {t('Loading vehicles...')}
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
                  {t('No vehicles found')}
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
                              {t('Plate Number')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Type')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Driver')}
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
                          {searchResults.items.map((vehicle, index) => {
                            const typeColor = getTypeColor(vehicle.type);
                            return (
                              <TableRow 
                                key={vehicle.id}
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
                                  {vehicle.plateNumber}
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <Chip
                                    label={getTypeLabel(vehicle.type)}
                                    size="small"
                                    sx={{
                                      background: typeColor.bg,
                                      color: typeColor.color,
                                      fontWeight: 700,
                                      borderRadius: 2,
                                      px: 1,
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                      border: 'none'
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: '#666', py: 2.5 }}>
                                  {vehicle.driver ? (
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {vehicle.driver.name}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: '#999' }}>
                                        {vehicle.driver.personalNumber}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                                      {t('No driver assigned')}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell sx={{ color: '#666', fontSize: '0.875rem', py: 2.5 }}>
                                  {new Date(vehicle.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <IconButton 
                                    onClick={(e) => handleMenuOpen(e, vehicle)}
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
                      {searchResults.items.map((vehicle) => {
                        const typeColor = getTypeColor(vehicle.type);
                        return (
                          <Card 
                            key={vehicle.id}
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
                                  {vehicle.plateNumber}
                                </Typography>
                                <Chip
                                  label={getTypeLabel(vehicle.type)}
                                  size="small"
                                  sx={{
                                    background: typeColor.bg,
                                    color: typeColor.color,
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
                                    {t('Driver')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666' }}>
                                    {vehicle.driver ? `${vehicle.driver.name} (${vehicle.driver.personalNumber})` : t('No driver assigned')}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Created At')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                                    {new Date(vehicle.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <IconButton 
                                  onClick={(e) => handleMenuOpen(e, vehicle)}
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
                  {t('of')} {searchResults.totalCount} {t('total vehicles')}
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
        {selectedVehicle && (
          <MenuItem onClick={() => handleOpenEditDialog(selectedVehicle)}>
            <ListItemIcon><AppIcon name="edit" size="small" /></ListItemIcon>
            <ListItemText>{t('Edit')}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Add Vehicle Dialog */}
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
            {t('Add New Vehicle')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>{t('Type')}</InputLabel>
              <Select
                value={newVehicle.type}
                label={t('Type')}
                onChange={(e) => handleNewVehicleChange('type', Number(e.target.value))}
                disabled={addLoading}
              >
                <MenuItem value={1}>{t('Car')}</MenuItem>
                <MenuItem value={2}>{t('Bike')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('Plate Number')}
              value={newVehicle.plateNumber}
              onChange={(e) => handleNewVehicleChange('plateNumber', e.target.value)}
              fullWidth
              required
              disabled={addLoading}
            />
            <FormControl fullWidth>
              <InputLabel>{t('Driver')}</InputLabel>
              <Select
                value={newVehicle.driverId}
                label={t('Driver')}
                onChange={(e) => handleNewVehicleChange('driverId', Number(e.target.value))}
                disabled={addLoading || driversLoading}
              >
                <MenuItem value={0}>{t('No driver assigned')}</MenuItem>
                {driversList.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name} ({driver.mobileNumber})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={handleAddVehicle} 
            variant="contained"
            disabled={addLoading}
            startIcon={addLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {addLoading ? t('Adding...') : t('Add Vehicle')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Vehicle Dialog */}
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
            {t('Edit Vehicle')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>{t('Type')}</InputLabel>
              <Select
                value={editVehicle.type}
                label={t('Type')}
                onChange={(e) => handleEditVehicleChange('type', Number(e.target.value))}
                disabled={editLoading}
              >
                <MenuItem value={1}>{t('Car')}</MenuItem>
                <MenuItem value={2}>{t('Bike')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('Plate Number')}
              value={editVehicle.plateNumber}
              onChange={(e) => handleEditVehicleChange('plateNumber', e.target.value)}
              fullWidth
              required
              disabled={editLoading}
            />
            <FormControl fullWidth>
              <InputLabel>{t('Driver')}</InputLabel>
              <Select
                value={editVehicle.driverId}
                label={t('Driver')}
                onChange={(e) => handleEditVehicleChange('driverId', Number(e.target.value))}
                disabled={editLoading || driversLoading}
              >
                <MenuItem value={0}>{t('No driver assigned')}</MenuItem>
                {driversList.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name} ({driver.mobileNumber})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={handleUpdateVehicle} 
            variant="contained"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {editLoading ? t('Updating...') : t('Update Vehicle')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
