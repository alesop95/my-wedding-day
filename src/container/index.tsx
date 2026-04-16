import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useResponsiveDimensions } from "../hooks/useResponsiveDimensions";
import thunderbolt from "../animation/N1UsQhJ5jZ.json";
import fire from "../animation/fire.json";
import Lottie from "lottie-react";
import { useAtomValue } from "jotai";
import { easterEggAtom, fireEasterEggAtom } from "../state/easterEggAtom";

const Container = ({ children }: { children: React.ReactNode }) => {
  const easterEgg = useAtomValue(easterEggAtom);
  const fireEasterEgg = useAtomValue(fireEasterEggAtom);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { containerWidth } = useResponsiveDimensions();

  return (
    <Box
      display={"flex"}
      style={{
        justifyContent: "center"
      }}
    >
      {easterEgg && (
        <Box
          display={"flex"}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 10002
          }}
        >
          <Lottie animationData={thunderbolt} loop={true} />
          <Lottie animationData={thunderbolt} loop={true} />

          <Lottie
            animationData={fire}
            loop={true}
            style={{
              display: fireEasterEgg ? "" : "none",
              position: "absolute",
              bottom: isMobile ? "0%" : "-40%",
              width: "100%"
            }}
          />
        </Box>
      )}
      <Box
        style={{
          maxWidth: containerWidth,
          width: "100%"
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Container;
