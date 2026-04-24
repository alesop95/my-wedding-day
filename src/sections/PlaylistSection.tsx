import React from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  CircularProgress
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import {
  LibraryMusic as LibraryMusicIcon,
  OpenInNew as OpenInNewIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { usePlaylist } from "../hooks/usePlaylist";

// Trasforma https://open.spotify.com/playlist/ID[?query]
// in https://open.spotify.com/embed/playlist/ID
const toEmbedUrl = (url: string): string | null => {
  const match = url.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/playlist/${match[1]}`;
};

export const PlaylistSection: React.FC = () => {
  const { t } = useTranslation();
  const { loading, error, isEnabled, spotifyUrl, hasError, isVisible } = usePlaylist();

  if (!isVisible) {
    return null;
  }

  const embedUrl = spotifyUrl ? toEmbedUrl(spotifyUrl) : null;

  return (
    <SectionContainer>
      <Stack direction="column" alignItems="center" spacing={4}>
        <SectionHeader
          imgSrc="../sections/calendar.png"
          altImage={t("sections.playlist.title")}
          title={t("sections.playlist.title")}
        />

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {hasError && (
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error || t("sections.playlist.loadError")}
          </Alert>
        )}

        {!loading && !hasError && isEnabled && spotifyUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 600, px: 2 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ mb: 3, color: "text.secondary" }}
              >
                {t("sections.playlist.subtitle")}
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
              >
                {t("sections.playlist.description")}
              </Typography>

              <Card
                sx={{
                  p: 4,
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 3
                }}
              >
                <CardContent>
                  <Stack spacing={3} alignItems="center">
                    {/* Embed Spotify */}
                    {embedUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        style={{ width: "100%" }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: 1
                          }}
                        >
                          <iframe
                            title={t("sections.playlist.title")}
                            src={embedUrl}
                            width="100%"
                            height="380"
                            frameBorder="0"
                            allow="encrypted-media"
                            style={{ border: 0, display: "block" }}
                          />
                        </Box>
                      </motion.div>
                    )}

                    {/* QR Code */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "white",
                          borderRadius: 2,
                          display: "inline-block",
                          boxShadow: 1
                        }}
                      >
                        <QRCodeSVG
                          value={spotifyUrl}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="M"
                          style={{ padding: "16px" }}
                        />
                      </Box>
                    </motion.div>

                    <Typography
                      variant="h6"
                      textAlign="center"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      {t("sections.playlist.instruction")}
                    </Typography>

                    <Typography
                      variant="body2"
                      textAlign="center"
                      sx={{ color: "text.secondary", maxWidth: 400 }}
                    >
                      {t("sections.playlist.howTo")}
                    </Typography>

                    {/* Fallback Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45, duration: 0.5 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<LibraryMusicIcon />}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => window.open(spotifyUrl, "_blank", "noopener,noreferrer")}
                        sx={{
                          py: 1.5,
                          px: 3,
                          fontSize: "1.1rem",
                          borderRadius: 3
                        }}
                      >
                        {t("sections.playlist.openSpotify")}
                      </Button>
                    </motion.div>

                    <Box
                      sx={{
                        backgroundColor: "info.main",
                        color: "info.contrastText",
                        p: 2,
                        borderRadius: 2,
                        mt: 2
                      }}
                    >
                      <Typography variant="body2" textAlign="center">
                        {t("sections.playlist.tip")}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </motion.div>
        )}
      </Stack>
    </SectionContainer>
  );
};
