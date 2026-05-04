import React from "react";
import {
  Alert,
  Box,
  Typography
} from "@mui/material";

export const MenuEditor: React.FC = () => {
  // Temporaneo: componente semplificato per debug
  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h6" gutterBottom>
        🍽️ Gestione Menù - Interfaccia Debug
      </Typography>
      <Alert severity="info">
        <Typography>
          Il MenuEditor è stato caricato correttamente ma è temporaneamente semplificato.
          <br />
          Le modifiche al menù vanno fatte dalla console Firebase.
        </Typography>
      </Alert>
    </Box>
  );
};