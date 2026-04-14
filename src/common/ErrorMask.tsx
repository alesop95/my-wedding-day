import { Box, Typography } from "@mui/material";
import React from "react";
import Lottie from "lottie-react";
import errorAnimation from "../animation/error.json";
import { errorAnimationWidth } from "../utils/constants";
import { WhatsAppWidget } from "./WhatsAppWidget";
export const ErrorMask = () => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: "100%",
        backdropFilter: "blur(16px)"
      }}
    >
      <Box width={errorAnimationWidth} height={errorAnimationWidth}>
        <Lottie animationData={errorAnimation} loop={true} />
      </Box>
      <Typography variant={"h6"} textAlign={"center"}>
        E tu? che ci fai qui?
        <br />
        questa cosa non sarebbe dovuta accadere.
        <br />
        ma non preoccuparti!
      </Typography>

      <Box mt={2}>
        <WhatsAppWidget />
      </Box>
      <Typography mt={0.5} variant={"body2"} textAlign={"center"}>
        scrivici se hai bisogno di aiuto
      </Typography>
    </Box>
  );
};
