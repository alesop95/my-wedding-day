import React from "react";
import {
  Alert,
  Box,
  Typography
} from "@mui/material";

export const MenuEditor: React.FC = () => {
  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gestione Menù
      </Typography>
      <Alert severity="info">
        <Typography>
          <strong>Visualizzazione sola lettura.</strong>
          <br />
          Per aggiungere o modificare piatti del menù, utilizzare la console Firebase (collection: <code>menu</code>).
        </Typography>
      </Alert>
    </Box>
  );
};