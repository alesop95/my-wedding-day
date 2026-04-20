import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { SectionHeader } from "../common/SectionHeader";
import { SectionContainer } from "./SectionContainer";
import { useGuestbook } from "../hooks/useGuestbook";
import { motion, AnimatePresence } from "framer-motion";
// Funzione per formattare tempo relativo senza date-fns
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "ora";
  if (diffMins === 1) return "1 minuto fa";
  if (diffMins < 60) return `${diffMins} minuti fa`;
  if (diffHours === 1) return "1 ora fa";
  if (diffHours < 24) return `${diffHours} ore fa`;
  if (diffDays === 1) return "1 giorno fa";
  return `${diffDays} giorni fa`;
};

const MAX_MESSAGE_LENGTH = 500;

const MessageCard: React.FC<{
  authorName: string;
  message: string;
  createdAt: Date;
  index: number;
}> = ({ authorName, message, createdAt, index }) => {
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }}
    >
      <Card
        sx={{
          mb: 2,
          backgroundColor: "background.paper",
          boxShadow: 2,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="primary.main"
              >
                {authorName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {timeAgo}
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const GuestbookSection: React.FC = () => {
  const { messages, loading, error, sendMessage, canSendMessage } = useGuestbook();
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSendMessage || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await sendMessage(authorName, message)();

      if (result._tag === "Left") {
        setSubmitError(result.left.message);
      } else {
        // Successo
        setAuthorName("");
        setMessage("");
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      setSubmitError("Errore inaspettato durante l'invio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;
  const isOverLimit = remainingChars < 0;

  return (
    <SectionContainer>
      <Stack direction="column" alignItems="center" spacing={3}>
        <SectionHeader
          imgSrc="../sections/calendar.png"
          altImage="calendario messaggi"
          title="Lascia un messaggio"
        />

        <Typography
          variant="h4"
          textAlign="center"
          sx={{ px: 1, color: "text.secondary" }}
        >
          Condividi i tuoi auguri con noi!
          <br />
          I vostri messaggi rendono questo giorno ancora più speciale.
        </Typography>

        {/* Form per nuovo messaggio */}
        {canSendMessage && (
          <Card sx={{ width: "100%", maxWidth: 600, p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Il tuo nome"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  fullWidth
                  variant="outlined"
                />

                <Box>
                  <TextField
                    label="Il tuo messaggio"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={isSubmitting}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    error={isOverLimit}
                    helperText={
                      isOverLimit
                        ? `Messaggio troppo lungo (${Math.abs(remainingChars)} caratteri in eccesso)`
                        : `${remainingChars} caratteri rimanenti`
                    }
                  />
                </Box>

                {submitError && (
                  <Alert severity="error" onClose={() => setSubmitError(null)}>
                    {submitError}
                  </Alert>
                )}

                {submitSuccess && (
                  <Alert severity="success">
                    Messaggio inviato con successo! Grazie per i tuoi auguri.
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    isSubmitting ||
                    !authorName.trim() ||
                    !message.trim() ||
                    isOverLimit
                  }
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Invio in corso...
                    </>
                  ) : (
                    "Invia messaggio"
                  )}
                </Button>
              </Stack>
            </form>
          </Card>
        )}

        {!canSendMessage && (
          <Alert severity="info" sx={{ width: "100%", maxWidth: 600 }}>
            Per lasciare un messaggio devi accedere tramite il link personalizzato della tua famiglia.
          </Alert>
        )}

        <Divider sx={{ width: "80%", my: 3 }} />

        {/* Lista messaggi */}
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Messaggi degli ospiti ({messages.length})
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Errore nel caricamento dei messaggi: {error.message}
            </Alert>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "text.secondary"
              }}
            >
              <Typography variant="h6" gutterBottom>
                Nessun messaggio ancora...
              </Typography>
              <Typography variant="body2">
                Sii il primo a lasciare i tuoi auguri!
              </Typography>
            </Box>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <MessageCard
                  key={msg.id}
                  authorName={msg.authorName}
                  message={msg.message}
                  createdAt={msg.createdAt}
                  index={index}
                />
              ))}
            </AnimatePresence>
          )}
        </Box>
      </Stack>
    </SectionContainer>
  );
};