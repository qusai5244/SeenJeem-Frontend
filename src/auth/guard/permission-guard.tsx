import { JWT_STORAGE_KEY } from '../context/jwt/constant';
import { jwtDecode } from '../context/jwt/utils';



export function getTokenPermissionsCodes() {
    try {
      const token = localStorage.getItem(JWT_STORAGE_KEY);
      if (!token) {
        return null;
      }
      
      const decoded = jwtDecode(token);
      return {
        permissionsCodes: decoded.permissions,
      };
    } catch (error) {
      console.error('Error getting/decoding token:', error);
      return {
        token: null,
        decoded: null,
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  export function hasPermission(permissionCode: string) {
    const permissionsCodes = getTokenPermissionsCodes();
    return permissionsCodes?.permissionsCodes?.includes(permissionCode);
  }

  export function isTeamLead() {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      return null;
    }
    const decoded = jwtDecode(token);
    return decoded.isTeamLead == 'True';
  }


  export function getUserType() {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      return null;
    }
    const decoded = jwtDecode(token);
    return decoded.userType;
  }

  export function getUserId() {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      return null;
    }
    const decoded = jwtDecode(token);
    return decoded.userId;
  }


  // create const object for permissions codes 
  export const PermissionsCodes = {
    Unit: {
      add: '1001_Unit',
      view: '1002_Unit',
      edit: '1003_Unit',
      delete: '1004_Unit',
    },
    User: {
      add: '1001_User',
      view: '1002_User',
      edit: '1003_User',
      delete: '1004_User',
      viewPermissions: '6001_User',
      editPermissions: '6002_User',
    },
    Project: {
      add: '1001_Project',
      view: '1002_Project',
      edit: '1003_Project',
      delete: '1004_Project',
      addMember: '4001_Project',
      viewMember: '4002_Project',
      editMember: '4003_Project',
      deleteMember: '4004_Project',
    },
    Lookup: {
      add: '1001_Lookup',
      view: '1002_Lookup',
      edit: '1003_Lookup',
      delete: '1004_Lookup',
    },
    Team: {
      add: '1001_Team',
      view: '1002_Team',
      edit: '1003_Team',
      delete: '1004_Team',
      addMember: '4001_Team',
      viewMember: '4002_Team',
      editMember: '4003_Team',
      deleteMember: '4004_Team',
    },
    AdditionalField: {
      add: '1001_AdditionalField',
      view: '1002_AdditionalField',
      edit: '1003_AdditionalField',
      delete: '1004_AdditionalField',
    },

    Lead: {
      add: '1001_Customer',
      view: '1002_Customer',
      edit: '1003_Customer',
      delete: '1004_Customer',
    },

    Logs: {
      add: '1001_Log',
      view: '1002_Log',
      edit: '1003_Log',
      delete: '1004_Log',
    },
    StandAloneUnit: {
      add: '1001_StandAloneUnit',
      view: '1002_StandAloneUnit',
      edit: '1003_StandAloneUnit',
      delete: '1004_StandAloneUnit',
      addMembers: '4001_StandAloneUnit',
      viewMembers: '4002_StandAloneUnit',
      editMembers: '4003_StandAloneUnit',
      deleteMembers: '4004_StandAloneUnit',
    },


  } as const;