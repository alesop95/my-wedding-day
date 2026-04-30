import React, { useState } from "react";
import {
  Alert,
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
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSongSuggestionsAdmin } from "../hooks/useSongSuggestionsAdmin";
import { SongSuggestion } from "../types/songSuggestion";

const DeleteConfirmDialog: React.FC<{
  suggestion: SongSuggestion | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  deleting: boolean;
}> = ({ suggestion, open, onClose, onConfirm, deleting }) => {
  if (!suggestion) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Elimina suggerimento</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Sei sicuro di voler eliminare questo suggerimento? L'operazione è
          irreversibile.
        </DialogContentText>
        <Box sx={{ p: 2, backgroundColor: "background.default", borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {suggestion.songTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {suggestion.artist}
          </Typography>
          {suggestion.note && (
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", mt: 1, whiteSpace: "pre-wrap" }}
            >
              “{suggestion.note}”
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            — {suggestion.authorName} ({suggestion.familyId})
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>
          Annulla
        </Button>
        <Button
          onClick={() => onConfirm(suggestion.id)}
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

export const SongSuggestionsModeration: React.FC = () => {
  const {
    suggestions,
    loading,
    error,
    deleteSuggestion,
    getTotalSuggestions
  } = useSongSuggestionsAdmin();

  const [selected, setSelected] = useState<SongSuggestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleOpenDialog = (s: SongSuggestion) => {
    setSelected(s);
    setDialogOpen(true);
    setDeleteError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelected(null);
    setDeleteError(null);
  };

  const handleConfirmDelete = async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteSuggestion(id)();
      if (result._tag === "Left") {
        setDeleteError(result.left.message);
      } else {
        handleCloseDialog();
      }
    } catch (err) {
      setDeleteError("Errore inaspettato durante l'eliminazione");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography>Caricamento suggerimenti...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ width: "90%", m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Moderazione Suggerimenti Brani ({getTotalSuggestions()})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Errore caricamento suggerimenti: {error.message}
        </Alert>
      )}

      {deleteError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setDeleteError(null)}
        >
          {deleteError}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Brano</TableCell>
              <TableCell>Artista</TableCell>
              <TableCell>Autore</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Famiglia</TableCell>
              <TableCell align="center">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suggestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    Nessun suggerimento presente
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              suggestions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {s.songTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{s.artist}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{s.authorName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inline-block",
                        fontStyle: s.note ? "italic" : "normal",
                        color: s.note ? "text.primary" : "text.disabled"
                      }}
                    >
                      {s.note || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {s.createdAt.toLocaleDateString("it-IT")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {s.familyId}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Elimina suggerimento">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(s)}
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

      <DeleteConfirmDialog
        suggestion={selected}
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />
    </Box>
  );
};
