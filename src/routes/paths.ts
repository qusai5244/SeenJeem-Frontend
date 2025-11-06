import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  ADMIN: '/superadmin',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  evaluationForm: {
    root: `/evaluationForm`,
    checkout: `/evaluationForm/checkout`,
    details: (id: string) => `/evaluationForm/${id}`,
    demo: { details: `/evaluationForm/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
      setNewPassword: (token: string) => `${ROOTS.AUTH}/jwt/reset-password/${token}`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  public : {
    getQuizResults: (code: string) => `/api/quiz/${code}/results`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    driver: {
      list: `${ROOTS.DASHBOARD}/driver/list`,
    },
    vehicle: {
      list: `${ROOTS.DASHBOARD}/vehicle/list`,
    },
    order: {
      list: `${ROOTS.DASHBOARD}/order/list`,
    },
    reports: {
      list: `${ROOTS.DASHBOARD}/reports/list`,
    },
  },
  superadmin: {
    root: ROOTS.ADMIN,
    statistcs: `${ROOTS.ADMIN}`,
    organization: {
      root: `${ROOTS.ADMIN}/organizations`,
      new: `${ROOTS.ADMIN}/organizations/new`,
      list: `${ROOTS.ADMIN}/organizations/list`,
      details: (id: number) => `${ROOTS.ADMIN}/organizations/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/organizations/${id}/edit`,
    },
    teams: {
      root: `${ROOTS.ADMIN}/teams`,
      new: `${ROOTS.ADMIN}/teams/new`,
      list: `${ROOTS.ADMIN}/teams/list`,
      details: (id: number) => `${ROOTS.ADMIN}/teams/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/teams/${id}/edit`,
    },
    course: {
      root: `${ROOTS.ADMIN}/course`,
      new: `${ROOTS.ADMIN}/course/new`,
      list: `${ROOTS.ADMIN}/course/list`,
      details: (id: number) => `${ROOTS.ADMIN}/course/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/course/${id}/edit`,
    },
    evaluationforms: {
      root: `${ROOTS.ADMIN}/evaluationforms`,
      new: `${ROOTS.ADMIN}/evaluationforms/new`,
      list: `${ROOTS.ADMIN}/evaluationforms/list`,
      details: (id: number) => `${ROOTS.ADMIN}/evaluationforms/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/evaluationforms/${id}/edit`,
      preview : (id: string) => `${ROOTS.ADMIN}/evaluationforms/${id}/preview`,
    },
    trainerAssessments: {
      root: `${ROOTS.ADMIN}/trainerAssessments`,
      new: `${ROOTS.ADMIN}/trainerAssessments/new`,
      list: `${ROOTS.ADMIN}/trainerAssessments/list`,
      details: (id: number) => `${ROOTS.ADMIN}/trainerAssessments/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/trainerAssessments/${id}/edit`,
    },
    user: {
      root: `${ROOTS.ADMIN}/user`,
      new: `${ROOTS.ADMIN}/user/new`,
      list: `${ROOTS.ADMIN}/user/list`,
      details: (id: number) => `${ROOTS.ADMIN}/user/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/user/${id}/edit`,
    },
    participants: {
      root: `${ROOTS.ADMIN}/participants`,
      new: `${ROOTS.ADMIN}/participants/new`,
      list: `${ROOTS.ADMIN}/participants/list`,
      details: (id: number) => `${ROOTS.ADMIN}/participants/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/participants/${id}/edit`,
    },
    Quizzes: {
      root: `${ROOTS.ADMIN}/Quizes`,
      new: `${ROOTS.ADMIN}/Quizes/new`,
      list: `${ROOTS.ADMIN}/Quizes/list`,
      details: (id: number) => `${ROOTS.ADMIN}/Quizes/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/Quizes/${id}/edit`,
      result: (code: string) => `quiz/results/${code}`,
    },
    SubscriptionPlans: {
      root: `${ROOTS.ADMIN}/subscription-plans`,
      new: `${ROOTS.ADMIN}/subscription-plans/new`,
      list: `${ROOTS.ADMIN}/subscription-plans/list`,
      details: (id: number) => `${ROOTS.ADMIN}/subscription-plans/${id}`,
      edit: (id: number) => `${ROOTS.ADMIN}/subscription-plans/${id}/edit`,
    },
    SupportMedia: {
      root: `${ROOTS.ADMIN}/support-media`,
    },
  },
};
