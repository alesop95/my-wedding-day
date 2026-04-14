import { Box, Typography } from "@mui/material";
import React from "react";
import CardContent from "@mui/material/CardContent/CardContent";

export const WeddingIsOver: React.FC = () => {
  return (
    <CardContent
      sx={{
        height: "90vh",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography
        className={"disable-text-selection"}
        variant={"h2"}
        fontWeight={"Normal"}
        textAlign={"center"}
        fontFamily={"Gwendolyn"}
      >
        Alessio & Beatrice
        <Typography
          className={"disable-text-selection"}
          variant={"h4"}
          fontWeight={"Normal"}
          textAlign={"center"}
          fontFamily={"Gwendolyn"}
        >
          24 Luglio 2027
        </Typography>
      </Typography>
      <Box
        sx={{
          width: "100%",
          minHeight: 240,
          mb: 1,
          direction: "column",
          alignItems: "center",
          display: "flex"
        }}
      >
        <Typography
          variant={"h4"}
          textAlign={"center"}
          fontFamily={"Gwendolyn"}
          sx={{ mt: 6 }}
        >
          Grazie per aver condiviso questa giornata con noi.
        </Typography>
      </Box>
      <Typography
        className={"disable-text-selection"}
        variant={"h3"}
        fontWeight={"Normal"}
        textAlign={"center"}
        fontFamily={"Gwendolyn"}
      >
        Grazie di ❤️a tutti!
      </Typography>
    </CardContent>
  );
};
