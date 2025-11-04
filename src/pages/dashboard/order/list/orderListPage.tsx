// ORDER LIST PAGE WITH PAGINATION AND SEARCH

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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppIcon } from 'src/components/icons';
import { useNavigate } from 'react-router-dom';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { hasPermission, PermissionsCodes } from 'src/auth/guard/permission-guard';

interface OrderSearchInput {
  driverId?: number;
  date?: string; // ISO format: "2025-11-04T08:55:52.986Z"
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
  talabatId: string;
  residentId: string;
}

interface OrderItem {
  id: number;
  tips: number;
  cash: number;
  status: number;
  driver: Driver;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderSearchResponse {
  items: OrderItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface OrderListPageProps {
  driverId?: number;
  date?: string;
}

export default function OrderListPage({ driverId, date }: OrderListPageProps) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchData, setSearchData] = useState<OrderSearchInput>({
    driverId: driverId,
    date: date,
    Search: '',
    Page: 1,
    PageSize: 10
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchResults, setSearchResults] = useState<OrderSearchResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [driversList, setDriversList] = useState<DriverOption[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  
  // Add Order Dialog State
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newOrder, setNewOrder] = useState({
    tips: 0,
    cash: 0,
    driverId: 0,
    date: new Date().toISOString()
  });

  // Edit Order Dialog State
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [editOrder, setEditOrder] = useState({
    tips: 0,
    cash: 0,
    driverId: 0,
    status: 1,
    date: new Date().toISOString()
  });

  // Delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleInputChange = (field: keyof OrderSearchInput, value: string | number | undefined) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setSearchData(prev => ({ ...prev, date: date.toISOString() }));
    } else {
      setSearchData(prev => ({ ...prev, date: undefined }));
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchData.driverId !== undefined && searchData.driverId !== null) {
        queryParams.append('driverId', searchData.driverId.toString());
      }
      if (searchData.date) {
        queryParams.append('date', searchData.date);
      }
      if (searchData.Search) queryParams.append('Search', searchData.Search);
      queryParams.append('page', searchData.Page.toString());
      queryParams.append('pageSize', searchData.PageSize.toString());

      const response = await apiFetcher(
        `${CONFIG.admin.order.list}?${queryParams.toString()}`,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        setSearchResults(response.data as OrderSearchResponse);
      } else {
        toast.error(response.description || t('Failed to load orders'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to load orders'));
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
      driverId: undefined,
      date: undefined,
      Search: '',
      Page: 1
    }));
    setSelectedDate(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: OrderItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setNewOrder({
      tips: 0,
      cash: 0,
      driverId: 0,
      date: new Date().toISOString()
    });
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewOrder({
      tips: 0,
      cash: 0,
      driverId: 0,
      date: new Date().toISOString()
    });
  };

