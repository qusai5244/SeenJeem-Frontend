import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  ButtonGroup,
  Chip,
} from '@mui/material';
import { AppIcon, IconName } from 'src/components/icons';

// ----------------------------------------------------------------------

export interface ActionButton {
  icon: IconName;
  label: string;
  onClick: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface ActionToolbarProps {
  actions: ActionButton[];
  title?: string;
  subtitle?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  showDividers?: boolean;
  compact?: boolean;
  selectedCount?: number;
}

export function ActionToolbar({
  actions,
  title,
  subtitle,
  orientation = 'horizontal',
  spacing = 1,
  showDividers = false,
  compact = false,
  selectedCount,
}: ActionToolbarProps) {
  const renderButton = (action: ActionButton, index: number) => {
    const button = compact ? (
      <Tooltip title={action.tooltip || action.label} key={index}>
        <IconButton
          onClick={action.onClick}
          color={action.color}
          disabled={action.disabled || action.loading}
          size={action.size}
        >
          <AppIcon name={action.icon} />
        </IconButton>
      </Tooltip>
    ) : (
      <Button
        key={index}
        variant={action.variant || 'outlined'}
        color={action.color}
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        startIcon={<AppIcon name={action.icon} />}
        size={action.size}
      >
        {action.label}
      </Button>
    );

    return action.tooltip && !compact ? (
      <Tooltip title={action.tooltip} key={index}>
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  return (
    <Box>
      {(title || subtitle || selectedCount !== undefined) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</Box>
              {selectedCount !== undefined && selectedCount > 0 && (
                <Chip
                  label={`${selectedCount} selected`}
                  size="small"
                  color="primary"
                  variant="filled"
                />
              )}
            </Box>
          )}
          {subtitle && (
            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {subtitle}
            </Box>
          )}
        </Box>
      )}

      <Stack
        direction={orientation === 'horizontal' ? 'row' : 'column'}
        spacing={spacing}
        divider={showDividers ? <Divider orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} flexItem /> : undefined}
        sx={{
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
          alignItems: orientation === 'horizontal' ? 'center' : 'stretch',
        }}
      >
        {actions.map(renderButton)}
      </Stack>
    </Box>
  );
}

// ----------------------------------------------------------------------

export interface QuickActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  compact?: boolean;
  disabled?: {
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
    refresh?: boolean;
    export?: boolean;
    import?: boolean;
  };
}

export function QuickActions({
  onAdd,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  onExport,
  onImport,
  compact = false,
  disabled = {},
}: QuickActionsProps) {
  const actions: ActionButton[] = [];

  if (onAdd) {
    actions.push({
      icon: 'add',
      label: 'Add',
      onClick: onAdd,
      variant: 'contained',
      color: 'primary',
      disabled: disabled.add,
    });
  }

  if (onEdit) {
    actions.push({
      icon: 'edit',
      label: 'Edit',
      onClick: onEdit,
      disabled: disabled.edit,
    });
  }

  if (onView) {
    actions.push({
      icon: 'view',
      label: 'View',
      onClick: onView,
      disabled: disabled.view,
    });
  }

  if (onDelete) {
    actions.push({
      icon: 'delete',
      label: 'Delete',
      onClick: onDelete,
      color: 'error',
      disabled: disabled.delete,
    });
  }

  if (onRefresh) {
    actions.push({
      icon: 'refresh',
      label: 'Refresh',
      onClick: onRefresh,
      disabled: disabled.refresh,
    });
  }

  if (onExport) {
    actions.push({
      icon: 'download',
      label: 'Export',
      onClick: onExport,
      disabled: disabled.export,
    });
  }

  if (onImport) {
    actions.push({
      icon: 'upload',
      label: 'Import',
      onClick: onImport,
      disabled: disabled.import,
    });
  }

  return (
    <ActionToolbar
      actions={actions}
      compact={compact}
      spacing={1}
    />
  );
}

