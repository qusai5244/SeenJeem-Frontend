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
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AppIcon } from 'src/components/icons';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';

interface DriverReportSearchInput {
  DriverId?: number;
  DateFrom?: string;
  DateTo?: string;
  Search: string;
  Page: number;
  PageSize: number;
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
  totalCash: number;
  totalKm: number;
}

interface DriverReportResponse {
  driverReports: DriverReport[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export default function DriverReportsPage() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [searchData, setSearchData] = useState<DriverReportSearchInput>({
    DriverId: undefined,
    DateFrom: undefined,
    DateTo: undefined,
    Search: '',
    Page: 1,
    PageSize: 10
  });

  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const [reportData, setReportData] = useState<DriverReportResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [driversList, setDriversList] = useState<DriverOption[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);

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

  const handleInputChange = (field: keyof DriverReportSearchInput, value: string | number | undefined) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFromChange = (date: Date | null) => {
    setDateFrom(date);
    handleInputChange('DateFrom', date ? date.toISOString() : undefined);
  };

  const handleDateToChange = (date: Date | null) => {
    setDateTo(date);
    handleInputChange('DateTo', date ? date.toISOString() : undefined);
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
      queryParams.append('Page', searchData.Page.toString());
      queryParams.append('PageSize', searchData.PageSize.toString());

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
      DriverId: undefined,
      DateFrom: undefined,
      DateTo: undefined,
      Search: '',
      Page: 1
    }));
    setDateFrom(null);
    setDateTo(null);
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
                <DateTimePicker
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
                <DateTimePicker
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
            <Grid item xs={6} md={2.5}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={reportLoading}
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
            <Grid item xs={6} md={2.5}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={clearSearch} 
                disabled={reportLoading}
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
              {reportData.driverReports.length === 0 ? (
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
                              {t('Total Cash')}
                            </TableCell>
                            <TableCell sx={{ color: '#212529', fontWeight: 700, fontSize: '0.95rem', py: 2.5, backgroundColor: '#e9ecef' }}>
                              {t('Total KM')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.driverReports.map((report, index) => (
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
                                {report.totalCash.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ color: '#666', py: 2.5, fontWeight: 600 }}>
                                {report.totalKm.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Stack spacing={2}>
                      {reportData.driverReports.map((report) => (
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
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {reportData.driverReports.length > 0 && (
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
                  {reportData.totalCount ?? reportData.driverReports.length}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                    {t('Showing')} {(searchData.Page - 1) * searchData.PageSize + 1} -{' '}
                    {Math.min(searchData.Page * searchData.PageSize, reportData.totalCount ?? reportData.driverReports.length)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('of')} {reportData.totalCount ?? reportData.driverReports.length} {t('total reports')}
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
                  count={reportData.totalPages ?? Math.ceil((reportData.totalCount ?? reportData.driverReports.length) / searchData.PageSize)}
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
          )}
        </>
      ) : null}
    </Box>
  );
}

