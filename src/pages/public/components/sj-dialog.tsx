import type { DialogProps } from '@mui/material/Dialog';

import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';

import { sj, sjText } from './sj-tokens';
import { SjButton } from './sj-button';
import { IconSwap, IconAlertCircle } from './icons';

// ----------------------------------------------------------------------
// Dialog — the modal shell behind the question dialog, swap confirmation,
// and any "are you sure" moment. See project/components/Dialog/README.md.
// ----------------------------------------------------------------------

type SjDialogProps = DialogProps & { preventScrimClose?: boolean };

export function SjDialog({ preventScrimClose, onClose, children, ...other }: SjDialogProps) {
  return (
    <Dialog
      TransitionComponent={Grow}
      transitionDuration={200}
      onClose={(event, reason) => {
        if (preventScrimClose && reason === 'backdropClick') return;
        onClose?.(event, reason);
      }}
      slotProps={{
        paper: { sx: { borderRadius: sj.radiusXl, backgroundColor: sj.surface300, backgroundImage: 'none', boxShadow: sj.shadowMd } },
        backdrop: { sx: { backgroundColor: sj.scrim } },
      }}
      {...other}
    >
      {children}
    </Dialog>
  );
}

type ConfirmDialogProps = {
  open: boolean;
  tone: 'warning' | 'danger';
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ open, tone, title, description, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
  const color = tone === 'warning' ? sj.warning : sj.danger;
  const colorInk = tone === 'warning' ? sj.warningInk : sj.dangerInk;

  return (
    <SjDialog open={open} onClose={onCancel} maxWidth="xs" fullWidth preventScrimClose>
      <Box sx={{ padding: sj.space6, textAlign: 'center' }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '999px',
            margin: `0 auto ${sj.space4}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `color-mix(in srgb, ${color} 22%, ${sj.surface300})`,
            color,
          }}
        >
          {tone === 'warning' ? <IconSwap size={24} strokeWidth={2.5} /> : <IconAlertCircle size={24} strokeWidth={2.5} />}
        </Box>
        <Box sx={{ ...sjText.displayMd, fontSize: '17px', mb: sj.space2 }}>{title}</Box>
        <Box sx={{ ...sjText.bodySm, color: sj.inkMuted, mb: sj.space5 }}>{description}</Box>
        <Stack direction="row" justifyContent="center" sx={{ gap: sj.space3 }}>
          <SjButton sjVariant="outline" onClick={onCancel}>
            Cancel
          </SjButton>
          <SjButton
            sjVariant={tone === 'danger' ? 'danger' : 'secondary'}
            onClick={onConfirm}
            sx={
              tone === 'warning'
                ? { backgroundColor: color, color: colorInk, '&:hover': { backgroundColor: color, filter: 'brightness(1.05)' } }
                : undefined
            }
          >
            {confirmLabel}
          </SjButton>
        </Stack>
      </Box>
    </SjDialog>
  );
}
