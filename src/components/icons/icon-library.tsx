import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

// Material-UI Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ShareIcon from '@mui/icons-material/Share';
import CopyIcon from '@mui/icons-material/ContentCopy';

// Navigation Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

// Status Icons
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Business Icons
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ViewListIcon from '@mui/icons-material/ViewList';
import LabelIcon from '@mui/icons-material/Label';
import KeyIcon from '@mui/icons-material/Key';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Communication Icons
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import ChatIcon from '@mui/icons-material/Chat';

// File & Media Icons
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Date & Time Icons
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DateRangeIcon from '@mui/icons-material/DateRange';

// Map of icon names to components
export const iconMap = {
  // Actions
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  view: VisibilityIcon,
  search: SearchIcon,
  filter: FilterListIcon,
  menu: MoreVertIcon,
  close: CloseIcon,
  check: CheckIcon,
  save: SaveIcon,
  cancel: CancelIcon,
  refresh: RefreshIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  share: ShareIcon,
  copy: CopyIcon,

  // Navigation
  dashboard: DashboardIcon,
  home: HomeIcon,
  business: BusinessIcon,
  apartment: ApartmentIcon,
  people: PeopleIcon,
  person: PersonIcon,
  groups: GroupsIcon,
  contact: ContactPhoneIcon,
  analytics: AnalyticsIcon,
  settings: SettingsIcon,
  account: AccountCircleIcon,
  logout: LogoutIcon,

  // Status
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  success: SuccessIcon,
  security: SecurityIcon,
  notifications: NotificationsIcon,

  // Business
  homeWork: HomeWorkIcon,
  businessCenter: BusinessCenterIcon,
  personAdd: PersonAddIcon,
  viewList: ViewListIcon,
  label: LabelIcon,
  key: KeyIcon,
  category: CategoryIcon,
  localOffer: LocalOfferIcon,

  // Communication
  email: EmailIcon,
  phone: PhoneIcon,
  message: MessageIcon,
  chat: ChatIcon,

  // Files & Media
  folder: FolderIcon,
  file: InsertDriveFileIcon,
  image: ImageIcon,
  video: VideoFileIcon,
  pdf: PictureAsPdfIcon,

  // Date & Time
  event: EventIcon,
  schedule: ScheduleIcon,
  dateRange: DateRangeIcon,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends Omit<SvgIconProps, 'children'> {
  name: IconName;
  size?: 'small' | 'medium' | 'large';
}

export function AppIcon({ name, size = 'medium', ...props }: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon library`);
    return <InfoIcon {...props} />;
  }

  const sizeProps = {
    small: { fontSize: 'small' as const },
    medium: { fontSize: 'medium' as const },
    large: { fontSize: 'large' as const },
  };

  return <IconComponent {...sizeProps[size]} {...props} />;
}

// Utility function to get icon component by name
export function getIcon(name: IconName) {
  return iconMap[name] || InfoIcon;
}

// Export commonly used icon sets for easy access
export const ActionIcons = {
  Add: AddIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  View: VisibilityIcon,
  Search: SearchIcon,
  Filter: FilterListIcon,
  Save: SaveIcon,
  Cancel: CancelIcon,
  Refresh: RefreshIcon,
} as const;

export const NavigationIcons = {
  Dashboard: DashboardIcon,
  Home: HomeIcon,
  Business: BusinessIcon,
  Apartment: ApartmentIcon,
  People: PeopleIcon,
  Groups: GroupsIcon,
  Analytics: AnalyticsIcon,
  Settings: SettingsIcon,
} as const;

export const StatusIcons = {
  Info: InfoIcon,
  Warning: WarningIcon,
  Error: ErrorIcon,
  Success: SuccessIcon,
  Security: SecurityIcon,
  Notifications: NotificationsIcon,
} as const;

