import type { NavSectionProps } from 'src/components/nav-section';
import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/global-config';
import { SvgColor } from 'src/components/svg-color';
import { useTranslate } from 'src/locales';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const useSuperAdminNavData = (): NavSectionProps['data'] => {
  const { i18n } = useTranslation();
  const { t } = useTranslate();
  const isArabic = i18n.language === 'ar';

  return [
    /**
     * Overview
     */
    {
      subheader: t('Overview'),
      items: [
        { title: t('Analytics'), path: paths.superadmin.statistcs, icon: ICONS.analytics },
      ],
    },
    /**
     * Management
     */
    {
      subheader: t('management'),
      items: [
        {
          title: t('Organizations'),
          path: paths.superadmin.organization.root,
          icon: ICONS.folder,
        },
        {
          title: t('Teams'),
          path: paths.superadmin.teams.root,
          icon: ICONS.user,
        },
        {
          title: t('Course'),
          path: paths.superadmin.course.root,
          icon: ICONS.course,
        },
        {
          title: t('EvaluationForms'),
          path: paths.superadmin.evaluationforms.root,
          icon: ICONS.file,
        },
        {
          title: t('TrainerAssessments'),
          path: paths.superadmin.trainerAssessments.root,
          icon: ICONS.job,
        },
        {
          title: t('Users'),
          path: paths.superadmin.user.root,
          icon: ICONS.user,
        },
        {
          title: t('Participants'),
          path: paths.superadmin.participants.root,
          icon: ICONS.user,
        },
        {
          title: t('Quizzes'),
          path: paths.superadmin.Quizzes.root,
          icon: ICONS.job,
        },
        {
        title: t('Subscription Plans'),
          path: paths.superadmin.SubscriptionPlans.root,
          icon: ICONS.banking,
        },
        {
          title: t('SupportMedia'),
            path: paths.superadmin.SupportMedia.root,
            icon: ICONS.chat,
        }
      ],
    },
  ];
};
