// SCHEDULE OVERVIEW PAGE WITH CALENDAR VIEW

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useMediaQuery,
  useTheme,
  Stack,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { AppIcon } from 'src/components/icons';
import { useTranslate } from 'src/locales';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';

interface ApiDayData {
  date: number;
  day: string;
  tripsCount: number;
  totalCash: number;
  totalTips: number;
  kmStart: number;
  kmEnd: number;
}

interface ApiResponse {
  year: number;
  month: string;
  days: ApiDayData[];
  totalOrders: number;
  totalDistance: number;
  totalActiveDays: number;
  totalCash: number;
  totalTips: number;
}

interface DayData {
  date: number;
  count: number;
  hasActivity: boolean;
  totalCash: number;
  totalTips: number;
  distance: number;
}

interface MonthData {
  year: number;
  month: number;
  days: DayData[];
  totalOrders: number;
  totalDistance: number;
  activeDays: number;
  totalCash: number;
  totalTips: number;
}

interface DriverOption {
  id: number;
  name: string;
  mobileNumber: string;
}

// Convert API response to MonthData
const convertApiToMonthData = (apiData: ApiResponse): MonthData => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = monthNames.findIndex(m => m === apiData.month) + 1;
  
  const days: DayData[] = apiData.days.map(day => ({
    date: day.date,
    count: day.tripsCount,
    hasActivity: day.tripsCount > 0,
    totalCash: day.totalCash,
    totalTips: day.totalTips,
    distance: day.kmEnd - day.kmStart
  }));
  
  return {
    year: apiData.year,
    month: monthIndex,
    days,
    totalOrders: apiData.totalOrders,
    totalDistance: apiData.totalDistance,
    activeDays: apiData.totalActiveDays,
    totalCash: apiData.totalCash,
    totalTips: apiData.totalTips
  };
};

