import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  Business,
  Home,
  Person,
  Group
} from '@mui/icons-material';
import { apiFetcher, ApiRequestType } from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import { toast } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

interface TopProjectsByUnits {
  projectName: string;
  unitsCount: number;
}

interface StandAloneUnit {
  name: string;
  typeId: number;
  type: string;
}

interface InteractionCategory {
  type: string;
  count: number;
}

interface MonthCount {
  month: string;
  count: number;
}

interface DashboardAnalytics {
  projects: number;
  units: number;
  topProjectsByUnits: TopProjectsByUnits[];
  standAloneUnits: StandAloneUnit[];
  intercationsByCategory: InteractionCategory[];
  intercationPerMonths: MonthCount[];
  leadsPerMonth: MonthCount[];
  leads: number;
  agents: number;
}


