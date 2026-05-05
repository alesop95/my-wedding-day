import React, { PropsWithChildren } from "react";
import { Box, CardContent, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Divider } from "../common/Divider";

type Props = {
  hideDivider?: boolean;
  backgroundSvg?: string;
  overlayOpacity?: number;
};

export const SectionContainer: React.FC<PropsWithChildren<Props>> = ({
  children,
  hideDivider,
  backgroundSvg,
  overlayOpacity = 0.7
}) => (
  <Box sx={{ position: 'relative' }}>
    {backgroundSvg && (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-20%' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          zIndex: 0
        }}
      />
    )}
    {backgroundSvg && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
          zIndex: 1
        }}
      />
    )}
    <Paper
      sx={{
        mx: 2,
        backgroundColor: backgroundSvg
          ? "transparent"
          : "rgba(255,255,255,0.70)",
        color: "rgba(0,0,0,0.77)",
        position: 'relative',
        zIndex: 2
      }}
    >
      <CardContent>{children}</CardContent>
    </Paper>
    {!hideDivider && <Divider />}
  </Box>
);
