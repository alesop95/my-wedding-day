import React, { useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import {
  activeSectionAtom,
  visibleSectionsAtom,
  totalSectionsAtom,
  SectionInfo
} from '../state/activeSectionAtom';

interface SectionPreviewProps {
  section: SectionInfo;
  index: number;
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
}

const SectionPreview: React.FC<SectionPreviewProps> = ({
  section,
  index,
  isActive,
  onClick,
  isMobile
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Tooltip
        title={isMobile ? `${section.name}: ${section.desc}` : ''}
        placement="left"
        arrow
      >
        <Paper
          elevation={isActive ? 4 : 1}
          onClick={onClick}
          sx={{
            p: isMobile ? 1 : 1.5,
            mb: 0.5,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: isActive ? 'scale(1.05)' : 'scale(1)',
            backgroundColor: isActive ? 'primary.light' : 'background.paper',
            borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
            minWidth: isMobile ? '48px' : '160px',
            maxWidth: isMobile ? '48px' : '180px',
            '&:hover': {
              transform: 'scale(1.02)',
              backgroundColor: isActive ? 'primary.light' : 'action.hover'
            }
          }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 0.5 : 1}
            alignItems="center"
            justifyContent={isMobile ? 'center' : 'flex-start'}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: isMobile ? '1.2rem' : '1rem',
                lineHeight: 1
              }}
            >
              {section.icon}
            </Typography>

            {!isMobile && (
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.dark' : 'text.primary',
                    fontSize: '0.75rem',
                    lineHeight: 1,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {section.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontSize: '0.65rem',
                    lineHeight: 1,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {section.desc}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </Tooltip>
    </motion.div>
  );
};

export const SectionNavigator: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeSection, setActiveSection] = useAtom(activeSectionAtom);
  const [visibleSections] = useAtom(visibleSectionsAtom);
  const [totalSections] = useAtom(totalSectionsAtom);

  const scrollToSection = useCallback((index: number) => {
    const sectionId = `section-${index}`;
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(index);
    }
  }, [setActiveSection]);

  const navigateUp = useCallback(() => {
    const newIndex = activeSection === 0 ? totalSections - 1 : activeSection - 1;
    scrollToSection(newIndex);
  }, [activeSection, totalSections, scrollToSection]);

  const navigateDown = useCallback(() => {
    const newIndex = (activeSection + 1) % totalSections;
    scrollToSection(newIndex);
  }, [activeSection, totalSections, scrollToSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.id.replace('section-', ''));
            if (!isNaN(sectionIndex) && sectionIndex !== activeSection) {
              setActiveSection(sectionIndex);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
      }
    );

    visibleSections.forEach((_, index) => {
      const element = document.getElementById(`section-${index}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [visibleSections, activeSection, setActiveSection]);

  if (totalSections <= 1) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: isMobile ? 8 : 16,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}
    >
      <IconButton
        onClick={navigateUp}
        size={isMobile ? 'medium' : 'large'}
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'primary.light',
            transform: 'scale(1.1)'
          }
        }}
      >
        <ArrowUpIcon />
      </IconButton>

      <Box
        sx={{
          maxHeight: '60vh',
          overflowY: 'auto',
          overflowX: 'visible',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        <AnimatePresence mode="popLayout">
          {visibleSections.map((section, index) => (
            <SectionPreview
              key={section.id}
              section={section}
              index={index}
              isActive={index === activeSection}
              onClick={() => scrollToSection(index)}
              isMobile={isMobile}
            />
          ))}
        </AnimatePresence>
      </Box>

      <IconButton
        onClick={navigateDown}
        size={isMobile ? 'medium' : 'large'}
        sx={{
          backgroundColor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: 'primary.light',
            transform: 'scale(1.1)'
          }
        }}
      >
        <ArrowDownIcon />
      </IconButton>
    </Box>
  );
};
