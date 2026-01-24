import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { m } from 'framer-motion';

import { varFade } from 'src/components/animate';

import { IZKI_COLORS, IZKI_GRADIENTS } from '../landing/brand-constants';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Contact Us - Izki Club | نادي إزكي الرياضي',
  description: 'Get in touch with Izki Club. We would love to hear from you.',
};

// ----------------------------------------------------------------------

const CONTACT_INFO = [
  {
    icon: '📍',
    title: 'Location',
    details: 'Izki, Sultanate of Oman',
  },
  {
    icon: '📧',
    title: 'Email',
    details: 'info@izkiclub.om',
  },
  {
    icon: '📱',
    title: 'Phone',
    details: '+968 XXXX XXXX',
  }
];

// ----------------------------------------------------------------------

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          pt: 15,
          pb: 8,
          background: IZKI_GRADIENTS.maroon,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, ${IZKI_COLORS.lightAccent} 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, ${IZKI_COLORS.lightAccent} 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px, 150px 150px',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade('inUp')}
            spacing={2}
            alignItems="center"
            textAlign="center"
          >
            <Typography
              variant="h2"
              sx={{
                color: IZKI_COLORS.background,
                fontWeight: 800,
                fontFamily: '"Poppins", sans-serif',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Contact Us
            </Typography>
            <Typography
              sx={{
                color: `${IZKI_COLORS.background}CC`,
                fontSize: '1.125rem',
                maxWidth: 600,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              We would love to hear from you. Get in touch with us for any inquiries, partnerships,
              or to join our sports family.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ py: 10, bgcolor: IZKI_COLORS.background }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Stack
                component={m.div}
                initial="initial"
                animate="animate"
                variants={varFade('inLeft')}
                spacing={4}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: IZKI_COLORS.primary,
                      fontWeight: 700,
                      fontFamily: '"Poppins", sans-serif',
                      mb: 1,
                    }}
                  >
                    Get in Touch
                  </Typography>
                  <Typography
                    sx={{
                      color: IZKI_COLORS.text.secondary,
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    Reach out to us through any of the following channels
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  {CONTACT_INFO.map((item) => (
                    <Card
                      key={item.title}
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        boxShadow: `0 4px 20px ${IZKI_COLORS.primary}08`,
                        border: `1px solid ${IZKI_COLORS.primary}10`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 30px ${IZKI_COLORS.primary}15`,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            bgcolor: IZKI_COLORS.lightMaroonBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: IZKI_COLORS.primary,
                                fontFamily: '"Poppins", sans-serif',
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{
                              color: IZKI_COLORS.text.secondary,
                              fontFamily: '"Poppins", sans-serif',
                              fontSize: '0.9rem',
                            }}
                          >
                            {item.details}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Card
                component={m.div}
                initial="initial"
                animate="animate"
                variants={varFade('inRight')}
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  boxShadow: `0 8px 40px ${IZKI_COLORS.primary}10`,
                  border: `1px solid ${IZKI_COLORS.primary}10`,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: IZKI_COLORS.primary,
                    fontWeight: 700,
                    fontFamily: '"Poppins", sans-serif',
                    mb: 3,
                  }}
                >
                  Send us a Message
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: IZKI_COLORS.primary,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: IZKI_COLORS.primary,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="phone"
                          label="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: IZKI_COLORS.primary,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="subject"
                          label="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: IZKI_COLORS.primary,
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: IZKI_COLORS.primary,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      name="message"
                      label="Your Message"
                      multiline
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: IZKI_COLORS.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: IZKI_COLORS.primary,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: IZKI_COLORS.primary,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: IZKI_COLORS.primary,
                        color: IZKI_COLORS.background,
                        fontWeight: 700,
                        py: 1.5,
                        borderRadius: '12px',
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: '1rem',
                        boxShadow: `0 8px 24px ${IZKI_COLORS.primary}40`,
                        '&:hover': {
                          bgcolor: IZKI_COLORS.secondary,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 12px 32px ${IZKI_COLORS.primary}50`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Send Message
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
