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
  PhotoCamera as PhotoCameraIcon,
  OpenInNew as OpenInNewIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { usePhotoSharing } from "../hooks/usePhotoSharing";

export const PhotoSharingSection: React.FC = () => {
  const { t } = useTranslation();
  const { loading, error, isEnabled, driveUrl, hasError, isVisible } = usePhotoSharing();

  // Simple visibility logic: use the isVisible from hook (handles all cases)
  if (!isVisible) {
    return null;
  }

  return (
    <SectionContainer backgroundSvg="/backgrounds/bg-gift.svg" overlayOpacity={0.5}>
      <Stack direction="column" alignItems="center" spacing={4}>
        <SectionHeader
          imgSrc="../sections/calendar.png"
          altImage={t("sections.photoSharing.title")}
          title={t("sections.photoSharing.title")}
        />

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {hasError && (
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error || t("sections.photoSharing.loadError")}
          </Alert>
        )}

        {!loading && !hasError && isEnabled && driveUrl && (
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
                {t("sections.photoSharing.subtitle")}
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 4, color: "text.secondary", lineHeight: 1.6 }}
              >
                {t("sections.photoSharing.description")}
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
                    {/* QR Code */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
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
                          value={driveUrl}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="M"
                          style={{ padding: "16px" }}
                        />
                      </Box>
                    </motion.div>

                    {/* Instructions */}
                    <Typography
                      variant="h6"
                      textAlign="center"
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      {t("sections.photoSharing.instruction")}
                    </Typography>

                    <Typography
                      variant="body2"
                      textAlign="center"
                      sx={{ color: "text.secondary", maxWidth: 400 }}
                    >
                      {t("sections.photoSharing.howTo")}
                    </Typography>

                    {/* Fallback Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<PhotoCameraIcon />}
                        endIcon={<OpenInNewIcon />}
                        onClick={() => window.open(driveUrl, "_blank", "noopener,noreferrer")}
                        sx={{
                          py: 1.5,
                          px: 3,
                          fontSize: "1.1rem",
                          borderRadius: 3
                        }}
                      >
                        {t("sections.photoSharing.openDrive")}
                      </Button>
                    </motion.div>

                    {/* Additional Info */}
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
                        💡 {t("sections.photoSharing.tip")}
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