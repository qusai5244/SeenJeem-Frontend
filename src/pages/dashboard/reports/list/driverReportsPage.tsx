// DRIVER REPORTS PAGE WITH PAGINATION AND SEARCH

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
  Alert,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppIcon } from 'src/components/icons';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import * as XLSX from 'xlsx';

interface DriverReportSearchInput {
  DriverId?: number;
  DateFrom?: string;
  DateTo?: string;
  Search: string;
}

interface DriverOption {
  id: number;
  name: string;
  mobileNumber: string;
}

interface DriverReport {
  id: number;
  name: string;
  residentId: string;
  talabatId: string;
  personalNumber: string;
  plateNumber: string | null;
  totalOrders: number;
  totalTips: number;
  totalTalabatTips: number;
  totalCustomerTips: number;
  totalCash: number;
  totalKm: number;
  totalCashOnDeliveries: number;
  totalCashOnDeliveriesTalabat: number;
}

interface DriverReportResponse {
  items: DriverReport[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export default function DriverReportsPage() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Set today's date as default
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  const [searchData, setSearchData] = useState<DriverReportSearchInput>({
    DriverId: undefined,
    DateFrom: startOfToday.toISOString(),
    DateTo: endOfToday.toISOString(),
    Search: ''
  });

  const [dateFrom, setDateFrom] = useState<Date | null>(startOfToday);
  const [dateTo, setDateTo] = useState<Date | null>(endOfToday);

  const [reportData, setReportData] = useState<DriverReportResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [driversList, setDriversList] = useState<DriverOption[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Cash On Delivery Dialog States
  const [codDialogOpen, setCodDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverReport | null>(null);
  const [codAmount, setCodAmount] = useState<string>('');
  const [codDate, setCodDate] = useState<Date | null>(new Date());
  const [codLoading, setCodLoading] = useState(false);

  // Talabat Cash On Delivery Dialog States
  const [talabatCodDialogOpen, setTalabatCodDialogOpen] = useState(false);
  const [talabatCodAmount, setTalabatCodAmount] = useState<string>('');
  const [talabatCodDate, setTalabatCodDate] = useState<Date | null>(new Date());
  const [talabatCodLoading, setTalabatCodLoading] = useState(false);

  // Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDriverId, setMenuDriverId] = useState<number | null>(null);

  // Load drivers list on mount
  useEffect(() => {
    loadDriversList();
    handleSearch(); // Load today's data automatically
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  const handleInputChange = (field: keyof DriverReportSearchInput, value: string | number | undefined) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFromChange = (date: Date | null) => {
    setDateFrom(date);
    if (date) {
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      handleInputChange('DateFrom', startOfDay.toISOString());
    } else {
      handleInputChange('DateFrom', undefined);
    }
  };

  const handleDateToChange = (date: Date | null) => {
    setDateTo(date);
    if (date) {
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      handleInputChange('DateTo', endOfDay.toISOString());
    } else {
      handleInputChange('DateTo', undefined);
    }
  };

  const handleSearch = async () => {
    setReportLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchData.DriverId !== undefined && searchData.DriverId !== null) {
        queryParams.append('DriverId', searchData.DriverId.toString());
      }
      if (searchData.DateFrom) queryParams.append('DateFrom', searchData.DateFrom);
      if (searchData.DateTo) queryParams.append('DateTo', searchData.DateTo);
      if (searchData.Search) queryParams.append('Search', searchData.Search);

      const response = await apiFetcher(
        `${CONFIG.admin.driver.reports}?${queryParams.toString()}`,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        setReportData(response.data as DriverReportResponse);
      } else {
        toast.error(response.description || t('Failed to load driver reports'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to load driver reports'));
    } finally {
      setReportLoading(false);
    }
  };

  const clearSearch = () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    setSearchData({
      DriverId: undefined,
      DateFrom: startOfToday.toISOString(),
      DateTo: endOfToday.toISOString(),
      Search: ''
    });
    setDateFrom(startOfToday);
    setDateTo(endOfToday);
  };

  const handleDownloadExcel = async () => {
    setDownloadLoading(true);
    try {
      // Build query params for download (without pagination)
      const queryParams = new URLSearchParams();
      if (searchData.DriverId !== undefined && searchData.DriverId !== null) {
        queryParams.append('DriverId', searchData.DriverId.toString());
      }
      if (searchData.DateFrom) queryParams.append('DateFrom', searchData.DateFrom);
      if (searchData.DateTo) queryParams.append('DateTo', searchData.DateTo);
      if (searchData.Search) queryParams.append('Search', searchData.Search);

      const response = await apiFetcher(
        `${CONFIG.admin.driver.downloadReport}?${queryParams.toString()}`,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        const reports = response.data as DriverReport[];
        
        // Prepare data for Excel
        const excelData = reports.map((report) => ({
          'ID': report.id,
          'Name': report.name,
          'Resident ID': report.residentId,
          'Talabat ID': report.talabatId,
          'Personal Number': report.personalNumber,
          'Plate Number': report.plateNumber || '-',
          'Total Orders': report.totalOrders,
          'Total Tips': report.totalTips.toFixed(2),
          'Talabat Tips': report.totalTalabatTips.toFixed(2),
          'Customer Tips': report.totalCustomerTips.toFixed(2),
          'Total Cash': report.totalCash.toFixed(2),
          'Total KM': report.totalKm.toFixed(2),
          'Total Cash On Deliveries': report.totalCashOnDeliveries.toFixed(2),
        }));

        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Driver Reports');

        // Auto-size columns
        const maxWidth = excelData.reduce((acc, row) => {
          Object.keys(row).forEach((key, i) => {
            const value = String(row[key as keyof typeof row]);
            acc[i] = Math.max(acc[i] || 10, value.length, key.length);
          });
          return acc;
        }, [] as number[]);
        
        worksheet['!cols'] = maxWidth.map(w => ({ width: w + 2 }));

        // Generate filename with current date
        const filename = `Driver_Reports_${new Date().toISOString().split('T')[0]}.xlsx`;

        // Download
        XLSX.writeFile(workbook, filename);
        
        toast.success(t('Report downloaded successfully'));
      } else {
        toast.error(response.description || t('Failed to download report'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to download report'));
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, driverId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuDriverId(driverId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDriverId(null);
  };

  const handleOpenCodDialog = (driver: DriverReport) => {
    setSelectedDriver(driver);
    setCodAmount('');
    setCodDate(new Date());
    setCodDialogOpen(true);
    handleMenuClose(); // Close menu when opening dialog
  };

  const handleCloseCodDialog = () => {
    setCodDialogOpen(false);
    setSelectedDriver(null);
    setCodAmount('');
    setCodDate(new Date());
  };

  const handleAddCashOnDelivery = async () => {
    if (!selectedDriver) return;
    
    const amount = parseFloat(codAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(t('Please enter a valid amount'));
      return;
    }

    if (!codDate) {
      toast.error(t('Please select a date'));
      return;
    }

    setCodLoading(true);
    try {
      const payload = {
        amount: amount,
        category: 1, // Driver
        relatedEntityId: selectedDriver.id,
        date: codDate.toISOString(),
        isPaid: false
      };

      const response = await apiFetcher(
        CONFIG.admin.driver.AddCashOnDelivery,
        ApiRequestType.Post,
        undefined, // params (not needed for this request)
        payload // data (sent in request body)
      );

      if (response.success) {
        toast.success(t('Cash on delivery added successfully'));
        handleCloseCodDialog();
        // Optionally refresh the reports
        handleSearch();
      } else {
        toast.error(response.description || t('Failed to add cash on delivery'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to add cash on delivery'));
    } finally {
      setCodLoading(false);
    }
  };

  const handleOpenTalabatCodDialog = () => {
    setTalabatCodAmount('');
    setTalabatCodDate(new Date());
    setTalabatCodDialogOpen(true);
  };

  const handleCloseTalabatCodDialog = () => {
    setTalabatCodDialogOpen(false);
    setTalabatCodAmount('');
    setTalabatCodDate(new Date());
  };

  const handleAddTalabatCashOnDelivery = async () => {
    const amount = parseFloat(talabatCodAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(t('Please enter a valid amount'));
      return;
    }

    if (!talabatCodDate) {
      toast.error(t('Please select a date'));
      return;
    }

    setTalabatCodLoading(true);
    try {
      const payload = {
        amount: amount,
        category: 2, // Talabat
        relatedEntityId: 0,
        date: talabatCodDate.toISOString(),
        isPaid: false
      };

      const response = await apiFetcher(
        CONFIG.admin.driver.AddCashOnDelivery,
        ApiRequestType.Post,
        undefined,
        payload
      );

      if (response.success) {
        toast.success(t('Talabat cash on delivery added successfully'));
        handleCloseTalabatCodDialog();
        handleSearch();
      } else {
        toast.error(response.description || t('Failed to add Talabat cash on delivery'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to add Talabat cash on delivery'));
    } finally {
      setTalabatCodLoading(false);
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
            {t('Driver Reports')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('View and analyze driver performance reports')}
          </Typography>
        </Box>
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
                  value={searchData.DriverId ?? ''}
                  label={t('Driver')}
                  onChange={(e) => handleInputChange('DriverId', e.target.value === '' ? undefined : Number(e.target.value))}
                  disabled={reportLoading || driversLoading}
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
                      {driver.name} ({driver.mobileNumber})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('Date From')}
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  disabled={reportLoading}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('Date To')}
                  value={dateTo}
                  onChange={handleDateToChange}
                  disabled={reportLoading}
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
                placeholder={t('Search...')}
                value={searchData.Search}
                onChange={(e) => handleInputChange('Search', e.target.value)}
                fullWidth
                disabled={reportLoading}
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
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={reportLoading || downloadLoading}
                startIcon={reportLoading ? <CircularProgress size={20} color="inherit" /> : <AppIcon name="search" />}
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
                {reportLoading ? t('Searching...') : t('Search')}
              </Button>
            </Grid>
            <Grid item xs={6} md={2}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={clearSearch} 
                disabled={reportLoading || downloadLoading}
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
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleDownloadExcel}
                disabled={reportLoading || downloadLoading}
                startIcon={downloadLoading ? <CircularProgress size={20} color="inherit" /> : <AppIcon name="download" />}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
                  boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(6, 214, 160, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {downloadLoading ? t('Downloading...') : t('Download Excel')}
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleOpenTalabatCodDialog}
                disabled={reportLoading || downloadLoading}
                startIcon={<AppIcon name="add" />}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
                  boxShadow: '0 4px 15px rgba(247, 127, 0, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(247, 127, 0, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {t('Add Talabat COD')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {reportLoading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          py: 8 
        }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {t('Loading reports...')}
          </Typography>
        </Box>
      ) : reportData ? (
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
              {reportData.items.length === 0 ? (
                <Alert 
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#667eea'
                    }
                  }}
                >
                  {t('No reports found')}
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
                              {t('Plate Number')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Total Orders')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Total Tips')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Talabat Tips')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Customer Tips')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Total Cash')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Total KM')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Cash On Deliveries')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Actions')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.items.map((report, index) => (
                            <TableRow 
                              key={report.id}
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
                                {report.name}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5 }}>
                                {report.residentId}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5 }}>
                                {report.talabatId}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5 }}>
                                {report.personalNumber}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5 }}>
                                {report.plateNumber || '-'}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalOrders}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalTips.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalTalabatTips.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalCustomerTips.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalCash.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalKm.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalCashOnDeliveries.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ py: 2.5 }}>
                                <IconButton
                                  onClick={(event) => handleMenuOpen(event, report.id)}
                                  sx={{
                                    color: '#667eea',
                                    '&:hover': {
                                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                    }
                                  }}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Stack spacing={2}>
                      {reportData.items.map((report) => (
                        <Card 
                          key={report.id}
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
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
                              {report.name}
                            </Typography>
                            <Stack spacing={1.5}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Resident ID')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {report.residentId}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Talabat ID')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {report.talabatId}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Personal Number')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {report.personalNumber}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Plate Number')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  {report.plateNumber || '-'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Total Orders')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalOrders}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Total Tips')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalTips.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Talabat Tips')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalTalabatTips.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Customer Tips')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalCustomerTips.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Total Cash')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalCash.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Total KM')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalKm.toFixed(2)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                                  {t('Cash On Deliveries')}:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                                  {report.totalCashOnDeliveries.toFixed(2)}
                                </Typography>
                              </Box>
                            </Stack>
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                              <Button
                                fullWidth
                                variant="contained"
                                size="medium"
                                onClick={() => handleOpenCodDialog(report)}
                                startIcon={<AppIcon name="add" />}
                                sx={{
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                                  '&:hover': {
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-1px)',
                                  },
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                {t('Add Cash On Delivery')}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Summary Section */}
          {reportData.items.length > 0 && (
            <Card 
              sx={{ 
                boxShadow: '0 6px 30px rgba(0, 0, 0, 0.15)',
                borderRadius: 3,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <AppIcon name="analytics" />
                  {t('Summary')}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box 
                      sx={{ 
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600,
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {t('Total Cash On Deliveries (With Drivers)')}
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          color: '#ffffff',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 0.5
                        }}
                      >
                        {reportData.items.reduce((sum, item) => sum + item.totalCashOnDeliveries, 0).toFixed(2)}
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {t('OMR')}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box 
                      sx={{ 
                        p: 3,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
                        boxShadow: '0 4px 20px rgba(6, 214, 160, 0.3)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(6, 214, 160, 0.4)',
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600,
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {t('Total Cash On Deliveries (From Talabat)')}
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          color: '#ffffff',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 0.5
                        }}
                      >
                        {reportData.items.length > 0 ? reportData.items[0].totalCashOnDeliveriesTalabat.toFixed(2) : '0.00'}
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {t('OMR')}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Difference Card */}
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        p: 3,
                        borderRadius: 2,
                        background: '#ffffff',
                        border: '2px solid rgba(102, 126, 234, 0.2)',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#666',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        {t('Difference')}:
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: '#667eea',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 0.5
                        }}
                      >
                        {Math.abs(
                          reportData.items.reduce((sum, item) => sum + item.totalCashOnDeliveries, 0) -
                          (reportData.items.length > 0 ? reportData.items[0].totalCashOnDeliveriesTalabat : 0)
                        ).toFixed(2)}
                        <Typography variant="body1" sx={{ color: '#888' }}>
                          {t('OMR')}
                        </Typography>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            mt: 1,
            minWidth: 180,
          }
        }}
      >
        <MenuItem
          onClick={() => {
            const driver = reportData?.items.find(r => r.id === menuDriverId);
            if (driver) handleOpenCodDialog(driver);
          }}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
            }
          }}
        >
          <AppIcon name="add" sx={{ mr: 1.5 }} />
          {t('Add Cash On Delivery')}
        </MenuItem>
      </Menu>

      {/* Add Cash On Delivery Dialog */}
      <Dialog 
        open={codDialogOpen} 
        onClose={handleCloseCodDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          pb: 1
        }}>
          {t('Add Cash On Delivery')}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedDriver && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(102, 126, 234, 0.08)', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
                {selectedDriver.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('Resident ID')}: {selectedDriver.residentId}
              </Typography>
            </Box>
          )}
          <Stack spacing={3}>
            <TextField
              label={t('Amount')}
              type="number"
              value={codAmount}
              onChange={(e) => setCodAmount(e.target.value)}
              fullWidth
              required
              disabled={codLoading}
              inputProps={{ min: 0, step: 0.01 }}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('Date')}
                value={codDate}
                onChange={(date) => setCodDate(date)}
                disabled={codLoading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseCodDialog}
            disabled={codLoading}
            sx={{
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.08)',
              }
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleAddCashOnDelivery}
            variant="contained"
            disabled={codLoading}
            startIcon={codLoading ? <CircularProgress size={20} color="inherit" /> : <AppIcon name="add" />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
              },
              px: 3
            }}
          >
            {codLoading ? t('Adding...') : t('Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Talabat Cash On Delivery Dialog */}
      <Dialog 
        open={talabatCodDialogOpen} 
        onClose={handleCloseTalabatCodDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          pb: 1
        }}>
          {t('Add Talabat Cash On Delivery')}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              label={t('Amount')}
              type="number"
              value={talabatCodAmount}
              onChange={(e) => setTalabatCodAmount(e.target.value)}
              fullWidth
              required
              disabled={talabatCodLoading}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#f77f00',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f77f00',
                  }
                }
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('Date')}
                value={talabatCodDate}
                onChange={(date) => setTalabatCodDate(date)}
                disabled={talabatCodLoading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#f77f00',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#f77f00',
                        }
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseTalabatCodDialog}
            disabled={talabatCodLoading}
            sx={{
              color: '#f77f00',
              '&:hover': {
                backgroundColor: 'rgba(247, 127, 0, 0.08)',
              }
            }}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleAddTalabatCashOnDelivery}
            variant="contained"
            disabled={talabatCodLoading}
            startIcon={talabatCodLoading ? <CircularProgress size={20} color="inherit" /> : <AppIcon name="add" />}
            sx={{
              background: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
              boxShadow: '0 4px 15px rgba(247, 127, 0, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(247, 127, 0, 0.5)',
              },
              px: 3
            }}
          >
            {talabatCodLoading ? t('Adding...') : t('Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

