import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { useTranslation } from 'react-i18next';
import { useGetAnalytics } from 'src/actions/analytics-superAdmin';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function OverviewAnalyticsViewSuperAdmin() {
  const { t } = useTranslation();
  const { analytics, analyticsLoading } = useGetAnalytics();
  
  // Helper function to format top data for charts
  const formatTopData = (data: { key: string; value: string }[] | null) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({ 
      label: item.key, 
      value: parseInt(item.value) || 0 
    }));
  };

  // Helper function to format monthly data for charts
  const formatMonthlyData = (data: number[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({ month, value: data[index] || 0 }));
  };

  // Default chart data for widgets
  const defaultChartData = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    series: [22, 8, 35, 50, 82, 84, 77, 12],
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(4)].map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      ))}
      {[...Array(3)].map((_, index) => (
        <Grid key={`chart-${index}`} size={{ xs: 12, md: 6, lg: 4 }}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
      ))}
      {[...Array(2)].map((_, index) => (
        <Grid key={`bar-${index}`} size={{ xs: 12, md: 6, lg: 6 }}>
          <Skeleton variant="rectangular" height={400} />
        </Grid>
      ))}
    </Grid>
  );
  
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {t("analyticss.welcome")} 👋
      </Typography>

      {analyticsLoading ? (
        <LoadingSkeleton />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3}}>
            <AnalyticsWidgetSummary
              title={t("TotalUsers")}
              percent={2.6}
              total={analytics?.totalUsers || 0}
              icon={<Iconify icon="mdi:account-group" width={48} height={48} />}
              chart={defaultChartData}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <AnalyticsWidgetSummary
              title={t("TotalUsers")}
              percent={-0.1}
              total={35}
              color="secondary"
              icon={
                <img
                  alt={t("analyticss.new_users_alt")}
                  src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`}
                />
              }
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 47, 40, 62, 73, 30, 23, 54],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <AnalyticsWidgetSummary
              title={t("TrainerAssessments")}
              percent={2.8}
              total={17}
              color="warning"
              icon={
                <img
                  alt={t("analyticss.purchase_orders_alt")}
                  src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-buy.svg`}
                />
              }
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [40, 70, 50, 28, 70, 75, 7, 64],
              }}
            />
          </Grid> */}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title={t("TotalForms")}
              percent={3.6}
              total={analytics?.totalEvaluationForms || 0}
              icon={<Iconify icon="mdi:clipboard-text" width={48} height={48} />}
              chart={defaultChartData}
            />
          </Grid>

          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title={t("TotalQuizzes")}
              percent={3.6}
              total={analytics?.totalQuizzes || 0}
              color="secondary"
              icon={<Iconify icon="mdi:help-circle" width={48} height={48} />}
              chart={defaultChartData}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title={t("TotalOrganizations")}
              percent={3.6}
              total={analytics?.totalOrganizations || 0}
              color="warning"
              icon={<Iconify icon="mdi:school" width={48} height={48} />}
              chart={defaultChartData}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsCurrentVisits
              title={t("TopCoursesParticipants")}
              chart={{
                series: analytics?.topCoursesParticipants && analytics.topCoursesParticipants.length > 0
                  ? formatTopData(analytics.topCoursesParticipants)
                  : [{ label: 'No Data', value: 0 }],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsCurrentVisits
              title={t("TopEvaluationFormResponders")}
              chart={{
                series: analytics?.topEvaluatiionFormResponders && analytics.topEvaluatiionFormResponders.length > 0
                  ? formatTopData(analytics.topEvaluatiionFormResponders)
                  : [{ label: 'No Data', value: 0 }],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsCurrentVisits
              title={t("TopQuizzesSubmittion")}
              chart={{
                series: analytics?.topQuizzesSubmittion && analytics.topQuizzesSubmittion.length > 0
                  ? formatTopData(analytics.topQuizzesSubmittion)
                  : [{ label: 'No Data', value: 0 }],
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <AnalyticsWebsiteVisits
              title={t("evaluationFormsCountPerMonth")}
              subheader={`${t('evaluationFormsCountPerMonth')} ${new Date().getFullYear()}`}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                  { 
                    name: t("TotalCount"), 
                    data: analytics?.evaluationFormsPerMonth || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
                  },
                ],
              }}
            />
          </Grid>

          
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <AnalyticsConversionRates
              title={t("QuizzesCount")}
              subheader={`${t('QuizzesCountPerMonth')} ${new Date().getFullYear()}`}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                  { 
                    name: t("Count"), 
                    data: analytics?.quizzesPerMonth || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
                  },
                ],
              }}
            />
          </Grid>      

          {/* <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <AnalyticsConversionRates
              title={t("topEvaluationFormsResponders")}
              chart={{
                categories: [
                  t("analyticss.quiz_1"),
                  t("analyticss.quiz_2"),
                  t("analyticss.quiz_3"),
                  t("analyticss.quiz_4")
                ],
                series: [
                  { name: t("analyticss.total_participant"), data: [44, 55, 41, 64] },
                ],
              }}
            />
          </Grid> */}
        </Grid>
      )}
    </DashboardContent>
  );
}