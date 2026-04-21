import React, { useEffect } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { languageAtom, Language } from '../state/languageAtom';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useAtom(languageAtom);

  useEffect(() => {
    // Sincronizza i18n con l'atom al mount
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleLanguageChange = (
    _: React.MouseEvent<HTMLElement>,
    newLanguage: Language | null
  ) => {
    if (newLanguage && newLanguage !== language) {
      setLanguage(newLanguage);
      i18n.changeLanguage(newLanguage);
    }
  };

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={handleLanguageChange}
      aria-label="language selector"
      size="small"
      sx={{
        '& .MuiToggleButton-root': {
          border: 'none',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'text.secondary',
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
      }}
    >
      <ToggleButton value="it" aria-label="italiano">
        IT
      </ToggleButton>
      <ToggleButton value="en" aria-label="english">
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
};