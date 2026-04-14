import { Box, Stack, Typography } from "@mui/material";
import React from "react";

export const LoadingMask: React.FC = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{
        flex: 1,
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(16px)"
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Typography variant={"h5"}> ❤️</Typography>
        <Typography variant={"h3"}>️caricamento...</Typography>
      </Stack>
    </Box>
  );
};
