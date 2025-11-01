import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import { AppIcon, iconMap, IconName } from './icon-library';

// ----------------------------------------------------------------------

export function IconShowcase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  // Group icons by category
  const iconCategories = {
    Actions: ['add', 'edit', 'delete', 'view', 'search', 'filter', 'menu', 'close', 'check', 'save', 'cancel', 'refresh', 'download', 'upload', 'share', 'copy'],
    Navigation: ['dashboard', 'home', 'business', 'apartment', 'people', 'person', 'groups', 'contact', 'analytics', 'settings', 'account', 'logout'],
    Status: ['info', 'warning', 'error', 'success', 'security', 'notifications'],
    Business: ['homeWork', 'businessCenter', 'personAdd', 'viewList', 'label', 'key', 'category', 'localOffer'],
    Communication: ['email', 'phone', 'message', 'chat'],
    'Files & Media': ['folder', 'file', 'image', 'video', 'pdf'],
    'Date & Time': ['event', 'schedule', 'dateRange'],
  };

  const filteredIcons = Object.entries(iconMap).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyIconUsage = (iconName: string) => {
    const usage = `<AppIcon name="${iconName}" />`;
    navigator.clipboard.writeText(usage);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const renderIconCard = (iconName: IconName) => (
    <Card
      key={iconName}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2,
        },
      }}
      onClick={() => handleCopyIconUsage(iconName)}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          py: 2,
          position: 'relative',
        }}
      >
        <AppIcon name={iconName} sx={{ fontSize: 32 }} />
        <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 500 }}>
          {iconName}
        </Typography>
        {copiedIcon === iconName && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'success.main',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Copied!
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Icon Library
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Click on any icon to copy its usage code to clipboard
      </Typography>

      <TextField
        fullWidth
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AppIcon name="search" />
            </InputAdornment>
          ),
        }}
      />

      {searchTerm ? (
        // Show filtered results
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search Results ({filteredIcons.length})
          </Typography>
          <Grid container spacing={2}>
            {filteredIcons.map(([iconName]) => renderIconCard(iconName as IconName))}
          </Grid>
        </Box>
      ) : (
        // Show categorized icons
        <Stack spacing={4}>
          {Object.entries(iconCategories).map(([category, icons]) => (
            <Box key={category}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
                <Chip label={icons.length} size="small" variant="outlined" />
              </Box>
              <Grid container spacing={2}>
                {icons.map((iconName) => renderIconCard(iconName as IconName))}
              </Grid>
            </Box>
          ))}
        </Stack>
      )}

      <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Usage Examples
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {`<AppIcon name="add" />`}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {`<AppIcon name="edit" size="small" color="primary" />`}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {`<AppIcon name="delete" sx={{ color: 'error.main' }} />`}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

