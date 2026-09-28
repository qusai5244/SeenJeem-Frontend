import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { sj, sjText } from './sj-tokens';
import { IconAlertCircle } from './icons';

// ----------------------------------------------------------------------
// FeedbackStates — loading, empty, error and reconnecting states.
// See project/components/FeedbackStates/README.md. (Toast stays on the
// app's existing snackbar — see the plan's Deviations section.)
// ----------------------------------------------------------------------

export function FullScreenLoading() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '999px',
          border: `3px solid ${sj.controlBorder}`,
          borderTopColor: sj.accent,
          animation: 'sj-spin 0.8s linear infinite',
        }}
      />
    </Box>
  );
}

type EmptyStateProps = {
  icon?: React.ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', padding: `${sj.space5} 0` }}>
      {icon && (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '999px',
            backgroundColor: sj.surface200,
            color: sj.inkFaint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${sj.space4}`,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, mb: actionLabel ? sj.space4 : 0 }}>{message}</Box>
      {actionLabel && (
        <Box
          component="button"
          type="button"
          onClick={onAction}
          sx={{ background: 'none', border: 0, cursor: 'pointer', padding: 0, color: sj.link, ...sjText.label, fontSize: 12 }}
        >
          {actionLabel}
        </Box>
      )}
    </Box>
  );
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        gap: '10px',
        padding: sj.space4,
        borderRadius: sj.radiusMd,
        backgroundColor: sj.surface200,
        boxShadow: `inset 4px 0 0 ${sj.danger}`,
      }}
    >
      <Box sx={{ color: sj.danger, flexShrink: 0, mt: '1px' }}>
        <IconAlertCircle size={18} strokeWidth={2.5} />
      </Box>
      <Box>
        <Box sx={{ ...sjText.bodySm, color: sj.ink, mb: onRetry ? '6px' : 0 }}>{message}</Box>
        {onRetry && (
          <Box
            component="button"
            type="button"
            onClick={onRetry}
            sx={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: sj.link, ...sjText.label, fontSize: 11 }}
          >
            Try again
          </Box>
        )}
      </Box>
    </Stack>
  );
}

export function ReconnectingPill() {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '7px 14px',
        borderRadius: sj.radiusPill,
        backgroundColor: sj.warning,
        color: sj.warningInk,
        ...sjText.bodySm,
        fontWeight: 700,
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '999px', backgroundColor: sj.warningInk, animation: 'sj-blink 1s ease infinite' }} />
      Reconnecting…
    </Box>
  );
}
