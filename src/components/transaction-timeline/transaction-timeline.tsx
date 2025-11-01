import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Stack,
  alpha
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BusinessIcon from '@mui/icons-material/Business';
import LinkIcon from '@mui/icons-material/Link';
import { useTranslate } from 'src/locales';
import dayjs from 'dayjs';

interface Transaction {
  id: number;
  type: 'Rent' | 'Buy' | 'Sell';
  title: string;
  relatedToType: 'Unit' | 'Project' | 'Other';
  relatedTo: string;
  relatedToId: number;
  date: string;
  hasAnomaly?: boolean;
}

interface TransactionTimelineProps {
  transactions: Transaction[];
  loading?: boolean;
}

export default function TransactionTimeline({
  transactions,
  loading = false
}: TransactionTimelineProps) {
  const { t } = useTranslate();

  const getTransactionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rent':
        return <HomeIcon />;
      case 'buy':
        return <ShoppingCartIcon />;
      case 'sell':
        return <BusinessIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  const getContextIcon = (relatedToType: string) => {
    switch (relatedToType.toLowerCase()) {
      case 'unit':
        return <BusinessIcon sx={{ fontSize: 16 }} />;
      case 'project':
        return <LinkIcon sx={{ fontSize: 16 }} />;
      case 'other':
        return <BusinessIcon sx={{ fontSize: 16 }} />;
      default:
        return <BusinessIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rent':
        return 'default';
      case 'buy':
        return 'primary';
      case 'sell':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ 
        px: 4,
        py: 3,
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        bgcolor: alpha('#000', 0.02)
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '1.125rem'
          }}
        >
          {t('Interaction Timeline')}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {transactions.length} {transactions.length === 1 ? 'interaction' : 'interactions'} recorded
        </Typography>
      </Box>

      {/* Timeline */}
      <Box sx={{ p: 4, position: 'relative', minHeight: 200 }}>
        {/* Vertical Line */}
        <Box
          sx={{
            position: 'absolute',
            left: 44,
            top: 64,
            bottom: 32,
            width: 2,
            bgcolor: 'grey.200',
            zIndex: 1
          }}
        />

        {/* Transaction Items */}
        <Stack spacing={3}>
          {transactions.map((transaction, index) => (
            <Box key={transaction.id} sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                {/* Timeline Icon */}
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'background.paper',
                    color: 'text.secondary',
                    border: '3px solid',
                    borderColor: 'grey.200',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem'
                    }
                  }}
                >
                  {getTransactionIcon(transaction.type)}
                </Avatar>

                {/* Transaction Content */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'grey.100',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'grey.300',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {/* Header with Type and Date */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 2 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip
                        label={transaction.type}
                        size="small"
                        variant="filled"
                        sx={{ 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                          bgcolor: alpha('#1976d2', 0.08),
                          color: '#1976d2',
                          border: 'none',
                          '&:hover': {
                            bgcolor: alpha('#1976d2', 0.12)
                          }
                        }}
                      />
                      {transaction.hasAnomaly && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'error.main',
                            boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.2)'
                          }}
                        />
                      )}
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.8125rem'
                      }}
                    >
                      {dayjs(transaction.date).format('MMM D, YYYY h:mm A')}
                    </Typography>
                  </Box>

                  {/* Main Content */}
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 1.5,
                      lineHeight: 1.4,
                      fontSize: '1rem'
                    }}
                  >
                    {transaction.title}
                  </Typography>

                  {transaction.relatedToType !== 'Other' && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        lineHeight: 1.5
                      }}
                    >
                      Related to {transaction.relatedToType}: <strong>{transaction.relatedTo}</strong>
                    </Typography>
                  )}

                  {/* Footer with Context */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'grey.100'
                  }}>
                    {getContextIcon(transaction.relatedToType)}
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {transaction.relatedToType} Interaction
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Empty State */}
      {!loading && transactions.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 4 
        }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'grey.50',
              color: 'text.disabled',
              mx: 'auto',
              mb: 2
            }}
          >
            <BusinessIcon sx={{ fontSize: '2rem' }} />
          </Avatar>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {t('No interactions found')}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.disabled"
            sx={{ maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
          >
            {t('Interactions and activities for this lead will appear here once they are recorded.')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
