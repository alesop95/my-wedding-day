import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import {
  LibraryMusic as LibraryMusicIcon,
  OpenInNew as OpenInNewIcon,
  MusicNote as MusicNoteIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { usePlaylist } from "../hooks/usePlaylist";
import {
  useSongSuggestions,
  SONG_SUGGESTION_LIMITS
} from "../hooks/useSongSuggestions";
import { SongSuggestion } from "../types/songSuggestion";

// Trasforma https://open.spotify.com/playlist/ID[?query]
// in https://open.spotify.com/embed/playlist/ID
const toEmbedUrl = (url: string): string | null => {
  const match = url.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/playlist/${match[1]}`;
};

const createFormatTimeAgo = (t: (key: string, options?: any) => string) => {
  return (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t("timeAgo.now");
    if (diffMins === 1) return t("timeAgo.minuteAgo");
    if (diffMins < 60) return t("timeAgo.minutesAgo", { count: diffMins });
    if (diffHours === 1) return t("timeAgo.hourAgo");
    if (diffHours < 24) return t("timeAgo.hoursAgo", { count: diffHours });
    if (diffDays === 1) return t("timeAgo.dayAgo");
    return t("timeAgo.daysAgo", { count: diffDays });
  };
};

const SuggestionCard: React.FC<{
  suggestion: SongSuggestion;
  index: number;
}> = ({ suggestion, index }) => {
  const { t } = useTranslation();
  const formatTimeAgo = createFormatTimeAgo(t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card
        sx={{
          mb: 2,
          backgroundColor: "background.paper",
          boxShadow: 2,
          borderRadius: 2
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MusicNoteIcon color="primary" fontSize="small" />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary.main"
                sx={{ flexGrow: 1 }}
              >
                {suggestion.songTitle}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {formatTimeAgo(suggestion.createdAt)}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {suggestion.artist}
            </Typography>
            {suggestion.note && (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "text.secondary",
                  whiteSpace: "pre-wrap"
                }}
              >
                “{suggestion.note}”
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              — {suggestion.authorName}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const PlaylistSection: React.FC = () => {
  const { t } = useTranslation();
  const { loading, error, isEnabled, spotifyUrl, hasError, isVisible } = usePlaylist();
  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    addSuggestion,
    canSendSuggestion
  } = useSongSuggestions();

  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (!isVisible) {
    return null;
  }

  const embedUrl = spotifyUrl ? toEmbedUrl(spotifyUrl) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSendSuggestion || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await addSuggestion({
        authorName,
        songTitle,
        artist,
        note: note.trim() ? note : undefined
      })();

      if (result._tag === "Left") {
        setSubmitError(result.left.message);
      } else {
        setSongTitle("");
        setArtist("");
        setAuthorName("");
        setNote("");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSubmitError(t("sections.playlist.unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    !isSubmitting &&
    authorName.trim().length > 0 &&
    songTitle.trim().length > 0 &&
    artist.trim().length > 0 &&
    authorName.length <= SONG_SUGGESTION_LIMITS.author &&
    songTitle.length <= SONG_SUGGESTION_LIMITS.title &&
    artist.length <= SONG_SUGGESTION_LIMITS.artist &&
    note.length <= SONG_SUGGESTION_LIMITS.note;

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
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 600, px: 2, width: "100%" }}>
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
                            allow="encrypted-media"
                            style={{ border: 0, display: "block" }}
                          />
                        </Box>
                      </motion.div>
                    )}

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
                        onClick={() =>
                          window.open(spotifyUrl, "_blank", "noopener,noreferrer")
                        }
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

                    <Divider sx={{ width: "100%", my: 2 }} />

                    {/* Form suggerimenti brani */}
                    <Box sx={{ width: "100%", textAlign: "left" }}>
                      <Typography
                        variant="h6"
                        textAlign="center"
                        sx={{ mb: 1, fontWeight: "bold" }}
                      >
                        {t("sections.playlist.suggestions.formTitle")}
                      </Typography>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ mb: 3, color: "text.secondary" }}
                      >
                        {t("sections.playlist.suggestions.formSubtitle")}
                      </Typography>

                      {!canSendSuggestion ? (
                        <Alert severity="info">
                          {t("sections.playlist.suggestions.loginRequired")}
                        </Alert>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <Stack spacing={2}>
                            <TextField
                              label={t("sections.playlist.suggestions.titleLabel")}
                              value={songTitle}
                              onChange={(e) => setSongTitle(e.target.value)}
                              required
                              disabled={isSubmitting}
                              fullWidth
                              variant="outlined"
                              inputProps={{ maxLength: SONG_SUGGESTION_LIMITS.title }}
                            />
                            <TextField
                              label={t("sections.playlist.suggestions.artistLabel")}
                              value={artist}
                              onChange={(e) => setArtist(e.target.value)}
                              required
                              disabled={isSubmitting}
                              fullWidth
                              variant="outlined"
                              inputProps={{ maxLength: SONG_SUGGESTION_LIMITS.artist }}
                            />
                            <TextField
                              label={t("sections.playlist.suggestions.authorLabel")}
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              required
                              disabled={isSubmitting}
                              fullWidth
                              variant="outlined"
                              inputProps={{ maxLength: SONG_SUGGESTION_LIMITS.author }}
                            />
                            <TextField
                              label={t("sections.playlist.suggestions.noteLabel")}
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              disabled={isSubmitting}
                              fullWidth
                              multiline
                              rows={2}
                              variant="outlined"
                              inputProps={{ maxLength: SONG_SUGGESTION_LIMITS.note }}
                              helperText={`${note.length}/${SONG_SUGGESTION_LIMITS.note}`}
                            />

                            {submitError && (
                              <Alert
                                severity="error"
                                onClose={() => setSubmitError(null)}
                              >
                                {submitError}
                              </Alert>
                            )}

                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              disabled={!canSubmit}
                              sx={{ py: 1.2, fontSize: "1rem" }}
                            >
                              {isSubmitting ? (
                                <>
                                  <CircularProgress size={20} sx={{ mr: 1 }} />
                                  {t("sections.playlist.suggestions.sending")}
                                </>
                              ) : (
                                t("sections.playlist.suggestions.submit")
                              )}
                            </Button>
                          </Stack>
                        </form>
                      )}
                    </Box>

                    <Divider sx={{ width: "100%", my: 2 }} />

                    {/* Lista suggerimenti */}
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="h6"
                        textAlign="center"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        {t("sections.playlist.suggestions.listTitle", {
                          count: suggestions.length
                        })}
                      </Typography>

                      {suggestionsLoading ? (
                        <Box display="flex" justifyContent="center" py={3}>
                          <CircularProgress size={28} />
                        </Box>
                      ) : suggestionsError ? (
                        <Alert severity="error">
                          {suggestionsError.message}
                        </Alert>
                      ) : suggestions.length === 0 ? (
                        <Typography
                          variant="body2"
                          textAlign="center"
                          sx={{ color: "text.secondary", py: 3 }}
                        >
                          {t("sections.playlist.suggestions.emptyList")}
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            maxHeight: 480,
                            overflowY: "auto",
                            px: 1
                          }}
                        >
                          <AnimatePresence>
                            {suggestions.map((s, i) => (
                              <SuggestionCard key={s.id} suggestion={s} index={i} />
                            ))}
                          </AnimatePresence>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </motion.div>
        )}
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {t("sections.playlist.suggestions.successToast")}
        </Alert>
      </Snackbar>
    </SectionContainer>
  );
};
