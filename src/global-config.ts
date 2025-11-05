import { paths } from 'src/routes/paths';
import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  filesDir: string;
  assetsNewUrl: string;
  auth: {
    method: 'jwt';
    skip: boolean;
    merchantRedirectPath: string;
    adminRedirectPath: string;
    login: string;
    resetPassword: string;
    setNewPassword: string;
  
  };
 
  admin : {
    driver: {
      list: string;
      add: string;
      update: (id: string) => string;
      delete: (id: string) => string;  
      all: string;
      statistics: (driverId: string) => string;
      updateDailyDistanceTrip: string;
    },
    vehicle: {
      list: string;
      add: string;
      update: (id: string) => string;
      all: string;
    },
    order: {
      list: string;
      add: string;
      update: (id: string) => string;
      delete: (id: string) => string;
    }

  }

  
  

  superAdmin: {
    analytics : {
      getHomePage : string;
    }
    
    // supportMedia: {
    //   getSupportMedia: string;
    //   deleteSupportMedia: (id: string) => string;
    //   addSupportMedia: string;
    // };

  };
};
// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Drivers Management System',
  appVersion: packageJson.version,
  serverUrl: 'http://theresults-001-site4.ktempurl.com',
  //serverUrl: 'https://localhost:7188',
  filesDir: import.meta.env.VITE_FILES_DIR ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  assetsNewUrl: 'http://theresults-001-site4.ktempurl.com/uploads',
  //assetsNewUrl: 'https://localhost:7188/uploads',

  auth: {
    method: 'jwt',
    skip: true,
    merchantRedirectPath: paths.dashboard.root,
    adminRedirectPath: paths.product.root,
    login: '/auth/jwt/sign-in',
    resetPassword: '/api/merchant/Auth/resetPassword',
    setNewPassword: '/api/merchant/Auth/setNewPassword',

  },


  admin:{
    driver: {
      list: '/api/driver',
      add: '/api/driver',
      update: (id: string) => `/api/driver/${id}`,
      delete: (id: string) => `/api/driver/${id}`,  
      all: '/api/driver/all',
      statistics: (driverId: string) => `/api/driver/statistics/${driverId}`,
      updateDailyDistanceTrip: '/api/Driver/dailyDistanceTrip',
    },

    vehicle: {
      list: '/api/vehicle',
      add: '/api/vehicle',
      update: (id: string) => `/api/vehicle/${id}`,
      all: '/api/vehicle/all',
    },

    order: {
      list: '/api/order',
      add: '/api/order',
      update: (id: string) => `/api/order/${id}`,
      delete: (id: string) => `/api/order/${id}`,
    },


  },



  superAdmin: {
    
    analytics : {
      getHomePage : '/api/admin/analytic'
    },
  
  
    // supportMedia: {
    //   getSupportMedia: '/api/admin/supportMedia',
    //   deleteSupportMedia: (x: string) => `/api/admin/supportMedia/${x}`,
    //   addSupportMedia: '/api/admin/supportMedia',
    // },

  },
};

