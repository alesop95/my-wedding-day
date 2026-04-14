import React, { PropsWithChildren } from "react";
import { Box, CardContent, Paper } from "@mui/material";
import { Divider } from "../common/Divider";

type Props = {
  hideDivider?: boolean;
};
export const SectionContainer: React.FC<PropsWithChildren<Props>> = ({
  children,
  hideDivider
}) => (
  <Box>
    <Paper
      sx={{
        mx: 2,
        backgroundColor: "rgba(255,255,255,0.70)",
        color: "rgba(0,0,0,0.77)"
      }}
    >
      <CardContent>{children}</CardContent>
    </Paper>
    {!hideDivider && <Divider />}
  </Box>
);
