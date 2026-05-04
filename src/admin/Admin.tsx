import {
  Alert,
  Box,
  Button,
  CircularProgress,
  createTheme,
  Paper,
  responsiveFontSizes,
  Table,
  TableBody,
  TableContainer,
  ThemeProvider,
  Typography,
  Tab,
  Tabs
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAdminData } from "../hooks/useAdmin";
import { ThemeOptions } from "@mui/material/styles";
import { function as F } from "fp-ts";
import { FamilyRow } from "./FamilyRow";
import { AddFamily } from "./AddFamily";
import { FamilyData } from "../types/family";
import { Report } from "./Report";
import { GuestbookModeration } from "./GuestbookModeration";
import { SongSuggestionsModeration } from "./SongSuggestionsModeration";
import { DashboardSection } from "../sections/DashboardSection";
import { MenuEditor } from "./MenuEditor";

export const themeOptions: ThemeOptions = {
  palette: {
    divider: "#d5d5d577",
    primary: {
      main: "#3f51b5"
    },
    secondary: {
      main: "#f50057"
    }
  }
};
const theme = F.pipe(createTheme(themeOptions), responsiveFontSizes);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

export const Admin = () => {
  const [familyData, setFamilyData] = useState<FamilyData[] | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const { data, loading, error, refetch } = useAdminData();

  useEffect(() => {
    if (data) {
      setFamilyData(data);
    }
  }, [data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2}>
          <CircularProgress />
          <Typography variant="h6">Caricamento dati...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" gap={2} p={3}>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Errore nel caricamento dei dati
            </Typography>
            <Typography variant="body2">
              {error.message}
            </Typography>
          </Alert>
          <Button variant="contained" onClick={refetch} color="primary">
            Riprova
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  if (!familyData) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        {/* Header with navigation buttons */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h4" component="h1">
            Pannello Amministrazione
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              const currentUrl = new URL(window.location.href);
              currentUrl.pathname = '/restaurant';
              currentUrl.searchParams.set('switchTo', 'restaurant');
              window.location.href = currentUrl.toString();
            }}
          >
            Vai ai Tavoli
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="Gestione Famiglie" {...a11yProps(1)} />
            <Tab label="Moderazione Guestbook" {...a11yProps(2)} />
            <Tab label="Suggerimenti Brani" {...a11yProps(3)} />
            <Tab label="🍽️ MENÙ" {...a11yProps(4)} />
            <Tab label="Report" {...a11yProps(5)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Dashboard Tab */}
          <DashboardSection />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Family Management Tab */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <AddFamily
              currentIds={new Set(familyData.map(p => p.id))}
              onFamilyAdded={newFamily => {
                setFamilyData([newFamily, ...familyData]);
              }}
            />

            <Box sx={{ width: "100%", maxWidth: 1400 }}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableBody>
                    {familyData
                      .sort((a, b) => a.family.localeCompare(b.family))
                      .map(p => (
                        <FamilyRow familyData={p} key={`family_${p.id}`} />
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Guestbook Moderation Tab */}
          <GuestbookModeration />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Song Suggestions Moderation Tab */}
          <SongSuggestionsModeration />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {/* Menu Management Tab */}
          <MenuEditor />
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          {/* Report Tab */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Report data={familyData} />
          </Box>
        </TabPanel>
      </Box>
    </ThemeProvider>
  );
};
