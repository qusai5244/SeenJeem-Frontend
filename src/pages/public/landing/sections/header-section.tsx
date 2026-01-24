import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router';

import { allLangs } from 'src/locales';
import { LanguagePopover } from 'src/layouts/components/language-popover';
import { paths } from 'src/routes/paths';

import { IZKI_COLORS } from '../brand-constants';

// ----------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'Home', labelAr: 'الرئيسية', href: '#hero', isRoute: false },
  { label: 'Management', labelAr: 'الإدارة', href: '/management', isRoute: true },
  { label: 'Teams', labelAr: 'الفرق', href: '/local-teams', isRoute: true },
  { label: 'Tournaments', labelAr: 'البطولات', href: '/tournaments', isRoute: true },
  { label: 'News', labelAr: 'الأخبار', href: '#news', isRoute: false },
  { label: 'Players', labelAr: 'اللاعبين', href: '#players', isRoute: false },
  { label: 'Contact', labelAr: 'تواصل', href: '/contact-us', isRoute: true },
];

// ----------------------------------------------------------------------

export function HeaderSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Check if a nav link is active
  const isLinkActive = (link: typeof NAV_LINKS[0]) => {
    if (link.isRoute) {
      // For route-based links, check the pathname
      return location.pathname === link.href;
    }
    // For section-based links, check if on home page and section matches
    return isHomePage && activeSection === link.href.replace('#', '');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only track sections on home page
      if (!isHomePage) return;

      // Get all section elements
      const sections = NAV_LINKS
        .filter(link => !link.isRoute)
        .map(link => ({
          id: link.href.replace('#', ''),
          element: document.querySelector(link.href),
        }))
        .filter(section => section.element);

      // Find which section is currently in view
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = (section.element as HTMLElement).offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Handle scroll to section after navigation from another page
  useEffect(() => {
    if (isHomePage) {
      const targetSection = sessionStorage.getItem('scrollToSection');
      if (targetSection) {
        sessionStorage.removeItem('scrollToSection');
        const element = document.querySelector(targetSection);
        if (element) {
          // Use instant scroll when coming from another page
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'instant' });
          }, 50);
        }
      }
    }
  }, [isHomePage, location.pathname]);

  const handleNavClick = (href: string, isRoute: boolean = false) => {
    setMobileOpen(false);
    if (isRoute) {
      navigate(href);
    } else if (isHomePage) {
      // On home page, just scroll to the section (no hash in URL)
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, store target section and navigate to home
      sessionStorage.setItem('scrollToSection', href);
      navigate('/');
    }
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          transition: 'all 0.3s ease',
          bgcolor: (isScrolled || !isHomePage) ? IZKI_COLORS.background : 'transparent',
          boxShadow: (isScrolled || !isHomePage) ? `0 4px 20px ${IZKI_COLORS.primary}15` : 'none',
          backdropFilter: (isScrolled || !isHomePage) ? 'blur(10px)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              py: 2,
              minHeight: 70,
            }}
          >
            {/* Logo */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ cursor: 'pointer' }}
              onClick={() => isHomePage ? handleNavClick('#hero') : navigate('/')}
            >
              <Box
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: '50%',
                  bgcolor: (isScrolled || !isHomePage) ? IZKI_COLORS.primary : IZKI_COLORS.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    color: (isScrolled || !isHomePage) ? IZKI_COLORS.background : IZKI_COLORS.primary,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  IZKI
                </Typography>
              </Box>
              <Stack spacing={0}>
                <Typography
                  sx={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: (isScrolled || !isHomePage) ? IZKI_COLORS.primary : IZKI_COLORS.background,
                    fontFamily: '"Poppins", sans-serif',
                    lineHeight: 1.2,
                    transition: 'color 0.3s ease',
                  }}
                >
                  Izki Club
                </Typography>
              </Stack>
            </Stack>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" alignItems="center" spacing={1}>
                {NAV_LINKS.map((link) => {
                  const isActive = isLinkActive(link);
                  return (
                    <Button
                      key={link.label}
                      onClick={() => handleNavClick(link.href, link.isRoute)}
                      sx={{
                        color: isActive 
                          ? IZKI_COLORS.accent 
                          : (isScrolled || !isHomePage) ? IZKI_COLORS.text.primary : IZKI_COLORS.background,
                        fontWeight: isActive ? 700 : 600,
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: '0.9rem',
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        bgcolor: isActive 
                          ? (isScrolled || !isHomePage) ? `${IZKI_COLORS.primary}15` : `${IZKI_COLORS.background}20`
                          : 'transparent',
                        position: 'relative',
                        '&::after': isActive ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '60%',
                          height: 3,
                          bgcolor: IZKI_COLORS.accent,
                          borderRadius: '2px',
                        } : {},
                        '&:hover': {
                          bgcolor: (isScrolled || !isHomePage) 
                            ? `${IZKI_COLORS.primary}10` 
                            : `${IZKI_COLORS.background}15`,
                          color: (isScrolled || !isHomePage) ? IZKI_COLORS.primary : IZKI_COLORS.accent,
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  );
                })}

                {/* Language Switcher */}
                <LanguagePopover
                  data={allLangs}
                  sx={{
                    ml: 1,
                    bgcolor: (isScrolled || !isHomePage) 
                      ? `${IZKI_COLORS.primary}10` 
                      : `${IZKI_COLORS.background}15`,
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: (isScrolled || !isHomePage) 
                        ? `${IZKI_COLORS.primary}20` 
                        : `${IZKI_COLORS.background}25`,
                    },
                  }}
                />

                {/* CTA Button */}
                <Button
                  variant="contained"
                  onClick={() => handleNavClick(paths.public.contact, true)}
                  sx={{
                    ml: 2,
                    bgcolor: IZKI_COLORS.accent,
                    color: IZKI_COLORS.darkBg,
                    fontWeight: 700,
                    fontFamily: '"Poppins", sans-serif',
                    px: 3,
                    py: 1,
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: IZKI_COLORS.lightAccent,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Join Now
                </Button>
              </Stack>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Stack direction="row" alignItems="center" spacing={1}>
                {/* Language Switcher - Mobile */}
                <LanguagePopover
                  data={allLangs}
                  sx={{
                    bgcolor: (isScrolled || !isHomePage) 
                      ? `${IZKI_COLORS.primary}10` 
                      : `${IZKI_COLORS.background}15`,
                    borderRadius: '10px',
                    '&:hover': {
                      bgcolor: (isScrolled || !isHomePage) 
                        ? `${IZKI_COLORS.primary}20` 
                        : `${IZKI_COLORS.background}25`,
                    },
                  }}
                />

                {/* Menu Button */}
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    bgcolor: (isScrolled || !isHomePage) 
                      ? `${IZKI_COLORS.primary}10` 
                      : `${IZKI_COLORS.background}15`,
                  }}
                >
                  <Stack spacing={0.5}>
                    <Box
                      sx={{
                        width: 20,
                        height: 2,
                        bgcolor: (isScrolled || !isHomePage) ? IZKI_COLORS.primary : IZKI_COLORS.background,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 16,
                        height: 2,
                        bgcolor: (isScrolled || !isHomePage) ? IZKI_COLORS.primary : IZKI_COLORS.background,
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 20,
                        height: 2,
                        bgcolor: (isScrolled || !isHomePage) ? IZKI_COLORS.primary : IZKI_COLORS.background,
                        borderRadius: 1,
                      }}
                    />
                  </Stack>
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: IZKI_COLORS.background,
            p: 2,
          },
        }}
      >
        {/* Drawer Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 4, pb: 2, borderBottom: `1px solid ${IZKI_COLORS.primary}15` }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: IZKI_COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: IZKI_COLORS.background,
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                IZKI
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: IZKI_COLORS.primary,
                fontFamily: '"Poppins", sans-serif',
              }}
            >
              Izki Club
            </Typography>
          </Stack>

          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              bgcolor: `${IZKI_COLORS.primary}10`,
              borderRadius: '8px',
            }}
          >
            <Typography sx={{ fontSize: '1.25rem' }}>✕</Typography>
          </IconButton>
        </Stack>

        {/* Navigation Links */}
        <List>
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link);
            return (
              <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    bgcolor: isActive ? `${IZKI_COLORS.primary}10` : 'transparent',
                    borderLeft: isActive ? `4px solid ${IZKI_COLORS.accent}` : '4px solid transparent',
                    '&:hover': {
                      bgcolor: `${IZKI_COLORS.primary}10`,
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    secondary={link.labelAr}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 600,
                      fontFamily: '"Poppins", sans-serif',
                      color: isActive ? IZKI_COLORS.accent : IZKI_COLORS.primary,
                    }}
                    secondaryTypographyProps={{
                      fontFamily: '"Cairo", sans-serif',
                      color: IZKI_COLORS.accent,
                      fontSize: '0.75rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* CTA Button in Drawer */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleNavClick(paths.public.contact, true)}
          sx={{
            mt: 3,
            bgcolor: IZKI_COLORS.accent,
            color: IZKI_COLORS.darkBg,
            fontWeight: 700,
            fontFamily: '"Poppins", sans-serif',
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              bgcolor: IZKI_COLORS.lightAccent,
            },
          }}
        >
          Join Now
        </Button>
      </Drawer>
    </>
  );
}

