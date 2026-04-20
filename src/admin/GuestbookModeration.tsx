import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Chip,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGuestbookAdmin } from "../hooks/useGuestbookAdmin";
import { GuestbookEntry } from "../types/guestbook";

const MessagePreviewDialog: React.FC<{
  message: GuestbookEntry | null;
  open: boolean;
  onClose: () => void;
  onDelete: (messageId: string) => void;
  deleting: boolean;
}> = ({ message, open, onClose, onDelete, deleting }) => {
  if (!message) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Messaggio di {message.authorName}</Typography>
          <Chip
            label={message.createdAt.toLocaleDateString()}
            variant="outlined"
            size="small"
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
          {message.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ID Famiglia: {message.familyId}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Chiudi
        </Button>
        <Button
          onClick={() => onDelete(message.id)}
          color="error"
          variant="contained"
          disabled={deleting}
        >
          {deleting ? "Eliminando..." : "Elimina"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const GuestbookModeration: React.FC = () => {
  const { messages, loading, error, deleteMessage, getTotalMessages } = useGuestbookAdmin();
  const [selectedMessage, setSelectedMessage] = useState<GuestbookEntry | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (messageId: string) => {
    setDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteMessage(messageId)();

      if (result._tag === "Left") {
        setDeleteError(result.left.message);
      } else {
        // Successo - chiudi dialog
        setPreviewOpen(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      setDeleteError("Errore inaspettato durante l'eliminazione");
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = (message: GuestbookEntry) => {
    setSelectedMessage(message);
    setPreviewOpen(true);
    setDeleteError(null);
  };

  if (loading) {
    return (
      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography>Caricamento messaggi...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ width: "90%", m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Moderazione Guestbook ({getTotalMessages()} messaggi)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Errore caricamento messaggi: {error.message}
        </Alert>
      )}

      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Autore</TableCell>
              <TableCell>Messaggio (anteprima)</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Famiglia</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    Nessun messaggio presente
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {message.authorName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {message.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {message.createdAt.toLocaleDateString('it-IT')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {message.familyId}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Visualizza messaggio completo">
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(message)}
                          color="primary"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Elimina messaggio">
                        <IconButton
                          size="small"
                          onClick={() => handlePreview(message)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <MessagePreviewDialog
        message={selectedMessage}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedMessage(null);
          setDeleteError(null);
        }}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </Box>
  );
};