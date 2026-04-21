import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { useDashboard } from "../hooks/useDashboard";
import { rsvpToPieChartData, sideToBarChartData, groupCocktailPreferences, groupAllergies } from "../utils/rsvpStats";
import { motion } from "framer-motion";

// Summary card component
const SummaryCard: React.FC<{
  title: string;
  value: number | string;
  subtitle?: string;
  color?: string;
}> = ({ title, value, subtitle, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h3"
          component="div"
          fontWeight="bold"
          color={color || "primary.main"}
          sx={{ mb: 1 }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

// Allergies table component
const AllergiesTable: React.FC<{
  allergiesData: Array<{
    memberName: string;
    allergies: string[];
    dietaryNotes?: string;
  }>;
}> = ({ allergiesData }) => {
  const { t } = useTranslation();

  if (allergiesData.length === 0) {
    return (
      <Alert severity="info">
        {t("sections.dashboard.noAllergiesData")}
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("sections.dashboard.memberName")}</TableCell>
            <TableCell>{t("sections.dashboard.allergies")}</TableCell>
            <TableCell>{t("sections.dashboard.dietaryNotes")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allergiesData.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.memberName}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {row.allergies.map((allergy, i) => (
                    <Chip
                      key={i}
                      label={allergy}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                {row.dietaryNotes || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Cocktail preferences table component
const CocktailTable: React.FC<{
  preferences: Array<{
    memberName: string;
    preference: string;
  }>;
}> = ({ preferences }) => {
  const { t } = useTranslation();

  if (preferences.length === 0) {
    return (
      <Alert severity="info">
        {t("sections.dashboard.noCocktailData")}
      </Alert>
    );
  }

  // Convert simplified format to grouped preferences
  const grouped: Record<string, number> = {};
  preferences.forEach(pref => {
    const drink = pref.preference.toLowerCase().trim();
    grouped[drink] = (grouped[drink] || 0) + 1;
  });
  const sortedPreferences = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1]);

  return (
    <Box>
      {/* Summary of popular drinks */}
      <Typography variant="h6" gutterBottom>
        {t("sections.dashboard.popularDrinks")}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
        {sortedPreferences.slice(0, 5).map(([drink, count]) => (
          <Chip
            key={drink}
            label={`${drink} (${count})`}
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      {/* Detailed table */}
      <Typography variant="h6" gutterBottom>
        {t("sections.dashboard.detailedPreferences")}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("sections.dashboard.memberName")}</TableCell>
              <TableCell>{t("sections.dashboard.drinkPreference")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preferences.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.memberName}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.preference}
                    size="small"
                    color="secondary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export const DashboardSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error, hasData } = useDashboard();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    if (!data) return;

    setIsGeneratingPDF(true);
    try {
      // TODO: Implement PDF generation with jsPDF
      // This is a placeholder for the PDF generation functionality
      console.log("PDF generation would happen here", data);
      alert("PDF generation feature coming soon!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Errore nella generazione del PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <SectionContainer>
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer>
        <Alert severity="error">
          {t("sections.dashboard.loadError")}: {error.message}
        </Alert>
      </SectionContainer>
    );
  }

  if (!hasData || !data) {
    return (
      <SectionContainer>
        <Alert severity="info">
          {t("sections.dashboard.noData")}
        </Alert>
      </SectionContainer>
    );
  }

  const pieData = rsvpToPieChartData(data.rsvpSummary);
  const barData = sideToBarChartData(data.sideSummary);

  return (
    <SectionContainer>
      <Stack direction="column" alignItems="center" spacing={4}>
        <SectionHeader
          imgSrc="../sections/calendar.png"
          altImage={t("sections.dashboard.title")}
          title={t("sections.dashboard.title")}
        />

        {/* PDF Generation Button */}
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          size="large"
        >
          {isGeneratingPDF
            ? t("sections.dashboard.generatingPDF")
            : t("sections.dashboard.downloadReport")
          }
        </Button>

        {/* Summary Cards */}
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 3 }}>
            {t("sections.dashboard.rsvpSummary")}
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title={t("sections.dashboard.totalInvited")}
                value={data.rsvpSummary.total}
                subtitle={t("sections.dashboard.people")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title={t("sections.dashboard.confirmed")}
                value={data.rsvpSummary.confirmed}
                subtitle={`${data.rsvpSummary.confirmationRate}%`}
                color="success.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title={t("sections.dashboard.declined")}
                value={data.rsvpSummary.declined}
                color="error.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title={t("sections.dashboard.pending")}
                value={data.rsvpSummary.pending}
                color="warning.main"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Charts */}
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Grid container spacing={4}>
            {/* Bar Chart - RSVP by Side */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    {t("sections.dashboard.rsvpBySide")}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="side" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="confirmed" fill="#4caf50" name={t("sections.dashboard.confirmed")} />
                      <Bar dataKey="declined" fill="#f44336" name={t("sections.dashboard.declined")} />
                      <Bar dataKey="maybe" fill="#ff9800" name={t("sections.dashboard.maybe")} />
                      <Bar dataKey="pending" fill="#9e9e9e" name={t("sections.dashboard.pending")} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Pie Chart - Overall RSVP Status */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom textAlign="center">
                    {t("sections.dashboard.overallStatus")}
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ width: "80%" }} />

        {/* Allergies Section */}
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 3 }}>
            {t("sections.dashboard.allergiesTitle")}
          </Typography>
          <AllergiesTable allergiesData={data.allergiesList} />
        </Box>

        <Divider sx={{ width: "80%" }} />

        {/* Cocktail Preferences Section */}
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 3 }}>
            {t("sections.dashboard.cocktailTitle")}
          </Typography>
          <CocktailTable preferences={data.cocktailPreferences} />
        </Box>

        {/* Last Updated */}
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {t("sections.dashboard.lastUpdated")}: {data.lastUpdated.toLocaleString()}
        </Typography>
      </Stack>
    </SectionContainer>
  );
};