  const handleNewOrderChange = (field: string, value: string | number) => {
    setNewOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleAddOrder = async () => {
    // Validate inputs
    if (!newOrder.driverId) {
      toast.error(t('Please select a driver'));
      return;
    }

    setAddLoading(true);
    try {
      const orderData = [{
        tips: Number(newOrder.tips),
        cash: Number(newOrder.cash),
        driverId: newOrder.driverId,
        date: newOrder.date
      }];

      const response = await apiFetcher(
        CONFIG.admin.order.add,
        ApiRequestType.Post,
        undefined,
        orderData
      );

      if (response.success) {
        toast.success(t('Order added successfully'));
        handleCloseAddDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to add order'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to add order'));
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenEditDialog = (order: OrderItem) => {
    setEditingOrder(order);
    setEditOrder({
      tips: order.tips,
      cash: order.cash,
      driverId: order.driver.id,
      status: order.status,
      date: order.date
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingOrder(null);
    setEditOrder({
      tips: 0,
      cash: 0,
      driverId: 0,
      status: 1,
      date: new Date().toISOString()
    });
  };

  const handleEditOrderChange = (field: string, value: string | number) => {
    setEditOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    // Validate inputs
    if (!editOrder.driverId) {
      toast.error(t('Please select a driver'));
      return;
    }

    setEditLoading(true);
    try {
      const orderData = {
        tips: Number(editOrder.tips),
        cash: Number(editOrder.cash),
        driverId: editOrder.driverId,
        status: editOrder.status,
        date: editOrder.date
      };

      const response = await apiFetcher(
        CONFIG.admin.order.update(editingOrder.id.toString()),
        ApiRequestType.Put,
        undefined,
        orderData
      );

      if (response.success) {
        toast.success(t('Order updated successfully'));
        handleCloseEditDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to update order'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to update order'));
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    setDeleteLoading(true);
    try {
      const response = await apiFetcher(
        CONFIG.admin.order.delete(selectedOrder.id.toString()),
        ApiRequestType.Delete
      );

      if (response.success) {
        toast.success(t('Order deleted successfully'));
        handleCloseDeleteDialog();
        handleSearch(); // Refresh the list
      } else {
        toast.error(response.description || t('Failed to delete order'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to delete order'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return t('Completed');
      case 2:
        return t('Pending');
      case 3:
        return t('Deleted');
      default:
        return t('Unknown');
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: // Completed
        return { 
          bg: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)', 
          color: 'white'
        };
      case 2: // Pending
        return { 
          bg: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', 
          color: 'white'
        };
      case 3: // Deleted
        return { 
          bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
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
            {t('Orders List')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Manage and view all orders')}
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
          {t('Add Order')}
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
                <InputLabel>{t('Driver')}</InputLabel>
                <Select
                  value={searchData.driverId ?? ''}
                  label={t('Driver')}
                  onChange={(e) => handleInputChange('driverId', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={searchLoading || driversLoading}
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
                  <MenuItem value="">{t('All Drivers')}</MenuItem>
                  {driversList.map((driver) => (
                    <MenuItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('Date')}
                  value={selectedDate}
                  onChange={handleDateChange}
                  disabled={searchLoading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                          }
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label={t('Search')}
                placeholder={t('Search orders...')}
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
            <Grid item xs={6} md={1.5}>
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
            <Grid item xs={6} md={1.5}>
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
            {t('Loading orders...')}
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
                  {t('No orders found')}
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
                              {t('ID')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Driver')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Tips')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Cash')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Status')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Date')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Actions')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {searchResults.items.map((order, index) => {
                            const statusColor = getStatusColor(order.status);
                            return (
                              <TableRow 
                                key={order.id}
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
                                  #{order.id}
                                </TableCell>
                                <TableCell sx={{ color: '#666', py: 2.5 }}>
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {order.driver.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#999' }}>
                                      {order.driver.personalNumber}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#06d6a0', py: 2.5 }}>
                                  {order.tips.toFixed(2)} OMR
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#667eea', py: 2.5 }}>
                                  {order.cash.toFixed(2)} OMR
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <Chip
                                    label={getStatusLabel(order.status)}
                                    size="small"
                                    sx={{
                                      background: statusColor.bg,
                                      color: statusColor.color,
                                      fontWeight: 700,
                                      borderRadius: 2,
                                      px: 1,
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                      border: 'none'
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: '#666', fontSize: '0.875rem', py: 2.5 }}>
                                  {new Date(order.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </TableCell>
                                <TableCell sx={{ py: 2.5 }}>
                                  <IconButton 
                                    onClick={(e) => handleMenuOpen(e, order)}
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
                      {searchResults.items.map((order) => {
                        const statusColor = getStatusColor(order.status);
                        return (
                          <Card 
                            key={order.id}
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
                                  Order #{order.id}
                                </Typography>
                                <Chip
                                  label={getStatusLabel(order.status)}
                                  size="small"
                                  sx={{
                                    background: statusColor.bg,
                                    color: statusColor.color,
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
                                    {order.driver.name} ({order.driver.personalNumber})
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Tips')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#06d6a0', fontWeight: 600 }}>
                                    {order.tips.toFixed(2)} OMR
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Cash')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600 }}>
                                    {order.cash.toFixed(2)} OMR
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea', minWidth: 120 }}>
                                    {t('Date')}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                                    {new Date(order.date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <IconButton 
                                  onClick={(e) => handleMenuOpen(e, order)}
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
                  {t('of')} {searchResults.totalCount} {t('total orders')}
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
        {selectedOrder && (
          <>
            <MenuItem onClick={() => handleOpenEditDialog(selectedOrder)}>
              <ListItemIcon><AppIcon name="edit" size="small" /></ListItemIcon>
              <ListItemText>{t('Edit')}</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleOpenDeleteDialog}>
              <ListItemIcon><AppIcon name="delete" size="small" /></ListItemIcon>
              <ListItemText>{t('Delete')}</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Add Order Dialog */}
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
            {t('Add New Order')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>{t('Driver')}</InputLabel>
              <Select
                value={newOrder.driverId}
                label={t('Driver')}
                onChange={(e) => handleNewOrderChange('driverId', Number(e.target.value))}
                disabled={addLoading || driversLoading}
              >
                <MenuItem value={0}>{t('Select driver')}</MenuItem>
                {driversList.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name} ({driver.mobileNumber})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('Tips')}
              type="number"
              value={newOrder.tips}
              onChange={(e) => handleNewOrderChange('tips', Number(e.target.value))}
              fullWidth
              disabled={addLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label={t('Cash')}
              type="number"
              value={newOrder.cash}
              onChange={(e) => handleNewOrderChange('cash', Number(e.target.value))}
              fullWidth
              disabled={addLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('Date')}
                value={new Date(newOrder.date)}
                onChange={(date) => date && handleNewOrderChange('date', date.toISOString())}
                disabled={addLoading}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </LocalizationProvider>
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
            onClick={handleAddOrder} 
            variant="contained"
            disabled={addLoading}
            startIcon={addLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {addLoading ? t('Adding...') : t('Add Order')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Dialog */}
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
            {t('Edit Order')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth required>
              <InputLabel>{t('Driver')}</InputLabel>
              <Select
                value={editOrder.driverId}
                label={t('Driver')}
                onChange={(e) => handleEditOrderChange('driverId', Number(e.target.value))}
                disabled={editLoading || driversLoading}
              >
                <MenuItem value={0}>{t('Select driver')}</MenuItem>
                {driversList.map((driver) => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name} ({driver.mobileNumber})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t('Tips')}
              type="number"
              value={editOrder.tips}
              onChange={(e) => handleEditOrderChange('tips', Number(e.target.value))}
              fullWidth
              disabled={editLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label={t('Cash')}
              type="number"
              value={editOrder.cash}
              onChange={(e) => handleEditOrderChange('cash', Number(e.target.value))}
              fullWidth
              disabled={editLoading}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth required>
              <InputLabel>{t('Status')}</InputLabel>
              <Select
                value={editOrder.status}
                label={t('Status')}
                onChange={(e) => handleEditOrderChange('status', Number(e.target.value))}
                disabled={editLoading}
              >
                <MenuItem value={1}>{t('Completed')}</MenuItem>
                <MenuItem value={2}>{t('Pending')}</MenuItem>
                <MenuItem value={3}>{t('Deleted')}</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('Date')}
                value={new Date(editOrder.date)}
                onChange={(date) => date && handleEditOrderChange('date', date.toISOString())}
                disabled={editLoading}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </LocalizationProvider>
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
            onClick={handleUpdateOrder} 
            variant="contained"
            disabled={editLoading}
            startIcon={editLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {editLoading ? t('Updating...') : t('Update Order')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
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
            {t('Delete Order')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('Are you sure you want to delete this order? This action cannot be undone.')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={deleteLoading}
          >
            {t('Cancel')}
          </Button>
          <Button 
            onClick={handleDeleteOrder} 
            variant="contained"
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {deleteLoading ? t('Deleting...') : t('Delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
