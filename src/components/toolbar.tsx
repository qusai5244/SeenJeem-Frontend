import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = BoxProps & {
  backHref: string;
  editHref: string;
  liveHref: string;
};

export function Toolbar({
  sx,
  backHref,
  editHref,
  liveHref,
  ...other
}: Props) {
    const { t: tQuestion } = useTranslate('question');




  return (
      <Box
        sx={[{ mb: 3, gap: 1.5, display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backHref}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          {tQuestion('Back')}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {editHref !== '#' && (
          <Tooltip title="Edit">
            <IconButton component={RouterLink} href={editHref}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

  );
}