export default function ScheduleOverviewPage() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [driversList, setDriversList] = useState<DriverOption[]>([]);
  const [driversLoading, setDriversLoading] = useState(false);

  // Generate years for dropdown (last 5 years + current + next 2)
  const years = Array.from({ length: 8 }, (_, i) => currentDate.getFullYear() - 5 + i);
  
  // Month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Load drivers list on mount
  useEffect(() => {
    loadDriversList();
  }, []);

  // Load data when driver, year or month changes
  useEffect(() => {
    if (selectedDriverId) {
      loadStatistics();
    }
  }, [selectedDriverId, selectedYear, selectedMonth]);

  const loadDriversList = async () => {
    setDriversLoading(true);
    try {
      const response = await apiFetcher(
        CONFIG.admin.driver.all,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        const drivers = response.data as DriverOption[];
        setDriversList(drivers);
        
        // Select the first driver by default if none is selected
        if (drivers.length > 0 && !selectedDriverId) {
          setSelectedDriverId(drivers[0].id);
        }
      }
    } catch (error: any) {
      console.error('Failed to load drivers:', error);
      toast.error(t('Failed to load drivers'));
    } finally {
      setDriversLoading(false);
    }
  };

  const loadStatistics = async () => {
    if (!selectedDriverId) return;

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('year', selectedYear.toString());
      queryParams.append('month', selectedMonth.toString());

      const response = await apiFetcher(
        `${CONFIG.admin.driver.statistics(selectedDriverId.toString())}?${queryParams.toString()}`,
        ApiRequestType.Get
      );

      if (response.success && response.data) {
        const apiData = response.data as ApiResponse;
        const convertedData = convertApiToMonthData(apiData);
        setMonthData(convertedData);
      } else {
        toast.error(response.description || t('Failed to load statistics'));
      }
    } catch (error: any) {
      toast.error(error.message || t('Failed to load statistics'));
    } finally {
      setLoading(false);
    }
  };

  const handleDriverChange = (event: any) => {
    const driverId = event.target.value;
    setSelectedDriverId(driverId);
  };

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
  };

  // Get calendar grid data (including previous/next month days for complete weeks)
  const getCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    
    const calendarDays: Array<{
      date: number;
      isCurrentMonth: boolean;
      data?: DayData;
    }> = [];
    
    // Add previous month's days
    const prevMonthLastDay = new Date(selectedYear, selectedMonth - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayData = monthData?.days.find(d => d.date === i);
      calendarDays.push({
        date: i,
        isCurrentMonth: true,
        data: dayData
      });
    }
    
    // Add next month's days to complete the grid
    const remainingDays = 42 - calendarDays.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: i,
        isCurrentMonth: false
      });
    }
    
    return calendarDays;
  };

  const calendarDays = monthData ? getCalendarDays() : [];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box sx={{ 
      width: '100%', 
      mx: 'auto', 
      p: { xs: 1.5, sm: 2, md: 2.5 }, 
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          mb: 2.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}
          >
            {t('Schedule Overview')}
          </Typography>
        </Box>
        
        {/* Driver, Year and Month Filters */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('Driver')}</InputLabel>
            <Select
              value={selectedDriverId || ''}
              label={t('Driver')}
              onChange={handleDriverChange}
              disabled={driversLoading}
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
              <MenuItem value="">{t('Select Driver')}</MenuItem>
              {driversList.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>{t('Year')}</InputLabel>
            <Select
              value={selectedYear}
              label={t('Year')}
              onChange={handleYearChange}
              disabled={!selectedDriverId}
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
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('Month')}</InputLabel>
            <Select
              value={selectedMonth}
              label={t('Month')}
              onChange={handleMonthChange}
              disabled={!selectedDriverId}
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
              {months.map((month, index) => (
                <MenuItem key={month} value={index + 1}>
                  {t(month)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          py: 8 
        }}>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {t('Loading statistics...')}
          </Typography>
        </Box>
      )}

      {/* No Driver Selected */}
      {!loading && !selectedDriverId && (
        <Alert 
          severity="info"
          sx={{
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: '#667eea'
            }
          }}
        >
          {t('Please select a driver to view statistics')}
        </Alert>
      )}

      {/* Calendar Card */}
      {!loading && selectedDriverId && monthData && (
        <>
          <Card 
            sx={{ 
              mb: 2.5,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: '#333'
                }}
              >
                {months[selectedMonth - 1]} {selectedYear}
              </Typography>

          {/* Calendar Grid */}
          <Box>
            {/* Week day headers */}
            <Grid container spacing={0.75} sx={{ mb: 0.75 }}>
              {weekDays.map((day) => (
                <Grid item xs={12/7} key={day}>
                  <Box 
                    sx={{ 
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#666',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      py: 0.75
                    }}
                  >
                    {t(day)}
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Calendar days */}
            <Grid container spacing={0.75}>
              {calendarDays.map((day, index) => (
                <Grid item xs={12/7} key={index}>
                  <Box
                    sx={{
                      aspectRatio: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: day.isCurrentMonth 
                        ? (day.data?.hasActivity ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0, 0, 0, 0.08)')
                        : 'transparent',
                      backgroundColor: day.isCurrentMonth
                        ? (day.data?.hasActivity ? 'rgba(134, 239, 172, 0.15)' : 'rgba(249, 250, 251, 0.5)')
                        : 'transparent',
                      position: 'relative',
                      cursor: day.data?.hasActivity ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      '&:hover': day.data?.hasActivity ? {
                        backgroundColor: 'rgba(134, 239, 172, 0.25)',
                        borderColor: 'rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                      } : {},
                      minHeight: { xs: 25, sm: 32, md: 35 }
                    }}
                  >
                    {/* Day number */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        fontWeight: day.isCurrentMonth ? 600 : 400,
                        color: day.isCurrentMonth ? '#333' : '#ccc',
                        mb: day.data?.hasActivity ? 0.2 : 0
                      }}
                    >
                      {day.date}
                    </Typography>

                    {/* Activity indicator */}
                    {day.data?.hasActivity && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
                        <Box
                          sx={{
                            width: { xs: 4, sm: 5 },
                            height: { xs: 4, sm: 5 },
                            borderRadius: '50%',
                            backgroundColor: '#667eea',
                            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.4)'
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: { xs: '0.55rem', sm: '0.6rem' },
                            fontWeight: 600,
                            color: '#667eea'
                          }}
                        >
                          {day.data.count}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Grid container spacing={2}>
        {/* Total Orders This Month */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(102, 126, 234, 0.2)',
                transform: 'translateY(-3px)',
                borderColor: 'rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {t('Total Orders')}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {monthData.totalOrders}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <AppIcon name="viewList" size="small" sx={{ color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Distance */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(6, 214, 160, 0.2)',
                transform: 'translateY(-3px)',
                borderColor: 'rgba(6, 214, 160, 0.3)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {t('Total Distance')}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {monthData.totalDistance.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>km</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(6, 214, 160, 0.3)'
                  }}
                >
                  <AppIcon name="analytics" size="small" sx={{ color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Days */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(139, 92, 246, 0.2)',
                transform: 'translateY(-3px)',
                borderColor: 'rgba(139, 92, 246, 0.3)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {t('Active Days')}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {monthData.activeDays}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <AppIcon name="event" size="small" sx={{ color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Cash */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(245, 158, 11, 0.2)',
                transform: 'translateY(-3px)',
                borderColor: 'rgba(245, 158, 11, 0.3)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {t('Total Cash')}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {monthData.totalCash.toFixed(2)} <span style={{ fontSize: '0.9rem' }}>OMR</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <AppIcon name="businessCenter" size="small" sx={{ color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Tips */}
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(236, 72, 153, 0.2)',
                transform: 'translateY(-3px)',
                borderColor: 'rgba(236, 72, 153, 0.3)'
              }
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: '0.8rem'
                    }}
                  >
                    {t('Total Tips')}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {monthData.totalTips.toFixed(2)} <span style={{ fontSize: '0.9rem' }}>OMR</span>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                  }}
                >
                  <AppIcon name="localOffer" size="small" sx={{ color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
        </>
      )}
    </Box>
  );
}

